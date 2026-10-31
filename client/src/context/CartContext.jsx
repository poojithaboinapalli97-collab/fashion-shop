import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'aura_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  /**
   * Add item to cart. Treats same product with different size/color as a separate line item.
   * Quantity is capped at the variant's available stock.
   */
  const addToCart = (product, size, color, qty = 1) => {
    if (!product || !size || !color) return;

    // Find variant stock
    const variant = product.variants?.find(
      (v) =>
        v.size.toLowerCase() === size.toLowerCase() &&
        v.color.toLowerCase() === color.toLowerCase()
    );
    const maxStock = variant ? variant.stock : 99;

    const lineItemId = `${product._id}-${size}-${color}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === lineItemId);

      if (existingIndex > -1) {
        // Update quantity capped at maxStock
        const updated = [...prevItems];
        const existingItem = updated[existingIndex];
        const combinedQty = Math.min(existingItem.qty + qty, maxStock);

        updated[existingIndex] = {
          ...existingItem,
          qty: combinedQty,
          stock: maxStock,
        };
        return updated;
      } else {
        // Add new line item
        const newItem = {
          id: lineItemId,
          productId: product._id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.images?.[0] || '',
          size,
          color,
          qty: Math.min(qty, maxStock),
          stock: maxStock,
        };
        return [...prevItems, newItem];
      }
    });
  };

  /**
   * Update quantity of an item, capped between 1 and available stock
   */
  const updateQuantity = (cartItemId, newQty) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === cartItemId) {
            const validQty = Math.max(1, Math.min(newQty, item.stock || 99));
            return { ...item, qty: validQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  /**
   * Remove line item from cart
   */
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
  };

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 199;
  const grandTotal = subtotal + shippingFee;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    shippingFee,
    grandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
