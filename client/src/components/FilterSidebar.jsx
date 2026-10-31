import React from 'react';

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Accessories'];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2T', '3T', '4T', '5T', '30', '32', '34', '36', 'Free Size'];

const COLORS = [
  'Black',
  'White',
  'Navy',
  'Olive',
  'Cream',
  'Khaki',
  'Camel',
  'Charcoal',
  'Rose',
  'Chocolate',
  'Mustard',
  'Sage',
];

const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onClose,
}) => {
  const currentCategory = filters.category || 'All';
  const currentSize = filters.size || '';
  const currentColor = filters.color || '';
  const currentMinPrice = filters.minPrice || '';
  const currentMaxPrice = filters.maxPrice || '';

  const handlePricePreset = (min, max) => {
    onFilterChange({
      minPrice: min !== null ? String(min) : '',
      maxPrice: max !== null ? String(max) : '',
    });
  };

  const hasActiveFilters =
    (currentCategory && currentCategory !== 'All') ||
    currentSize ||
    currentColor ||
    currentMinPrice ||
    currentMaxPrice ||
    filters.search;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="filter-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-sidebar-header">
          <div className="filter-sidebar-title-row">
            <h3 className="filter-sidebar-heading">Filters</h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="btn-clear-filters"
              >
                Reset All
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn-close-sidebar"
            onClick={onClose}
            aria-label="Close filters"
          >
            &times;
          </button>
        </div>

        <div className="filter-sidebar-content">
          {/* Categories */}
          <div className="filter-group">
            <h4 className="filter-group-title">Collection</h4>
            <div className="filter-categories-list">
              {CATEGORIES.map((cat) => {
                const isSelected =
                  (cat === 'All' && (!filters.category || filters.category.toLowerCase() === 'all')) ||
                  filters.category?.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    type="button"
                    className={`category-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() =>
                      onFilterChange({
                        category: cat === 'All' ? '' : cat,
                      })
                    }
                  >
                    <span>{cat}</span>
                    {isSelected && <span className="pill-dot" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4 className="filter-group-title">Price Range</h4>
            <div className="price-inputs-row">
              <div className="price-input-wrap">
                <span className="currency-prefix">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={currentMinPrice}
                  onChange={(e) =>
                    onFilterChange({ minPrice: e.target.value })
                  }
                  className="price-input"
                />
              </div>
              <span className="price-separator">&ndash;</span>
              <div className="price-input-wrap">
                <span className="currency-prefix">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={currentMaxPrice}
                  onChange={(e) =>
                    onFilterChange({ maxPrice: e.target.value })
                  }
                  className="price-input"
                />
              </div>
            </div>

            {/* Quick Price Presets */}
            <div className="price-presets">
              <button
                type="button"
                className="price-preset-btn"
                onClick={() => handlePricePreset(0, 1500)}
              >
                Under ₹1,500
              </button>
              <button
                type="button"
                className="price-preset-btn"
                onClick={() => handlePricePreset(1500, 3000)}
              >
                ₹1,500 &ndash; ₹3,000
              </button>
              <button
                type="button"
                className="price-preset-btn"
                onClick={() => handlePricePreset(3000, 5000)}
              >
                ₹3,000 &ndash; ₹5,000
              </button>
              <button
                type="button"
                className="price-preset-btn"
                onClick={() => handlePricePreset(5000, '')}
              >
                ₹5,000+
              </button>
            </div>
          </div>

          {/* Sizes */}
          <div className="filter-group">
            <div className="filter-group-header">
              <h4 className="filter-group-title">Size</h4>
              {currentSize && (
                <button
                  type="button"
                  className="btn-clear-group"
                  onClick={() => onFilterChange({ size: '' })}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="size-tags-grid">
              {SIZES.map((sz) => {
                const isSelected =
                  currentSize.toLowerCase() === sz.toLowerCase();
                return (
                  <button
                    key={sz}
                    type="button"
                    className={`size-tag-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() =>
                      onFilterChange({
                        size: isSelected ? '' : sz,
                      })
                    }
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div className="filter-group">
            <div className="filter-group-header">
              <h4 className="filter-group-title">Color Palette</h4>
              {currentColor && (
                <button
                  type="button"
                  className="btn-clear-group"
                  onClick={() => onFilterChange({ color: '' })}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="color-tags-grid">
              {COLORS.map((clr) => {
                const isSelected =
                  currentColor.toLowerCase() === clr.toLowerCase();
                return (
                  <button
                    key={clr}
                    type="button"
                    className={`color-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() =>
                      onFilterChange({
                        color: isSelected ? '' : clr,
                      })
                    }
                  >
                    <span
                      className={`color-swatch-dot color-${clr.toLowerCase()}`}
                    />
                    <span>{clr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
