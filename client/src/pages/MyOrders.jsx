import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { formatPrice } from '../utils/formatCurrency';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get('/orders/mine');
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.customMessage || 'Failed to retrieve order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading your atelier orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <span className="orders-tag">Purchase History</span>
        <h1 className="orders-title">My Atelier Orders</h1>
        <p className="orders-subtitle">
          Track current dispatches and review your luxury garments history
        </p>
      </div>

      {error && (
        <div className="checkout-error-banner" role="alert">
          <span className="error-icon">&#9888;</span>
          <p>{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-cart-card empty-orders-card">
          <div className="empty-cart-icon">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <span className="empty-cart-tag">No Purchases Yet</span>
          <h2 className="empty-cart-title">You have not placed any orders</h2>
          <p className="empty-cart-text">
            When you complete an order at Aura Atelier, you will be able to monitor
            its progress and review invoice records right here.
          </p>
          <Link to="/shop" className="btn-primary btn-empty-cart">
            Explore Curated Collection
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString(
              'en-IN',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }
            );

            return (
              <div key={order._id} className="order-history-card">
                <div className="order-card-header">
                  <div className="order-header-left">
                    <span className="order-id-label">Order Ref:</span>
                    <span className="order-id-val">#{order._id}</span>
                    <span className="order-date-divider">&bull;</span>
                    <span className="order-date-val">{formattedDate}</span>
                  </div>

                  <div className="order-header-right">
                    <span className={`status-badge status-${order.status || 'pending'}`}>
                      {(order.status || 'pending').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="order-card-items">
                  {order.items?.map((item, idx) => {
                    const productObj = typeof item.product === 'object' ? item.product : null;
                    const imageUrl = productObj?.images?.[0] || '';

                    return (
                      <div key={idx} className="order-item-row">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="order-item-img"
                          />
                        ) : (
                          <div className="order-item-img-placeholder">
                            <span>👗</span>
                          </div>
                        )}

                        <div className="order-item-info">
                          <h4 className="order-item-title">
                            {productObj ? (
                              <Link to={`/product/${productObj._id}`}>
                                {item.name}
                              </Link>
                            ) : (
                              item.name
                            )}
                          </h4>
                          <div className="order-item-specs">
                            <span>Size: <strong>{item.size}</strong></span>
                            <span>Color: <strong>{item.color}</strong></span>
                            <span>Qty: <strong>{item.qty}</strong></span>
                          </div>
                        </div>

                        <div className="order-item-pricing">
                          <span className="order-item-total">
                            {formatPrice(item.price * item.qty)}
                          </span>
                          <span className="order-item-unit">
                            {formatPrice(item.price)} each
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer with totals and shipping info */}
                <div className="order-card-footer">
                  <div className="order-shipping-summary">
                    <span className="shipping-to-label">Delivering to:</span>
                    <span className="shipping-to-val">
                      {order.shippingAddress?.fullName}, {order.shippingAddress?.city} ({order.shippingAddress?.postalCode})
                    </span>
                  </div>

                  <div className="order-total-summary">
                    <span className="order-total-label">Total Amount:</span>
                    <span className="order-total-amount">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
