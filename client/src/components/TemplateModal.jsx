import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  CheckCircle2, 
  ExternalLink, 
  ShoppingBag, 
  ShieldCheck, 
  Code2, 
  Layers, 
  Check,
  Download,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { downloadFreeTemplate } from '../utils/downloadTemplate';

export const TemplateModal = ({ template, isOpen, onClose }) => {
  const { isTemplateFavorited, toggleFavorite } = useAuth();
  const { addToCart, isInCart, openCart } = useCart();
  const toast = useToast();
  const [showDemoPreview, setShowDemoPreview] = useState(false);

  if (!isOpen || !template) return null;

  const isFav = isTemplateFavorited(template.id);
  const inCart = isInCart(template.id);
  const isFree = !template.price || template.price.toLowerCase() === 'free' || template.price === '$0';

  const handleAddToCartOrOpen = () => {
    if (inCart) {
      onClose();
      openCart();
    } else {
      addToCart(template);
    }
  };

  const handleFreeDownload = () => {
    try {
      const filename = downloadFreeTemplate(template);
      toast.success(`Downloaded "${filename}"! Check your Downloads folder.`);
    } catch (err) {
      toast.error('Failed to initiate download.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#fdfcf9] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Preview */}
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-stone-100">
          <img
            src={template.thumbnail_url}
            alt={template.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-stone-700 hover:text-stone-950 hover:bg-white flex items-center justify-center transition-colors shadow-xs"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-stone-900 text-white shadow-xs">
              {template.category}
            </span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-xs ${
              isFree 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-white text-stone-900 border border-stone-200'
            }`}>
              {template.price || 'Free'}
            </span>
          </div>
        </div>

        {/* Scrollable Details Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {template.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {template.description}
            </p>
          </div>

          {/* Interactive Live Demo Preview Box */}
          {showDemoPreview && (
            <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Interactive Sandbox Preview Active
                </span>
                <button
                  onClick={() => setShowDemoPreview(false)}
                  className="text-stone-400 hover:text-stone-700 text-[11px]"
                >
                  Close sandbox
                </button>
              </div>
              <p className="text-xs text-stone-600">
                Live sandbox initialized at <code className="font-mono text-indigo-900 bg-white px-1 py-0.5 rounded border border-stone-200">{template.live_demo_url || 'https://demo.formfunction.design'}</code>. Full responsive controls and source files are provided in the repository bundle.
              </p>
            </div>
          )}

          {/* Features Included Section */}
          {template.features && template.features.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                Included Architectural Modules
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {template.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack Badges */}
          {template.tags && template.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Code2 className="w-3.5 h-3.5 text-stone-600" />
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* License & Quality Guarantee */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-3 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isFree 
                ? 'Free open-source license. Use freely for personal and client projects.' 
                : 'Commercial License: Includes 100% source code, perpetual royalty-free license, and free updates.'}
            </span>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(template)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                isFav
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{isFav ? 'In Favorites' : 'Add to Favorites'}</span>
            </button>

            {/* Sandbox toggle */}
            <button
              onClick={() => setShowDemoPreview(!showDemoPreview)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{showDemoPreview ? 'Hide Demo' : 'Live Sandbox'}</span>
            </button>
          </div>

          {/* Action Trigger: Free Download for Free Cards, Cart / Payment for Paid Cards */}
          {isFree ? (
            <button
              onClick={handleFreeDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Free Starter</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCartOrOpen}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-950 shadow-sm transition-all"
            >
              {inCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>View in Cart ({template.price})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart ({template.price})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
