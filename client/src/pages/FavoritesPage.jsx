import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templateService } from '../api/templateService';
import { useAuth } from '../context/AuthContext';
import { TemplateCard } from '../components/TemplateCard';
import { TemplateModal } from '../components/TemplateModal';
import { 
  Heart, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  Search,
  Compass
} from 'lucide-react';

export const FavoritesPage = () => {
  const { user, favoritesCount, favoriteIds } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTemplate, setActiveModalTemplate] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await templateService.getFavorites();
      if (data.success && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      } else {
        setError('Failed to fetch favorite templates.');
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err.response?.data?.message || 'Could not load saved favorites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [favoritesCount]);

  const filteredFavorites = favorites.filter((fav) => {
    // Only display if it's currently in user's favoriteIds (handles optimistic removal)
    if (!favoriteIds.has(fav.id)) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      fav.name.toLowerCase().includes(query) ||
      fav.description.toLowerCase().includes(query) ||
      fav.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-[11px] font-mono uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Personal Bookmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
            <span>Saved Favorites</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-stone-100 text-stone-800 border border-stone-200">
              {filteredFavorites.length}
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-600">
            Templates bookmarked by <span className="font-semibold text-stone-900">{user?.name}</span>.
          </p>
        </div>

        {/* Search within favorites */}
        {favorites.length > 0 && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved templates..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-800 outline-none focus:border-stone-400"
            />
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-stone-200/50 border border-stone-200" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-8 text-center rounded-2xl bg-rose-50 border border-rose-200 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-stone-900">Could not load bookmarks</h3>
          <p className="mt-1 text-xs text-rose-700">{error}</p>
          <button
            onClick={fetchFavorites}
            className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredFavorites.length === 0 && (
        <div className="py-16 px-6 text-center rounded-2xl bg-white border border-stone-200 max-w-md mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">No favorite templates yet</h3>
          <p className="mt-1 text-xs text-stone-500 max-w-xs leading-relaxed">
            Click the heart icon on any template card in the catalog to save it to your personal collection.
          </p>
          <Link
            to="/templates"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Grid of Favorites */}
      {!loading && !error && filteredFavorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onOpenDetails={(item) => setActiveModalTemplate(item)}
            />
          ))}
        </div>
      )}

      {/* Template Details Modal */}
      <TemplateModal
        template={activeModalTemplate}
        isOpen={!!activeModalTemplate}
        onClose={() => setActiveModalTemplate(null)}
      />
    </div>
  );
};
