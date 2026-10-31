const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * @desc    Get administrative dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueResult] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      stats: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
};
