import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query parameters
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSize = searchParams.get('size') || '';
  const currentColor = searchParams.get('color') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state for debounced search bar
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Products API state
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize local search input with URL search param if URL changes externally
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Debounced search handler: updates URL search query after 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateFilters({ search: searchInput });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Helper to update search params in the URL (resets page to 1 unless page itself is changed)
  const updateFilters = useCallback(
    (newParams) => {
      setSearchParams(
        (prev) => {
          const updated = new URLSearchParams(prev);

          Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              updated.set(key, value);
            } else {
              updated.delete(key);
            }
          });

          // Reset page to 1 whenever a filter or search changes (unless changing page directly)
          if (!('page' in newParams)) {
            updated.set('page', '1');
          }

          return updated;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: 12,
      };

      if (currentSearch) params.search = currentSearch;
      if (currentCategory && currentCategory.toLowerCase() !== 'all') {
        params.category = currentCategory;
      }
      if (currentSize) params.size = currentSize;
      if (currentColor) params.color = currentColor;
      if (currentMinPrice) params.minPrice = currentMinPrice;
      if (currentMaxPrice) params.maxPrice = currentMaxPrice;
      if (currentSort) params.sort = currentSort;

      const { data } = await api.get('/products', { params });

      if (data.products) {
        setProducts(data.products);
        setTotalCount(data.total || 0);
        setTotalPages(data.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.customMessage || 'Failed to retrieve products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    currentSearch,
    currentCategory,
    currentSize,
    currentColor,
    currentMinPrice,
    currentMaxPrice,
    currentSort,
  ]);

  // Re-fetch on any query param change
  useEffect(() => {
    fetchProducts();
    // Scroll to top of catalog smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const activeFiltersCount = [
    currentCategory && currentCategory.toLowerCase() !== 'all',
    currentSize,
    currentColor,
    currentMinPrice || currentMaxPrice,
    currentSearch,
  ].filter(Boolean).length;

  return (
    <div className="shop-view-container">
      {/* Top Banner / Breadcrumb */}
      <div className="shop-top-banner">
        <div className="shop-banner-inner">
          <span className="shop-banner-tag">Atelier Catalog</span>
          <h1 className="shop-banner-title">
            {currentCategory && currentCategory !== 'All'
              ? `${currentCategory} Collection`
              : 'Complete Collection'}
          </h1>
          <p className="shop-banner-desc">
            Explore curated essentials designed with timeless precision,
            natural materials, and refined contemporary cuts.
          </p>
        </div>
      </div>

      <div className="shop-main-layout">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          filters={{
            category: currentCategory,
            size: currentSize,
            color: currentColor,
            minPrice: currentMinPrice,
            maxPrice: currentMaxPrice,
            search: currentSearch,
          }}
          onFilterChange={updateFilters}
          onClearFilters={handleClearFilters}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Right Content Area */}
        <section className="shop-products-section">
          {/* Controls Bar: Search, Mobile Filter Toggle, Sort Dropdown */}
          <div className="shop-controls-bar">
            {/* Search Bar Input */}
            <div className="shop-search-wrap">
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
                placeholder="Search apparel, linen, jackets..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="shop-search-input"
              />
              {searchInput && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setSearchInput('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="shop-controls-right">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                className="btn-mobile-filters"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                </svg>
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="filter-count-badge">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Select */}
              <div className="sort-dropdown-wrap">
                <label htmlFor="shop-sort" className="sort-label">
                  Sort by:
                </label>
                <select
                  id="shop-sort"
                  value={currentSort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  className="sort-select"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {activeFiltersCount > 0 && (
            <div className="active-filters-chips-bar">
              <span className="chips-label">Active:</span>
              {currentCategory && currentCategory !== 'All' && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => updateFilters({ category: '' })}
                >
                  <span>Category: {currentCategory}</span>
                  <span className="chip-remove">&times;</span>
                </button>
              )}
              {currentSize && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => updateFilters({ size: '' })}
                >
                  <span>Size: {currentSize}</span>
                  <span className="chip-remove">&times;</span>
                </button>
              )}
              {currentColor && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => updateFilters({ color: '' })}
                >
                  <span>Color: {currentColor}</span>
                  <span className="chip-remove">&times;</span>
                </button>
              )}
              {(currentMinPrice || currentMaxPrice) && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    updateFilters({ minPrice: '', maxPrice: '' })
                  }
                >
                  <span>
                    Price: ₹{currentMinPrice || '0'} - ₹
                    {currentMaxPrice || 'Max'}
                  </span>
                  <span className="chip-remove">&times;</span>
                </button>
              )}
              {currentSearch && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => {
                    setSearchInput('');
                    updateFilters({ search: '' });
                  }}
                >
                  <span>Search: "{currentSearch}"</span>
                  <span className="chip-remove">&times;</span>
                </button>
              )}
              <button
                type="button"
                className="btn-clear-all-chips"
                onClick={handleClearFilters}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Status Counter */}
          <div className="products-count-bar">
            {!loading && (
              <p className="results-count-text">
                Showing <strong>{products.length}</strong> of{' '}
                <strong>{totalCount}</strong> pieces
              </p>
            )}
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, index) => (
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

          {/* Error State */}
          {!loading && error && (
            <div className="shop-error-state">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3>Unable to Load Collection</h3>
              <p>{error}</p>
              <button
                type="button"
                onClick={fetchProducts}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="shop-empty-state">
              <div className="empty-state-icon">&#9671;</div>
              <h3 className="empty-state-title">No Matching Pieces Found</h3>
              <p className="empty-state-desc">
                We couldn't find any items matching your selected criteria. Try
                broadening your search or removing some filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-bar">
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={currentPage <= 1}
                    onClick={() =>
                      updateFilters({ page: String(currentPage - 1) })
                    }
                  >
                    &larr; Previous
                  </button>

                  <div className="pagination-pages-list">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          type="button"
                          className={`pagination-num-btn ${
                            currentPage === num ? 'active' : ''
                          }`}
                          onClick={() =>
                            updateFilters({ page: String(num) })
                          }
                        >
                          {num}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      updateFilters({ page: String(currentPage + 1) })
                    }
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Shop;
