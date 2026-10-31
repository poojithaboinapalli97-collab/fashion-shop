import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    shippingFee,
    grandTotal,
  } = useCart();

  const navigate = useNavigate();

  const freeShippingThreshold = 1999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart-page">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <span className="empty-cart-tag">Atelier Bag</span>
          <h1 className="empty-cart-title">Your shopping bag is empty</h1>
          <p className="empty-cart-text">
            Discover our curated seasonal arrivals crafted from premium materials.
            Items you select will appear here.
          </p>
          <Link to="/shop" className="btn-primary btn-empty-cart">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <div>
          <span className="cart-header-tag">Atelier Bag</span>
          <h1 className="cart-header-title">Shopping Bag</h1>
        </div>
        <div className="cart-header-meta">
          <span className="cart-count-badge">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="btn-clear-cart"
            title="Clear all items from bag"
          >
            Clear Bag
          </button>
        </div>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="shipping-progress-banner">
        {remainingForFreeShipping > 0 ? (
          <p className="shipping-progress-text">
            Add <strong>{formatPrice(remainingForFreeShipping)}</strong> more of
            eligible luxury items to unlock <span>Complimentary Shipping</span>.
          </p>
        ) : (
          <p className="shipping-progress-text unlocked">
            &#10003; You have qualified for <span>Complimentary Insured Delivery</span>.
          </p>
        )}
        <div className="shipping-progress-track">
          <div
            className="shipping-progress-bar"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="cart-layout">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-section">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <Link to={`/product/${item.productId}`} className="cart-item-thumb-link">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-thumb"
                  />
                </Link>

                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <div>
                      <span className="cart-item-brand">{item.brand}</span>
                      <h3 className="cart-item-name">
                        <Link to={`/product/${item.productId}`}>{item.name}</Link>
                      </h3>
                    </div>
                    <span className="cart-item-price">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>

                  <div className="cart-item-variant-row">
                    <span className="variant-pill">
                      Size: <strong>{item.size}</strong>
                    </span>
                    <span className="variant-pill">
                      Color: <strong>{item.color}</strong>
                    </span>
                    <span className="unit-price-hint">
                      ({formatPrice(item.price)} each)
                    </span>
                  </div>

                  {item.stock && item.stock <= 5 && (
                    <div className="cart-item-low-stock">
                      <span>Only {item.stock} available in this variant</span>
                    </div>
                  )}

                  <div className="cart-item-footer">
                    {/* Quantity Stepper */}
                    <div className="cart-qty-stepper">
                      <button
                        type="button"
                        className="qty-btn"
                        disabled={item.qty <= 1}
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        disabled={item.stock && item.qty >= item.stock}
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        &#43;
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-back-shopping">
            <Link to="/shop" className="btn-secondary">
              &larr; Continue Exploring Collection
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-summary-section">
          <div className="cart-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-row">
              <span className="summary-label">Items Subtotal</span>
              <span className="summary-value">{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Estimated Shipping</span>
              <span className="summary-value">
                {shippingFee === 0 ? (
                  <span className="free-shipping-tag">Complimentary</span>
                ) : (
                  formatPrice(shippingFee)
                )}
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span className="summary-total-label">Grand Total</span>
              <span className="summary-total-value">
                {formatPrice(grandTotal)}
              </span>
            </div>
            <p className="summary-tax-note">Includes all applicable duties & GST</p>

            <button
              type="button"
              className="btn-primary btn-checkout-proceed"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout &rarr;
            </button>

            <div className="summary-trust-badges">
              <div className="trust-badge-item">
                <span className="trust-icon">&#128274;</span>
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
              <div className="trust-badge-item">
                <span className="trust-icon">&#128666;</span>
                <span>Insured Doorstep Delivery Across India</span>
              </div>
              <div className="trust-badge-item">
                <span className="trust-icon">&#8635;</span>
                <span>Complimentary 30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
