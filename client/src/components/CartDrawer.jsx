import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const { 
    cartItems, 
    itemCount, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    clearCart,
    subtotal, 
    discountAmount, 
    total, 
    openCheckout,
    applyPromo,
    promoCode 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyPromo(couponInput);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="relative w-full max-w-md h-full bg-[#fdfcf9] border-l border-stone-200 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">Your Cart</h2>
              <p className="text-xs text-stone-500">{itemCount} {itemCount === 1 ? 'template' : 'templates'} selected</p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-stone-800">Your cart is empty</h3>
              <p className="mt-1 text-xs text-stone-500 max-w-xs leading-relaxed">
                Explore our curated library and add commercial templates to your purchase cart.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Browse Templates
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3.5 p-3.5 bg-white border border-stone-200 rounded-xl shadow-xs"
                >
                  <img
                    src={item.thumbnail_url}
                    alt={item.name}
                    className="w-16 h-14 object-cover rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs font-bold text-stone-900">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Commercial License
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove from cart"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Payment Section */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-stone-200 space-y-4">
            {/* Promo code form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Promo code (e.g. INTERN20)"
                className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-lg transition-colors"
              >
                Apply
              </button>
            </form>

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({promoCode})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-semibold text-stone-900">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={openCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-950 shadow-sm transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-stone-400 hover:text-stone-600 transition-colors"
              >
                Clear all items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
