import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatCurrency';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats and orders concurrently
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/orders'),
        ]);

        if (statsRes.data) {
          setStats({
            totalOrders: statsRes.data.totalOrders ?? 0,
            totalRevenue: statsRes.data.totalRevenue ?? 0,
            totalProducts: statsRes.data.totalProducts ?? 0,
            totalUsers: statsRes.data.totalUsers ?? 0,
          });
        }

        if (ordersRes.data?.orders) {
          // Take the 5 most recent orders
          setRecentOrders(ordersRes.data.orders.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err.customMessage || 'Failed to retrieve administrative statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner" />
        <p>Aggregating atelier metrics...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-view">
      {/* Header Banner */}
      <div className="dashboard-header-banner">
        <div>
          <span className="admin-section-tag">Executive Summary</span>
          <h1 className="admin-page-title">Atelier Performance</h1>
          <p className="admin-page-desc">
            Real-time sales, order lifecycle statuses, and inventory records.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Link to="/admin/products/new" className="btn-primary">
            <span>+ Add New Product</span>
          </Link>
          <Link to="/admin/orders" className="btn-secondary">
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="admin-error-banner" role="alert">
          <span className="error-icon">&#9888;</span>
          <p>{error}</p>
        </div>
      )}

      {/* 4 Core Stat Cards */}
      <div className="admin-stat-cards-grid">
        {/* Stat 1: Total Revenue */}
        <div className="stat-card revenue-card">
          <div className="stat-card-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{formatPrice(stats.totalRevenue)}</span>
            <span className="stat-subtext">Excludes cancelled orders</span>
          </div>
        </div>

        {/* Stat 2: Total Orders */}
        <div className="stat-card orders-card">
          <div className="stat-card-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="stat-subtext">Across all fulfillment stages</span>
          </div>
        </div>

        {/* Stat 3: Total Products */}
        <div className="stat-card products-card">
          <div className="stat-card-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">Active Garments</span>
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-subtext">Catalogued fashion pieces</span>
          </div>
        </div>

        {/* Stat 4: Total Users */}
        <div className="stat-card users-card">
          <div className="stat-card-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">Registered Clients</span>
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-subtext">Verified accounts on file</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="dashboard-section-card">
        <div className="section-card-title-row">
          <div>
            <h2 className="dashboard-section-title">Recent Order Placements</h2>
            <p className="dashboard-section-desc">
              Latest transactions recorded across web and mobile sessions
            </p>
          </div>
          <Link to="/admin/orders" className="section-view-all-link">
            <span>View All Orders ({stats.totalOrders}) &rarr;</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="admin-empty-state">
            <p>No transactions have been completed yet.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer</th>
                  <th>Date Placed</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString(
                    'en-IN',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  );

                  return (
                    <tr key={order._id}>
                      <td className="font-mono text-sm">
                        <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                        <span className="text-muted block text-xs">#{order._id}</span>
                      </td>
                      <td>
                        <span className="font-semibold block">
                          {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                        </span>
                        <span className="text-muted text-xs block">
                          {order.user?.email || order.shippingAddress?.phone}
                        </span>
                      </td>
                      <td className="text-sm text-secondary">{dateStr}</td>
                      <td className="text-sm">
                        <span className="badge-item-count">
                          {order.items?.reduce((s, i) => s + i.qty, 0) || 0} items
                        </span>
                      </td>
                      <td className="font-semibold text-primary">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td>
                        <span className={`status-badge status-${order.status || 'pending'}`}>
                          {(order.status || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <Link
                          to="/admin/orders"
                          className="btn-table-action"
                          title="Review Order"
                        >
                          Review &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
