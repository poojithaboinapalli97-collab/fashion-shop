const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * @desc    Create new order with server-recomputed prices & variant stock validation
 * @route   POST /api/orders
 * @access  Private (protect middleware)
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // 1. Validate items presence
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // 2. Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required (Full Name, Address, City, Postal Code, Phone)',
      });
    }

    const verifiedItems = [];
    let totalPrice = 0;

    // 3. Verify products, variant stocks, and recompute pricing directly from database
    for (const item of items) {
      if (!item.product || !item.size || !item.color || !item.qty) {
        return res.status(400).json({
          success: false,
          message: 'Each item must specify product ID, size, color, and quantity',
        });
      }

      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.product}`,
        });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || item.product} not found`,
        });
      }

      // Match exact variant
      const variant = product.variants.find(
        (v) =>
          v.size.toLowerCase() === item.size.toLowerCase() &&
          v.color.toLowerCase() === item.color.toLowerCase()
      );

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variant (${item.size} / ${item.color}) does not exist for ${product.name}`,
        });
      }

      // Check stock availability
      if (variant.stock <= 0) {
        return res.status(400).json({
          success: false,
          message: `${product.name} (${item.size} / ${item.color}) is completely out of stock`,
        });
      }

      if (variant.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} (${item.size} / ${item.color}). Only ${variant.stock} left in stock`,
        });
      }

      // Recompute price directly from product document (NEVER trust client price)
      const itemPrice = product.price;
      const lineTotal = itemPrice * item.qty;
      totalPrice += lineTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        size: variant.size,
        color: variant.color,
        qty: item.qty,
        price: itemPrice,
      });
    }

    // 4. Safely decrement stock for each verified variant
    for (const item of verifiedItems) {
      await Product.updateOne(
        {
          _id: item.product,
          'variants.size': item.size,
          'variants.color': item.color,
        },
        {
          $inc: { 'variants.$.stock': -item.qty },
        }
      );
    }

    // 5. Save order with status 'pending'
    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        phone: shippingAddress.phone.trim(),
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      totalPrice,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/mine
 * @access  Private (protect middleware)
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images brand');

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product', 'name images brand');

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status & restore stock on cancellation (Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];

    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses are: ${allowedStatuses.join(', ')}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const normalizedStatus = status.toLowerCase();
    const previousStatus = order.status;

    // If an order is being cancelled and wasn't cancelled before, restore variant stock
    if (previousStatus !== 'cancelled' && normalizedStatus === 'cancelled') {
      for (const item of order.items) {
        if (item.product) {
          await Product.updateOne(
            {
              _id: item.product,
              'variants.size': item.size,
              'variants.color': item.color,
            },
            {
              $inc: { 'variants.$.stock': item.qty },
            }
          );
        }
      }
    }

    // If changing from cancelled to an active status, safely re-decrement stock
    if (previousStatus === 'cancelled' && normalizedStatus !== 'cancelled') {
      for (const item of order.items) {
        if (item.product) {
          await Product.updateOne(
            {
              _id: item.product,
              'variants.size': item.size,
              'variants.color': item.color,
            },
            {
              $inc: { 'variants.$.stock': -item.qty },
            }
          );
        }
      }
    }

    order.status = normalizedStatus;
    await order.save();

    // Re-fetch populated order to return complete data
    const updatedOrder = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name images brand');

    res.status(200).json({
      success: true,
      message: `Order status updated to ${normalizedStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};

