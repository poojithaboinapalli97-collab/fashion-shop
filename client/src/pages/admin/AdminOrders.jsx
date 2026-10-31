import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatCurrency';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & search states
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Expanded row IDs set
  const [expandedRows, setExpandedRows] = useState(new Set());
  // Updating status ID map
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/orders');
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
      setError(err.customMessage || 'Failed to retrieve orders list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingIds((prev) => new Set(prev).add(orderId));

      const { data } = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (data.success && data.order) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? data.order : o))
        );

        if (newStatus === 'cancelled') {
          toast.success(
            `Order #${orderId.slice(-6).toUpperCase()} marked as CANCELLED. Variant stock restored to inventory!`,
            { icon: '📦', duration: 4500 }
          );
        } else {
          toast.success(
            `Order #${orderId.slice(-6).toUpperCase()} updated to ${newStatus.toUpperCase()}`
          );
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(
        err.response?.data?.message ||
        err.customMessage ||
        'Failed to update order status.'
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'All' ||
        order.status?.toLowerCase() === statusFilter.toLowerCase();

      const customerName = order.user?.name || order.shippingAddress?.fullName || '';
      const customerEmail = order.user?.email || '';
      const orderIdStr = order._id || '';
      const city = order.shippingAddress?.city || '';

      const query = searchTerm.toLowerCase();
      const matchesSearch =
        orderIdStr.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        customerEmail.toLowerCase().includes(query) ||
        city.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  return (
    <div className="admin-orders-view">
      <div className="admin-view-header">
        <div>
          <span className="admin-section-tag">Order Lifecycle</span>
          <h1 className="admin-page-title">Orders & Fulfillment</h1>
          <p className="admin-page-desc">
            Monitor dispatch progress, review delivery destinations, and manage statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="btn-secondary btn-sm"
          title="Refresh orders list"
        >
          &#8635; Refresh Orders
        </button>
      </div>

      {error && (
        <div className="admin-error-banner" role="alert">
          <span className="error-icon">&#9888;</span>
          <p>{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="admin-table-controls">
        <div className="admin-search-wrap">
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by order ID, customer name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="btn-clear-search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="admin-filter-dropdowns">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select-filter"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-container">
          <div className="spinner" />
          <p>Retrieving orders records...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty-state">
          <p>No orders found matching the chosen criteria.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-data-table orders-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }} />
                <th>Order Ref</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status Lifecycle</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isExpanded = expandedRows.has(order._id);
                const isUpdating = updatingIds.has(order._id);

                const dateStr = new Date(order.createdAt).toLocaleDateString(
                  'en-IN',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }
                );

                const totalItemsQty =
                  order.items?.reduce((s, i) => s + i.qty, 0) || 0;

                return (
                  <React.Fragment key={order._id}>
                    <tr
                      className={`order-row ${isExpanded ? 'expanded-parent' : ''}`}
                      onClick={() => toggleRowExpansion(order._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-expand-row"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(order._id);
                          }}
                        >
                          {isExpanded ? '▾' : '▸'}
                        </button>
                      </td>

                      <td>
                        <span className="font-mono font-bold block text-primary">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-muted text-xs block">
                          {totalItemsQty} {totalItemsQty === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      <td>
                        <span className="font-semibold block text-primary">
                          {order.user?.name || order.shippingAddress?.fullName || 'Guest Customer'}
                        </span>
                        <span className="text-muted text-xs block">
                          {order.user?.email || order.shippingAddress?.phone}
                        </span>
                      </td>

                      <td className="text-sm text-secondary">{dateStr}</td>

                      <td className="font-bold text-primary">
                        {formatPrice(order.totalPrice)}
                      </td>

                      <td>
                        <span className="payment-method-tag">
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>

                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="status-control-cell">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            disabled={isUpdating}
                            className={`status-select status-${order.status || 'pending'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {isUpdating && <span className="btn-spinner tiny" />}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Order Details Row */}
                    {isExpanded && (
                      <tr className="order-details-expand-row">
                        <td colSpan={7}>
                          <div className="order-expanded-container">
                            <div className="expanded-details-grid">
                              {/* Shipping Information */}
                              <div className="expanded-info-box">
                                <h4 className="expanded-box-title">
                                  Delivery Destination
                                </h4>
                                <div className="shipping-address-summary">
                                  <p className="font-semibold text-primary">
                                    {order.shippingAddress?.fullName}
                                  </p>
                                  <p>{order.shippingAddress?.address}</p>
                                  <p>
                                    {order.shippingAddress?.city} &mdash;{' '}
                                    {order.shippingAddress?.postalCode}
                                  </p>
                                  <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
                                    Mobile: +91 {order.shippingAddress?.phone}
                                  </p>
                                </div>

                                <div className="expanded-order-meta">
                                  <span className="meta-item">
                                    Full ID: <code>{order._id}</code>
                                  </span>
                                  {order.status === 'cancelled' && (
                                    <span className="stock-restored-pill">
                                      &#10003; Variant stocks restored
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Items Breakdown */}
                              <div className="expanded-items-box">
                                <h4 className="expanded-box-title">
                                  Ordered Garments ({order.items?.length || 0})
                                </h4>
                                <div className="expanded-items-list">
                                  {order.items?.map((item, idx) => {
                                    const prod =
                                      typeof item.product === 'object'
                                        ? item.product
                                        : null;
                                    const img = prod?.images?.[0] || '';

                                    return (
                                      <div key={idx} className="expanded-item-row">
                                        <div className="expanded-item-thumb">
                                          {img ? (
                                            <img src={img} alt={item.name} />
                                          ) : (
                                            <span>👗</span>
                                          )}
                                        </div>

                                        <div className="expanded-item-info">
                                          <span className="item-name">{item.name}</span>
                                          <div className="item-specs">
                                            <span className="spec-pill">Size: {item.size}</span>
                                            <span className="spec-pill">Color: {item.color}</span>
                                            <span className="spec-pill">Qty: {item.qty}</span>
                                          </div>
                                        </div>

                                        <div className="expanded-item-price">
                                          <span className="total-bold">
                                            {formatPrice(item.price * item.qty)}
                                          </span>
                                          <span className="unit-text">
                                            ({formatPrice(item.price)} each)
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
