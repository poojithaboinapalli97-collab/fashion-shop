import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    brand: 'AURA ATELIER',
    rating: 4.8,
  });

  const [images, setImages] = useState(['']);
  const [variants, setVariants] = useState([
    { size: 'M', color: 'Black', stock: 10 },
  ]);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/products/${id}`);
          if (data.product) {
            const p = data.product;
            setFormData({
              name: p.name || '',
              description: p.description || '',
              price: p.price !== undefined ? p.price : '',
              category: p.category || 'Men',
              brand: p.brand || 'AURA ATELIER',
              rating: p.rating || 4.8,
            });

            if (p.images && p.images.length > 0) {
              setImages(p.images);
            } else {
              setImages(['']);
            }

            if (p.variants && p.variants.length > 0) {
              setVariants(
                p.variants.map((v) => ({
                  size: v.size || '',
                  color: v.color || '',
                  stock: v.stock !== undefined ? v.stock : 0,
                }))
              );
            }
          }
        } catch (err) {
          console.error('Failed to load product for editing:', err);
          toast.error('Product not found or failed to load.');
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  // Handle basic form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Image URLs management
  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const addImageField = () => {
    setImages((prev) => [...prev, '']);
  };

  const removeImageField = (index) => {
    if (images.length === 1) {
      setImages(['']);
    } else {
      setImages((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  // Variants management
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: field === 'stock' ? (value === '' ? '' : Math.max(0, parseInt(value, 10) || 0)) : value,
    };
    setVariants(updated);
  };

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      { size: 'M', color: 'Black', stock: 10 },
    ]);
  };

  const removeVariantRow = (index) => {
    if (variants.length <= 1) {
      toast.error('Product must have at least one variant.');
      return;
    }
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Please enter a valid price greater than 0';
    }
    if (!formData.brand.trim()) errors.brand = 'Brand is required';

    // Validate images
    const validImages = images.map((u) => u.trim()).filter(Boolean);
    if (validImages.length === 0) {
      errors.images = 'Please provide at least one valid image URL';
    }

    // Validate variants
    if (variants.length === 0) {
      errors.variants = 'At least one variant row is required';
    } else {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (!v.size.trim() || !v.color.trim() || v.stock === '' || isNaN(v.stock)) {
          errors.variants = `Variant #${i + 1} has incomplete size, color, or stock.`;
          break;
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please resolve validation errors before saving.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand.trim(),
        rating: parseFloat(formData.rating) || 4.5,
        images: images.map((u) => u.trim()).filter(Boolean),
        variants: variants.map((v) => ({
          size: v.size.trim(),
          color: v.color.trim(),
          stock: parseInt(v.stock, 10) || 0,
        })),
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
        toast.success(`Updated "${payload.name}" successfully!`);
      } else {
        await api.post('/products', payload);
        toast.success(`Created "${payload.name}" successfully!`);
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      toast.error(
        err.response?.data?.message ||
        err.customMessage ||
        'Failed to save product.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner" />
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="admin-form-view">
      <div className="admin-view-header">
        <div>
          <span className="admin-section-tag">
            {isEditMode ? 'Catalog Editing' : 'New Listing'}
          </span>
          <h1 className="admin-page-title">
            {isEditMode ? `Edit "${formData.name}"` : 'Add New Fashion Product'}
          </h1>
          <p className="admin-page-desc">
            Define product specifications, image galleries, and sizes/colors stock levels.
          </p>
        </div>

        <Link to="/admin/products" className="btn-secondary">
          &larr; Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-product-form" noValidate>
        {/* Section 1: General Details */}
        <div className="form-card-section">
          <h2 className="form-section-title">General Specifications</h2>

          <div className="form-grid-2">
            {/* Name */}
            <div className="form-group full-width">
              <label htmlFor="name" className="form-label">
                Product Title <span className="req">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Pure Silk Evening Slip Dress"
                className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                disabled={submitting}
              />
              {formErrors.name && (
                <span className="field-error-text">{formErrors.name}</span>
              )}
            </div>

            {/* Brand */}
            <div className="form-group">
              <label htmlFor="brand" className="form-label">
                Brand / Atelier <span className="req">*</span>
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. AURA ATELIER"
                className={`form-input ${formErrors.brand ? 'input-error' : ''}`}
                disabled={submitting}
              />
              {formErrors.brand && (
                <span className="field-error-text">{formErrors.brand}</span>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="req">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                disabled={submitting}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price (INR ₹) <span className="req">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 4999"
                className={`form-input ${formErrors.price ? 'input-error' : ''}`}
                disabled={submitting}
              />
              {formErrors.price && (
                <span className="field-error-text">{formErrors.price}</span>
              )}
            </div>

            {/* Rating */}
            <div className="form-group">
              <label htmlFor="rating" className="form-label">
                Initial Rating (0.0 to 5.0)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className="form-input"
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                Description & Textile Story <span className="req">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe material compositions, artisan weaving technique, fit, and styling recommendations..."
                className={`form-input form-textarea ${
                  formErrors.description ? 'input-error' : ''
                }`}
                disabled={submitting}
              />
              {formErrors.description && (
                <span className="field-error-text">{formErrors.description}</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Images Management */}
        <div className="form-card-section">
          <div className="form-section-header">
            <div>
              <h2 className="form-section-title">Product Image URLs</h2>
              <p className="form-section-desc">
                Provide public high-resolution image URLs (e.g. Unsplash or Cloudinary)
              </p>
            </div>
            <button
              type="button"
              onClick={addImageField}
              className="btn-secondary btn-sm"
              disabled={submitting}
            >
              + Add Another Image URL
            </button>
          </div>

          {formErrors.images && (
            <span className="field-error-text" style={{ marginBottom: '12px', display: 'block' }}>
              {formErrors.images}
            </span>
          )}

          <div className="image-inputs-list">
            {images.map((url, idx) => (
              <div key={idx} className="image-input-row">
                <div className="image-preview-thumbnail">
                  {url ? (
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block';
                      }}
                    />
                  ) : (
                    <span>📸</span>
                  )}
                </div>

                <input
                  type="url"
                  placeholder={`https://images.unsplash.com/... (Image URL #${idx + 1})`}
                  value={url}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  className="form-input flex-1"
                  disabled={submitting}
                />

                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="btn-remove-row"
                  title="Remove this image"
                  disabled={submitting}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Dynamic Variants Editor */}
        <div className="form-card-section">
          <div className="form-section-header">
            <div>
              <h2 className="form-section-title">Sizes, Colors & Stock Variants</h2>
              <p className="form-section-desc">
                Define variant combinations and warehouse quantities for real-time order verification.
              </p>
            </div>
            <button
              type="button"
              onClick={addVariantRow}
              className="btn-secondary btn-sm"
              disabled={submitting}
            >
              + Add Variant Row
            </button>
          </div>

          {formErrors.variants && (
            <span className="field-error-text" style={{ marginBottom: '12px', display: 'block' }}>
              {formErrors.variants}
            </span>
          )}

          <div className="variants-editor-table-wrap">
            <table className="variants-editor-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Color Name</th>
                  <th>Warehouse Stock</th>
                  <th style={{ width: '60px', textAlign: 'center' }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        placeholder="e.g. S, M, L, XL, Free Size"
                        value={v.size}
                        onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                        className="form-input variant-input"
                        disabled={submitting}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="e.g. Black, Ivory, Navy"
                        value={v.color}
                        onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                        className="form-input variant-input"
                        disabled={submitting}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 15"
                        value={v.stock}
                        onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                        className="form-input variant-input"
                        disabled={submitting}
                        required
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => removeVariantRow(idx)}
                        className="btn-remove-row"
                        title="Delete variant"
                        disabled={submitting}
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="form-actions-bar">
          <Link to="/admin/products" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-primary btn-save-product"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-spinner-wrap">
                <span className="btn-spinner" />
                <span>Saving Product Listing...</span>
              </span>
            ) : isEditMode ? (
              'Save Changes'
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
