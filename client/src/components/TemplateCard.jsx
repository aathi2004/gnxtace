import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Check, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { downloadFreeTemplate } from '../utils/downloadTemplate';

export const TemplateCard = ({ template, onOpenDetails }) => {
  const { isTemplateFavorited, toggleFavorite } = useAuth();
  const { addToCart, isInCart } = useCart();
  const toast = useToast();
  const [isToggling, setIsToggling] = useState(false);

  const isFav = isTemplateFavorited(template.id);
  const inCart = isInCart(template.id);

  const isFree = !template.price || template.price.toLowerCase() === 'free' || template.price === '$0';

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (isToggling) return;
    setIsToggling(true);
    try {
      await toggleFavorite(template);
    } finally {
      setIsToggling(false);
    }
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    addToCart(template);
  };

  const handleFreeDownload = (e) => {
    e.stopPropagation();
    try {
      const filename = downloadFreeTemplate(template);
      toast.success(`Downloaded "${filename}"! Check your Downloads.`);
    } catch (err) {
      toast.error('Failed to trigger download.');
    }
  };

  return (
    <article
      onClick={() => onOpenDetails && onOpenDetails(template)}
      className="group relative flex flex-col bg-white border border-stone-200/90 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-stone-300 cursor-pointer"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <img
          src={template.thumbnail_url}
          alt={template.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-md bg-stone-900/80 text-white backdrop-blur-xs">
            {template.category}
          </span>
        </div>

        {/* Favorite Icon Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isToggling}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
          aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-all border ${
            isFav
              ? 'bg-white text-rose-600 border-rose-200 shadow-xs'
              : 'bg-white/90 text-stone-600 border-stone-200/80 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Price tag */}
        <div className="absolute bottom-3 right-3">
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded shadow-xs ${
            isFree 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-white text-stone-900 border border-stone-200'
          }`}>
            {template.price || 'Free'}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
            {template.name}
          </h3>

          <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {template.description}
          </p>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {template.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200/60"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-[10px] text-stone-400 self-center">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Action Row */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* View Details Option */}
          <button
            onClick={() => onOpenDetails && onOpenDetails(template)}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-indigo-900 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          <div className="flex items-center gap-1.5">
            {/* Payment or Free Download button */}
            {isFree ? (
              <button
                onClick={handleFreeDownload}
                className="flex items-center gap-1 px-2.5 py-1.2 rounded-lg text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
                title="Download free template"
              >
                <Download className="w-3 h-3 text-emerald-700" />
                <span>Free</span>
              </button>
            ) : (
              <button
                onClick={handleCartClick}
                className={`flex items-center gap-1 px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all ${
                  inCart
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-semibold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
                title={inCart ? 'View in cart' : 'Add to purchase cart'}
              >
                {inCart ? (
                  <>
                    <Check className="w-3 h-3 text-indigo-700" />
                    <span>In Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3 text-stone-600" />
                    <span>Cart</span>
                  </>
                )}
              </button>
            )}

            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              disabled={isToggling}
              className={`flex items-center gap-1 px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all ${
                isFav
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              <Heart className={`w-3 h-3 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{isFav ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
