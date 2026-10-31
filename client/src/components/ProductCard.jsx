import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { _id, name, brand, price, rating, images, category, variants } = product;

  // Use primary image or fallback
  const mainImage =
    images && images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';

  const hoverImage = images && images.length > 1 ? images[1] : mainImage;

  // Total stock across all variants
  const totalStock = variants ? variants.reduce((sum, v) => sum + (v.stock || 0), 0) : 0;

  return (
    <Link to={`/product/${_id}`} className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={mainImage}
          alt={name}
          className="product-card-img main-img"
          loading="lazy"
        />
        {hoverImage !== mainImage && (
          <img
            src={hoverImage}
            alt={name}
            className="product-card-img hover-img"
            loading="lazy"
          />
        )}

        {category && <span className="product-card-category">{category}</span>}

        {totalStock === 0 && (
          <div className="product-card-soldout-overlay">
            <span>Sold Out</span>
          </div>
        )}
      </div>

      <div className="product-card-info">
        <div className="product-card-header">
          <span className="product-card-brand">{brand || 'AURA'}</span>
          {rating !== undefined && (
            <span className="product-card-rating">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="#c5a059"
                stroke="#c5a059"
                strokeWidth="1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{rating.toFixed(1)}</span>
            </span>
          )}
        </div>

        <h3 className="product-card-name" title={name}>
          {name}
        </h3>

        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(price)}</span>
          {variants && variants.length > 0 && (
            <span className="product-card-variants-count">
              {variants.length} variant{variants.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
