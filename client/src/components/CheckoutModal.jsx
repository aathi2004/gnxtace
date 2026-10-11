import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  Download, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    cartItems, 
    total, 
    clearCart 
  } = useCart();

  const toast = useToast();

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  const fillTestCard = () => {
    setCardName('Jane Developer');
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('12/28');
    setCvc('888');
  };

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate instant payment authorization
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const generatedId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      clearCart();
      toast.success('Payment authorized successfully! License keys generated.');
    }, 1200);
  };

  const handleDone = () => {
    setIsSuccess(false);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#fdfcf9] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-900">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">
              {isSuccess ? 'Payment Confirmed' : 'Secure Template Checkout'}
            </h3>
          </div>

          <button
            onClick={closeCheckout}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Receipt State */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-stone-900">Thank You for Your Order</h4>
              <p className="text-xs text-stone-500 mt-1">
                Order reference <span className="font-mono text-stone-800 font-semibold">{orderId}</span>
              </p>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl text-left space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Total Paid</span>
                <span className="font-bold text-stone-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>License Key</span>
                <span className="font-mono text-[11px] text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  FF-KEY-2026-X89B-PRO
                </span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Code Repository</span>
                <span className="text-emerald-700 font-medium">Ready for Instant Download</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          /* Payment Form State */
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Summary strip */}
            <div className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500">Total Purchase: </span>
                <span className="font-bold text-stone-900 text-sm">${total.toFixed(2)}</span>
              </div>
              <span className="text-[11px] text-stone-500">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Quick Fill Button */}
            <button
              type="button"
              onClick={fillTestCard}
              className="w-full py-1.5 px-3 rounded-lg text-[11px] font-medium text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3 h-3 text-indigo-700" />
              <span>Fill Test Card Information</span>
            </button>

            {/* Card Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Security Code
                  </label>
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit encrypted simulated transaction</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-950 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Authorizing payment...</span>
                </>
              ) : (
                <>
                  <span>Complete Payment (${total.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
