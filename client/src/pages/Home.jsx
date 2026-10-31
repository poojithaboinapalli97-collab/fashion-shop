import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    {
      name: 'Women',
      tag: 'New Season',
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Women',
    },
    {
      name: 'Men',
      tag: 'Tailored Essentials',
      image:
        'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Men',
    },
    {
      name: 'Kids',
      tag: 'Gentle Organics',
      image:
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Kids',
    },
    {
      name: 'Accessories',
      tag: 'Handcrafted Goods',
      image:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Accessories',
    },
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/products', {
          params: { limit: 8, sort: 'rating' },
        });
        if (data.products) {
          setFeaturedProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
        setError('Unable to load featured pieces at this moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* 1. Hero Banner with Call to Action */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">Autumn / Winter Edition</span>
          <h1 className="hero-title">Timeless Luxury, Mindfully Tailored</h1>
          <p className="hero-description">
            Discover intentional apparel forged from organic textiles, natural
            tones, and architectural lines designed to endure through seasons.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary hero-btn">
              Explore Collection
            </Link>
            <Link to="/shop?sort=newest" className="btn-secondary hero-btn">
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Category Tiles */}
      <section className="category-section">
        <div className="section-header">
          <span className="section-tag">Curated Collections</span>
          <h2 className="section-title">Shop by Category</h2>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              to={cat.link}
              key={cat.name}
              className="category-card"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="category-overlay">
                <span className="category-tag">{cat.tag}</span>
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-explore-link">
                  View Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section (API-driven) */}
      <section className="featured-products-section">
        <div className="section-header">
          <span className="section-tag">Editor's Selection</span>
          <h2 className="section-title">Featured Curations</h2>
          <p className="section-subtitle">
            Our highest-rated foundational garments, celebrated for immaculate cut
            and breathable longevity.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="products-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="product-card-skeleton">
                <div className="skeleton-image" />
                <div className="skeleton-info">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line tiny" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Fallback */}
        {!loading && error && (
          <div className="featured-error-state">
            <p>{error}</p>
            <Link to="/shop" className="btn-secondary">
              Browse All Products
            </Link>
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && !error && featuredProducts.length > 0 && (
          <>
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="featured-footer-cta">
              <Link to="/shop" className="btn-primary">
                View Full Atelier Catalog ({featuredProducts.length}+ pieces)
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 4. Brand Assurances */}
      <section className="features-section">
        <div className="feature-item">
          <div className="feature-icon">&#10022;</div>
          <h4>Conscious Fibers</h4>
          <p>100% GOTS certified organic cotton, pure silk, and fine merino.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">&#9874;</div>
          <h4>Artisan Craft</h4>
          <p>Small-batch production focusing on enduring stitchwork and cuts.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">&#9788;</div>
          <h4>Global Carbon-Neutral</h4>
          <p>Complimentary tracked delivery with 100% recyclable packaging.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
