import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { formatPrice } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data.product) {
          setProduct(data.product);
          if (data.product.images && data.product.images.length > 0) {
            setActiveImage(data.product.images[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.customMessage || 'Product not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-loading-container">
        <div className="detail-skeleton-grid">
          <div className="detail-skeleton-gallery" />
          <div className="detail-skeleton-content">
            <div className="skeleton-line tiny" />
            <div className="skeleton-line medium title" />
            <div className="skeleton-line short price" />
            <div className="skeleton-line long" />
            <div className="skeleton-line long" />
            <div className="skeleton-box" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error-container">
        <div className="error-card">
          <span className="error-badge">&#9888;</span>
          <h2>Item Not Found</h2>
          <p>{error || "The piece you're looking for is no longer available in our collection."}</p>
          <Link to="/shop" className="btn-primary">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  // Derive unique sizes and colors
  const variants = product.variants || [];
  const uniqueSizes = [...new Set(variants.map((v) => v.size))];
  const uniqueColors = [...new Set(variants.map((v) => v.color))];

  // Helper: check if a size has stock
  const isSizeAvailable = (size) => {
    if (selectedColor) {
      const match = variants.find(
        (v) => v.size === size && v.color.toLowerCase() === selectedColor.toLowerCase()
      );
      return match ? match.stock > 0 : false;
    }
    // Any variant with this size has stock
    return variants.some((v) => v.size === size && v.stock > 0);
  };

  // Helper: check if a color has stock
  const isColorAvailable = (color) => {
    if (selectedSize) {
      const match = variants.find(
        (v) => v.size === selectedSize && v.color.toLowerCase() === color.toLowerCase()
      );
      return match ? match.stock > 0 : false;
    }
    // Any variant with this color has stock
    return variants.some((v) => v.color.toLowerCase() === color.toLowerCase() && v.stock > 0);
  };

  // Matched variant when both size & color are chosen
  const selectedVariant =
    selectedSize && selectedColor
      ? variants.find(
          (v) =>
            v.size === selectedSize &&
            v.color.toLowerCase() === selectedColor.toLowerCase()
        )
      : null;

  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false;
  const isLowStock =
    selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5;

  const canAddToCart =
    selectedSize && selectedColor && selectedVariant && selectedVariant.stock > 0;

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    addToCart(product, selectedSize, selectedColor, quantity);

    toast.success(
      `Added ${product.name} (${selectedSize} / ${selectedColor}) to your bag!`,
      {
        icon: '🛍️',
        duration: 3500,
      }
    );
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="crumb-sep">/</span>
        <Link to="/shop">Shop</Link>
        <span className="crumb-sep">/</span>
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
        <span className="crumb-sep">/</span>
        <span className="current-crumb">{product.name}</span>
      </nav>

      <div className="product-detail-layout">
        {/* Left Column: Image Gallery */}
        <div className="detail-gallery-container">
          <div className="main-display-image-wrap">
            <img
              src={activeImage || product.images?.[0]}
              alt={product.name}
              className="main-display-image"
            />
            {product.category && (
              <span className="detail-category-badge">{product.category}</span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="detail-thumbnails-row">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`thumbnail-btn ${
                    activeImage === imgUrl ? 'active' : ''
                  }`}
                  onClick={() => setActiveImage(imgUrl)}
                >
                  <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Variant Selectors */}
        <div className="detail-info-container">
          <div className="detail-header">
            <span className="detail-brand">{product.brand || 'AURA ATELIER'}</span>
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-meta-row">
              <span className="detail-price">{formatPrice(product.price)}</span>
              {product.rating !== undefined && (
                <div className="detail-rating">
                  <div className="rating-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <span className="rating-score">{product.rating.toFixed(1)}</span>
                  <span className="rating-reviews-count">(Curated)</span>
                </div>
              )}
            </div>
          </div>

          <p className="detail-description">{product.description}</p>

          <hr className="detail-divider" />

          {/* 1. Color Selector */}
          <div className="variant-section">
            <div className="variant-header-row">
              <span className="variant-label">Color</span>
              <span className="selected-value-display">
                {selectedColor || 'Choose a color'}
              </span>
            </div>
            <div className="color-options-grid">
              {uniqueColors.map((colorName) => {
                const available = isColorAvailable(colorName);
                const isSelected =
                  selectedColor?.toLowerCase() === colorName.toLowerCase();

                return (
                  <button
                    key={colorName}
                    type="button"
                    className={`detail-color-pill ${isSelected ? 'selected' : ''} ${
                      !available ? 'unavailable' : ''
                    }`}
                    onClick={() => setSelectedColor(colorName)}
                    title={!available ? `${colorName} (Out of stock)` : colorName}
                  >
                    <span className={`color-dot color-${colorName.toLowerCase()}`} />
                    <span>{colorName}</span>
                    {!available && <span className="slash-strike" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Size Selector */}
          <div className="variant-section">
            <div className="variant-header-row">
              <span className="variant-label">Size</span>
              <span className="selected-value-display">
                {selectedSize || 'Choose a size'}
              </span>
            </div>
            <div className="size-options-grid">
              {uniqueSizes.map((sizeName) => {
                const available = isSizeAvailable(sizeName);
                const isSelected = selectedSize === sizeName;

                return (
                  <button
                    key={sizeName}
                    type="button"
                    className={`detail-size-btn ${isSelected ? 'selected' : ''} ${
                      !available ? 'unavailable' : ''
                    }`}
                    onClick={() => setSelectedSize(sizeName)}
                    title={!available ? `${sizeName} (Unavailable)` : sizeName}
                  >
                    <span>{sizeName}</span>
                    {!available && <span className="slash-strike" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Availability Indicator */}
          <div className="stock-status-area">
            {selectedSize && selectedColor ? (
              isOutOfStock ? (
                <div className="stock-alert out-of-stock">
                  <span className="dot red-dot" />
                  <span>Sold out in {selectedSize} / {selectedColor}. Please select another variation.</span>
                </div>
              ) : isLowStock ? (
                <div className="stock-alert low-stock">
                  <span className="dot amber-dot" />
                  <span>
                    Only <strong>{selectedVariant.stock}</strong> left in stock &mdash; order soon!
                  </span>
                </div>
              ) : (
                <div className="stock-alert in-stock">
                  <span className="dot green-dot" />
                  <span>In Stock &mdash; Ready for prompt dispatch ({selectedVariant?.stock} units)</span>
                </div>
              )
            ) : (
              <div className="stock-prompt">
                <span>Please select both size and color to check local atelier availability.</span>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart Button */}
          <div className="detail-actions-row">
            <div className="quantity-selector">
              <button
                type="button"
                className="qty-btn"
                disabled={quantity <= 1 || !canAddToCart}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                &minus;
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                disabled={
                  !canAddToCart ||
                  (selectedVariant && quantity >= selectedVariant.stock)
                }
                onClick={() => setQuantity((q) => q + 1)}
              >
                &#43;
              </button>
            </div>

            <button
              type="button"
              className="btn-primary btn-add-to-cart"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              {!selectedSize || !selectedColor
                ? 'Select Size & Color'
                : isOutOfStock
                ? 'Out of Stock'
                : 'Add to Bag'}
            </button>
          </div>

          {/* Quality Assurances */}
          <div className="detail-assurances">
            <div className="assurance-row">
              <span className="assurance-icon">&#10003;</span>
              <span>Complimentary insured shipping on all orders over ₹1,999</span>
            </div>
            <div className="assurance-row">
              <span className="assurance-icon">&#8635;</span>
              <span>Hassle-free 30-day global returns & exchanges</span>
            </div>
            <div className="assurance-row">
              <span className="assurance-icon">&#9670;</span>
              <span>Crafted from ethically sourced natural fibers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
