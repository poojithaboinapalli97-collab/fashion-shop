/**
 * Formats a numeric price into Indian Rupee (INR / ₹) currency format.
 * Example: 2499 -> "₹2,499"
 *
 * @param {number|string} price - The price value to format
 * @returns {string} Formatted Indian Rupee string
 */
export const formatPrice = (price) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (num === undefined || num === null || isNaN(num)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export default formatPrice;
