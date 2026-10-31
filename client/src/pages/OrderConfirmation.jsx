import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { formatPrice } from '../utils/formatCurrency';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If order is not in navigation state, fetch from /api/orders/mine
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const { data } = await api.get('/orders/mine');
          if (data.orders) {
            const found = data.orders.find((o) => o._id === id);
            if (found) {
              setOrder(found);
            } else {
              setError('Order reference not found in your account history.');
            }
          }
        } catch (err) {
          console.error('Error fetching order confirmation:', err);
          setError('Unable to load order details.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="confirmation-loading-screen">
        <div className="spinner" />
        <p>Loading your atelier order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="confirmation-error-container">
        <div className="empty-cart-card">
          <span className="empty-cart-tag">Order Reference</span>
          <h2 className="empty-cart-title">Order Details Unavailable</h2>
          <p className="empty-cart-text">
            {error || 'We could not find the specified order confirmation.'}
          </p>
          <div className="confirmation-actions">
            <Link to="/my-orders" className="btn-primary">
              View Order History
            </Link>
            <Link to="/shop" className="btn-secondary">
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format order date
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString(
    'en-IN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-hero">
        <div className="success-icon-wrap">
          <svg
            className="success-checkmark"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <span className="confirmation-tag">Atelier Confirmation</span>
        <h1 className="confirmation-title">Thank You For Your Order</h1>
        <p className="confirmation-subtitle">
          Your order has been recorded and is currently being prepared by our atelier team.
        </p>

        <div className="order-reference-pill">
          <span>Order Reference: <strong>#{order._id}</strong></span>
        </div>
      </div>

      <div className="confirmation-content-card">
        {/* Top Info Grid */}
        <div className="confirmation-summary-grid">
          <div className="summary-block">
            <span className="block-label">Date Placed</span>
            <span className="block-val">{orderDate}</span>
          </div>

          <div className="summary-block">
            <span className="block-label">Status</span>
            <span className={`status-badge status-${order.status || 'pending'}`}>
              {(order.status || 'pending').toUpperCase()}
            </span>
          </div>

          <div className="summary-block">
            <span className="block-label">Payment Method</span>
            <span className="block-val">{order.paymentMethod || 'Cash on Delivery'}</span>
          </div>

          <div className="summary-block">
            <span className="block-label">Total Amount</span>
            <span className="block-val total-amount">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>

        <div className="confirmation-divider" />

        {/* Shipping Destination */}
        <div className="confirmation-shipping-block">
          <h3 className="subheading">Shipping Destination</h3>
          <div className="shipping-address-box">
            <p className="recipient-name">
              <strong>{order.shippingAddress?.fullName}</strong>
            </p>
            <p className="address-line">{order.shippingAddress?.address}</p>
            <p className="address-line">
              {order.shippingAddress?.city} &mdash; {order.shippingAddress?.postalCode}
            </p>
            <p className="phone-line">
              Contact: +91 {order.shippingAddress?.phone}
            </p>
          </div>
        </div>

        <div className="confirmation-divider" />

        {/* Line Items */}
        <div className="confirmation-items-block">
          <h3 className="subheading">Purchased Items ({order.items?.length || 0})</h3>
          <div className="confirmed-items-list">
            {order.items?.map((item, idx) => {
              // item.product may be an object if populated or just an ID
              const productObj = typeof item.product === 'object' ? item.product : null;
              const imageUrl = productObj?.images?.[0] || '';

              return (
                <div key={idx} className="confirmed-item-row">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="confirmed-item-img"
                    />
                  )}
                  <div className="confirmed-item-info">
                    <h4 className="confirmed-item-name">{item.name}</h4>
                    <div className="confirmed-item-tags">
                      <span className="tag-pill">Size: {item.size}</span>
                      <span className="tag-pill">Color: {item.color}</span>
                      <span className="tag-pill">Qty: {item.qty}</span>
                    </div>
                  </div>
                  <div className="confirmed-item-price">
                    <span className="price-bold">
                      {formatPrice(item.price * item.qty)}
                    </span>
                    <span className="unit-hint">({formatPrice(item.price)} each)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="confirmation-divider" />

        {/* Action Buttons */}
        <div className="confirmation-footer-actions">
          <Link to="/my-orders" className="btn-primary">
            View All My Orders &rarr;
          </Link>
          <Link to="/shop" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
