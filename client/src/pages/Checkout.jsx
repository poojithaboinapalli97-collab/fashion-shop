import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';
import api from '../api/axios';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // If bag is empty, guide user back
  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty-container">
        <div className="empty-cart-card">
          <span className="empty-cart-tag">Atelier Checkout</span>
          <h2 className="empty-cart-title">Your shopping bag is empty</h2>
          <p className="empty-cart-text">
            Add items to your bag before proceeding to checkout.
          </p>
          <Link to="/shop" className="btn-primary btn-empty-cart">
            Browse Atelier Collection
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'Please enter your complete full name';
    }

    if (!formData.address.trim()) {
      errors.address = 'Street address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal / PIN code is required';
    } else if (!/^[0-9]{5,6}$/.test(formData.postalCode.trim())) {
      errors.postalCode = 'Please enter a valid 5-6 digit PIN code';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required for dispatch notifications';
    } else if (!/^[0-9+ -]{10,14}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      toast.error('Please complete all required shipping fields accurately.');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare payload matching backend expectations
      const payload = {
        items: cartItems.map((item) => ({
          product: item.productId,
          size: item.size,
          color: item.color,
          qty: item.qty,
        })),
        shippingAddress: {
          fullName: formData.fullName.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          phone: formData.phone.trim(),
        },
        paymentMethod,
      };

      const { data } = await api.post('/orders', payload);

      if (data.success && data.order) {
        toast.success('Your order has been placed successfully!', {
          icon: '✨',
          duration: 4000,
        });

        // Clear local cart
        clearCart();

        // Navigate to confirmation page
        navigate(`/order-confirmation/${data.order._id}`, {
          state: { order: data.order },
          replace: true,
        });
      }
    } catch (err) {
      console.error('Error placing order:', err);
      const apiMessage =
        err.response?.data?.message ||
        err.customMessage ||
        'Failed to place order. Please verify variant availability and try again.';
      setErrorMessage(apiMessage);
      toast.error(apiMessage, { duration: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <span className="checkout-tag">Secure Checkout</span>
        <h1 className="checkout-title">Finalize Your Order</h1>
        <p className="checkout-subtitle">
          Signed in as <strong>{user?.name}</strong> ({user?.email})
        </p>
      </div>

      {errorMessage && (
        <div className="checkout-error-banner" role="alert">
          <span className="error-icon">&#9888;</span>
          <div className="error-content">
            <strong>Order Verification Failed:</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="checkout-layout" noValidate>
        {/* Left Column: Shipping & Payment Details */}
        <div className="checkout-main-col">
          {/* 1. Shipping Address Section */}
          <div className="checkout-section-card">
            <div className="section-card-header">
              <span className="step-number">1</span>
              <div>
                <h2 className="section-card-title">Shipping & Delivery Details</h2>
                <p className="section-card-desc">
                  Where should our courier deliver your handcrafted pieces?
                </p>
              </div>
            </div>

            <div className="checkout-form-grid">
              {/* Full Name */}
              <div className="form-group full-width">
                <label htmlFor="fullName" className="form-label">
                  Recipient Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Pooji R"
                  className={`form-input ${formErrors.fullName ? 'input-error' : ''}`}
                  disabled={submitting}
                />
                {formErrors.fullName && (
                  <span className="field-error-text">{formErrors.fullName}</span>
                )}
              </div>

              {/* Street Address */}
              <div className="form-group full-width">
                <label htmlFor="address" className="form-label">
                  Street Address & Flat / Suite <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 104, Lotus Avenue, MG Road"
                  className={`form-input ${formErrors.address ? 'input-error' : ''}`}
                  disabled={submitting}
                />
                {formErrors.address && (
                  <span className="field-error-text">{formErrors.address}</span>
                )}
              </div>

              {/* City */}
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City / Town <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru"
                  className={`form-input ${formErrors.city ? 'input-error' : ''}`}
                  disabled={submitting}
                />
                {formErrors.city && (
                  <span className="field-error-text">{formErrors.city}</span>
                )}
              </div>

              {/* Postal Code */}
              <div className="form-group">
                <label htmlFor="postalCode" className="form-label">
                  Postal / PIN Code <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 560001"
                  className={`form-input ${formErrors.postalCode ? 'input-error' : ''}`}
                  disabled={submitting}
                />
                {formErrors.postalCode && (
                  <span className="field-error-text">{formErrors.postalCode}</span>
                )}
              </div>

              {/* Phone Number */}
              <div className="form-group full-width">
                <label htmlFor="phone" className="form-label">
                  Mobile Number (for Delivery OTP & Dispatch Updates) <span className="req">*</span>
                </label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    className={`form-input phone-input ${
                      formErrors.phone ? 'input-error' : ''
                    }`}
                    disabled={submitting}
                  />
                </div>
                {formErrors.phone && (
                  <span className="field-error-text">{formErrors.phone}</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Payment Method Section */}
          <div className="checkout-section-card">
            <div className="section-card-header">
              <span className="step-number">2</span>
              <div>
                <h2 className="section-card-title">Payment Method</h2>
                <p className="section-card-desc">
                  Select your preferred settlement method
                </p>
              </div>
            </div>

            <div className="payment-options-list">
              <label className="payment-option-card selected">
                <div className="payment-radio-wrap">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="payment-radio"
                  />
                </div>
                <div className="payment-option-content">
                  <div className="payment-title-row">
                    <span className="payment-name">Cash on Delivery (COD)</span>
                    <span className="payment-badge">Standard Option</span>
                  </div>
                  <p className="payment-description">
                    Inspect your items and pay upon delivery. Cash, UPI, or card
                    accepted at your doorstep by our logistics partner.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="checkout-sidebar-col">
          <div className="checkout-summary-card">
            <h2 className="sidebar-summary-title">Order Overview</h2>

            {/* Items mini list */}
            <div className="checkout-mini-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="mini-item-row">
                  <div className="mini-item-thumb-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="mini-item-thumb"
                    />
                    <span className="mini-item-qty-badge">{item.qty}</span>
                  </div>
                  <div className="mini-item-info">
                    <span className="mini-item-name">{item.name}</span>
                    <span className="mini-item-meta">
                      {item.size} / {item.color}
                    </span>
                  </div>
                  <span className="mini-item-price">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="sidebar-divider" />

            {/* Calculations */}
            <div className="sidebar-calc-row">
              <span className="calc-label">Subtotal</span>
              <span className="calc-value">{formatPrice(subtotal)}</span>
            </div>

            <div className="sidebar-calc-row">
              <span className="calc-label">Insured Delivery</span>
              <span className="calc-value">
                {shippingFee === 0 ? (
                  <span className="free-shipping-tag">Complimentary</span>
                ) : (
                  formatPrice(shippingFee)
                )}
              </span>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-calc-row total">
              <span className="calc-total-label">Total to Pay</span>
              <span className="calc-total-value">{formatPrice(grandTotal)}</span>
            </div>
            <span className="sidebar-tax-caption">
              Includes all applicable taxes & insurance
            </span>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary btn-place-order"
            >
              {submitting ? (
                <span className="btn-spinner-wrap">
                  <span className="btn-spinner" />
                  <span>Processing Atelier Order...</span>
                </span>
              ) : (
                `Place Order (${formatPrice(grandTotal)})`
              )}
            </button>

            <div className="checkout-back-cart">
              <Link to="/cart" className="back-link">
                &larr; Modify items in Bag
              </Link>
            </div>

            {/* Reassurance */}
            <div className="checkout-security-notes">
              <div className="security-note">
                <span className="security-icon">&#128274;</span>
                <span>Protected by end-to-end encryption</span>
              </div>
              <div className="security-note">
                <span className="security-icon">&#10003;</span>
                <span>Guaranteed authentic designer garments</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
