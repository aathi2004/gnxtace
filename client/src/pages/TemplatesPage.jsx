import React, { useState, useEffect, useMemo } from 'react';
import { templateService } from '../api/templateService';
import { TemplateCard } from '../components/TemplateCard';
import { TemplateModal } from '../components/TemplateModal';
import { 
  Search, 
  X, 
  RefreshCw, 
  AlertCircle,
  SlidersHorizontal,
  Compass,
  ArrowUpDown
} from 'lucide-react';

export const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalTemplate, setActiveModalTemplate] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await templateService.getTemplates();
      if (data.success && Array.isArray(data.templates)) {
        setTemplates(data.templates);
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } else {
        setError('Failed to retrieve templates from the server.');
      }
    } catch (err) {
      console.error('Error loading templates:', err);
      setError(err.response?.data?.message || 'Could not connect to backend service. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-low') {
      const parse = (p) => parseFloat(p?.replace(/[^0-9.]/g, '') || 0);
      result.sort((a, b) => parse(a.price) - parse(b.price));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.id - b.id);
    } else {
      // featured / newest
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [templates, selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Editorial Header */}
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-mono uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5 text-stone-500" />
          <span>Curated Full-Stack Boilerplates</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Template Catalog
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          Production-minded starter kits for founders, engineers, and digital agencies. Designed with rigorous typography, clean codebases, and straightforward licensing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-200">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, framework, or purpose..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-stone-200 focus:border-stone-400 text-xs text-stone-900 placeholder-stone-400 outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-stone-600 self-end md:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-800 outline-none focus:border-stone-400 cursor-pointer"
          >
            <option value="featured">Featured / Newest</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="name-asc">Title (A to Z)</option>
            <option value="name-desc">Title (Z to A)</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-stone-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-stone-200/50 border border-stone-200" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-8 text-center rounded-2xl bg-rose-50 border border-rose-200 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-stone-900">Unable to load templates</h3>
          <p className="mt-1 text-xs text-rose-700">{error}</p>
          <button
            onClick={fetchTemplates}
            className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty Search / Filter state */}
      {!loading && !error && filteredTemplates.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white border border-stone-200 max-w-md mx-auto">
          <Compass className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-900">No matching templates found</h3>
          <p className="mt-1 text-xs text-stone-500 leading-relaxed">
            We couldn't find any templates matching "{searchQuery}" in category "{selectedCategory}".
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 px-4 py-2 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-2xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Template Card Grid */}
      {!loading && !error && filteredTemplates.length > 0 && (
        <>
          <div className="mb-4 text-xs text-stone-500 flex items-center justify-between">
            <span>
              Showing <strong className="text-stone-800 font-semibold">{filteredTemplates.length}</strong>{' '}
              {filteredTemplates.length === 1 ? 'template' : 'templates'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onOpenDetails={(item) => setActiveModalTemplate(item)}
              />
            ))}
          </div>
        </>
      )}

      {/* Detailed Inspection Modal */}
      <TemplateModal
        template={activeModalTemplate}
        isOpen={!!activeModalTemplate}
        onClose={() => setActiveModalTemplate(null)}
      />
    </div>
  );
};
