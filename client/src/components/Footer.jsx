import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand-section">
          <Link to="/" className="footer-logo">
            <span className="brand-title">AURA</span>
            <span className="brand-subtitle">ATELIER</span>
          </Link>
          <p className="footer-tagline">
            Timeless apparel curated for the modern wardrobe. Sustainable
            materials, effortless silhouettes, and enduring craftsmanship.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4 className="footer-heading">Collections</h4>
            <ul className="footer-list">
              <li><Link to="/shop?category=Women">Women</Link></li>
              <li><Link to="/shop?category=Men">Men</Link></li>
              <li><Link to="/shop?category=Kids">Kids</Link></li>
              <li><Link to="/shop?category=Accessories">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Client Services</h4>
            <ul className="footer-list">
              <li><a href="#shipping">Shipping & Delivery</a></li>
              <li><a href="#returns">Returns & Exchanges</a></li>
              <li><a href="#tracking">Track My Order</a></li>
              <li><a href="#sizing">Size Directory</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">The Atelier</h4>
            <ul className="footer-list">
              <li><a href="#about">About Our Story</a></li>
              <li><a href="#sustainability">Conscious Fabric</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press & Journal</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} AURA Atelier Inc. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
