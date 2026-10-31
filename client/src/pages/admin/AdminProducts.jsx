import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatCurrency';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch up to 100 products for admin view
      const { data } = await api.get('/products?limit=100');
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      setError(err.customMessage || 'Failed to retrieve products list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        prod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' ||
        prod.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/products/${productToDelete._id}`);
      toast.success(`"${productToDelete.name}" deleted successfully.`);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error(
        err.response?.data?.message ||
        err.customMessage ||
        'Failed to delete product.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-products-view">
      {/* Header Row */}
      <div className="admin-view-header">
        <div>
          <span className="admin-section-tag">Inventory Catalog</span>
          <h1 className="admin-page-title">Products Management</h1>
          <p className="admin-page-desc">
            Manage your atelier listings, pricing, and variant stocks.
          </p>
        </div>

        <Link to="/admin/products/new" className="btn-primary">
          <span>+ Add Product</span>
        </Link>
      </div>

      {error && (
        <div className="admin-error-banner" role="alert">
          <span className="error-icon">&#9888;</span>
          <p>{error}</p>
        </div>
      )}

      {/* Filter and Search Controls */}
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
            placeholder="Search by title, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="btn-clear-search"
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="admin-filter-dropdowns">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select-filter"
          >
            <option value="All">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="admin-loading-container">
          <div className="spinner" />
          <p>Loading catalog items...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-empty-state">
          <p>No products match your search or filter criteria.</p>
          {(searchTerm || categoryFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
              }}
              className="btn-secondary btn-sm"
              style={{ marginTop: '12px' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-data-table products-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Preview</th>
                <th>Title & Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock & Variants</th>
                <th>Rating</th>
                <th style={{ textAlign: 'right', width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const totalStock = product.variants?.reduce(
                  (sum, v) => sum + (v.stock || 0),
                  0
                ) || 0;
                const variantsCount = product.variants?.length || 0;
                const firstImg = product.images?.[0] || '';

                return (
                  <tr key={product._id}>
                    <td>
                      <div className="table-thumb-wrap">
                        {firstImg ? (
                          <img
                            src={firstImg}
                            alt={product.name}
                            className="table-thumb-img"
                          />
                        ) : (
                          <div className="table-thumb-placeholder">👗</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold block text-primary">
                        {product.name}
                      </span>
                      <span className="text-muted text-xs uppercase tracking-wider block">
                        {product.brand}
                      </span>
                    </td>
                    <td>
                      <span className="category-tag-pill">{product.category}</span>
                    </td>
                    <td className="font-semibold text-primary">
                      {formatPrice(product.price)}
                    </td>
                    <td>
                      <div className="stock-info-cell">
                        <span className={`stock-number-badge ${totalStock === 0 ? 'out' : totalStock <= 10 ? 'low' : 'ok'}`}>
                          {totalStock} in stock
                        </span>
                        <span className="text-xs text-muted">
                          {variantsCount} {variantsCount === 1 ? 'variant' : 'variants'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="table-rating-display">
                        <span className="rating-star-icon">&#9733;</span>
                        <span className="rating-num">
                          {product.rating !== undefined ? product.rating.toFixed(1) : '4.5'}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions-group">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="btn-table-edit"
                          title="Edit Product"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="btn-table-delete"
                          title="Delete Product"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {productToDelete && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-card">
            <div className="modal-header">
              <div className="modal-warning-icon">&#9888;</div>
              <h3 className="modal-title">Confirm Deletion</h3>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to permanently delete{' '}
                <strong>"{productToDelete.name}"</strong>?
              </p>
              <p className="modal-subtext">
                This item will be immediately removed from the catalog. This action cannot be reversed.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                disabled={isDeleting}
                onClick={confirmDelete}
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
