import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ff_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const toast = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('ff_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cartItems]);

  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr.toLowerCase() === 'free') return 0;
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const addToCart = (template) => {
    const isFree = !template.price || template.price.toLowerCase() === 'free' || template.price === '$0';
    if (isFree) {
      toast.info(`"${template.name}" is free! You can download it directly without checkout.`);
      return;
    }

    const exists = cartItems.some((item) => item.id === template.id);
    if (exists) {
      toast.info(`"${template.name}" is already in your cart.`);
      setIsCartOpen(true);
      return;
    }

    const newItem = {
      id: template.id,
      name: template.name,
      category: template.category,
      price: template.price || 'Free',
      numericPrice: parsePrice(template.price),
      thumbnail_url: template.thumbnail_url,
      license: 'Standard Commercial License'
    };

    setCartItems((prev) => [...prev, newItem]);
    toast.success(`Added "${template.name}" to cart.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (templateId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== templateId));
    toast.info('Item removed from cart.');
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountPercent(0);
    setPromoCode('');
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'INTERN20' || clean === 'LAUNCH20') {
      setDiscountPercent(20);
      setPromoCode(clean);
      toast.success('Promo code applied! 20% discount added.');
      return true;
    }
    toast.error('Invalid coupon code. Try INTERN20');
    return false;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.numericPrice, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const isInCart = (templateId) => cartItems.some((item) => item.id === templateId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount: cartItems.length,
        isCartOpen,
        isCheckoutOpen,
        promoCode,
        discountPercent,
        subtotal,
        discountAmount,
        total,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
        applyPromo
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
