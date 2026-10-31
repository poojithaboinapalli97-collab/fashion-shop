import React from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path === '/admin/products') return 'Products Management';
    if (path === '/admin/products/new') return 'Add New Product';
    if (path.startsWith('/admin/products/edit')) return 'Edit Product';
    if (path === '/admin/orders') return 'Customer Orders';
    return 'Admin Console';
  };

  return (
    <div className="admin-layout-container">
      {/* Admin Sidebar Navigation */}
      <aside className="admin-sidebar" aria-label="Admin Navigation">
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-brand">
            <span className="brand-title">AURA</span>
            <span className="admin-console-tag">ADMIN CONSOLE</span>
          </Link>
        </div>

        <nav className="admin-nav-menu">
          <span className="nav-group-label">Management</span>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? 'admin-nav-item active' : 'admin-nav-item'
            }
          >
            <svg
              className="admin-nav-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? 'admin-nav-item active' : 'admin-nav-item'
            }
          >
            <svg
              className="admin-nav-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? 'admin-nav-item active' : 'admin-nav-item'
            }
          >
            <svg
              className="admin-nav-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Orders</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="btn-view-store" title="Return to Customer Storefront">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>View Storefront</span>
          </Link>

          <div className="admin-user-profile">
            <span className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.name}</span>
              <span className="admin-role-badge">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Administrative Content Area */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-topbar-breadcrumb">
            <span className="topbar-crumb-root">Admin</span>
            <span className="topbar-crumb-sep">/</span>
            <span className="topbar-crumb-active">{getBreadcrumbTitle()}</span>
          </div>

          <div className="admin-topbar-actions">
            <Link to="/admin/products/new" className="btn-primary btn-sm topbar-action-btn">
              <span>+ Add Product</span>
            </Link>
          </div>
        </header>

        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
