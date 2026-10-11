import api from './axios';

const fallbackTemplates = [
  {
    id: 1,
    name: "Vespera — Editorial SaaS Launchpad",
    description: "Refined, high-conversion landing page crafted for technical products, developer tools, and boutique software studios. Features interactive feature tabs, client logos, and pricing tiers.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    category: "Landing Page",
    price: "$29",
    live_demo_url: "https://vespera.preview.store",
    tags: ["React", "Tailwind CSS", "Vite", "Framer Motion"],
    features: [
      "Bespoke typography scale with warm editorial palette",
      "Interactive feature switcher and live product demos",
      "Tiered pricing tables with monthly/annual billing switch",
      "Optimized SEO metadata and dynamic social share cards"
    ]
  },
  {
    id: 2,
    name: "Arbor — Minimalist Engineering Lead Portfolio",
    description: "Clean, text-first portfolio template designed for senior software engineers, founders, and technical architects. Includes case studies, reading list, and writing archive.",
    thumbnail_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    category: "Portfolio",
    price: "Free",
    live_demo_url: "https://arbor.preview.store",
    tags: ["React", "MDX", "Tailwind CSS", "Lucide"],
    features: [
      "Comprehensive case study layout with metrics callouts",
      "Built-in markdown engine for technical essays",
      "Interactive career timeline and architectural diagrams",
      "Lightweight, 100/100 Lighthouse performance score"
    ]
  },
  {
    id: 3,
    name: "MetricFlow — Executive Telemetry Dashboard",
    description: "Production-ready administrative interface featuring real-time revenue telemetry, retention cohorts, data tables with server filtering, and customizable metric widgets.",
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    category: "Dashboard",
    price: "$49",
    live_demo_url: "https://metricflow.preview.store",
    tags: ["React", "Chart.js", "Express", "SQLite"],
    features: [
      "Dynamic KPI summary grid with trend indicators",
      "Paginated data table with search, sorting, and export",
      "Interactive cohort retention heatmap matrix",
      "Role-based access permissions and team management view"
    ]
  },
  {
    id: 4,
    name: "Atelier Nordic — Curated Goods Storefront",
    description: "Scandinavian-inspired e-commerce storefront for independent makers, physical goods, and design objects. Includes variant selectors, slide-over cart, and streamlined checkout.",
    thumbnail_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    category: "E-commerce",
    price: "$39",
    live_demo_url: "https://atelier.preview.store",
    tags: ["React", "Tailwind CSS", "Stripe API", "Zustand"],
    features: [
      "Slide-over mini-cart with optimistic quantity adjustment",
      "High-res product gallery with lightbox zoom",
      "Multi-currency selector and promo code calculation",
      "Mobile-first checkout flow with order summary"
    ]
  },
  {
    id: 5,
    name: "Monograph — Engineering Essays & Publication",
    description: "Long-form reading publication template for engineering blogs, technical newsletters, and company documentation. Built for readability, code snippets, and thoughtful layout.",
    thumbnail_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    category: "Blog",
    price: "Free",
    live_demo_url: "https://monograph.preview.store",
    tags: ["React", "Markdown", "Syntax Highlighting", "RSS"],
    features: [
      "Carefully calibrated typography system for sustained reading",
      "Syntax-highlighted code blocks with one-click copy",
      "Automatic table of contents with scrollspy active states",
      "Newsletter subscription module with verification status"
    ]
  },
  {
    id: 6,
    name: "Ledgerly — B2B Financial Operations Platform",
    description: "Comprehensive financial management system featuring invoice drafting, recurring subscription schedules, tax summaries, and automated payment webhook logs.",
    thumbnail_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    category: "Dashboard",
    price: "$59",
    live_demo_url: "https://ledgerly.preview.store",
    tags: ["React", "Node.js", "Express", "Knex"],
    features: [
      "Invoice generator with instant PDF download preview",
      "Recurring revenue forecast and churn analysis models",
      "Stripe and bank reconciliation audit logs",
      "Multi-entity workspace switcher"
    ]
  },
  {
    id: 7,
    name: "Kinetic — Creative Studio Showcase",
    description: "Dynamic, motion-driven agency portfolio showcasing client case studies, design systems, and creative technology experiments. Ideal for design practices and dev boutiques.",
    thumbnail_url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
    category: "Landing Page",
    price: "$34",
    live_demo_url: "https://kinetic.preview.store",
    tags: ["React", "Tailwind CSS", "Vite", "SVG"],
    features: [
      "Smooth editorial case study carousel",
      "Client testimonial marquee and awards credentials",
      "Interactive project inquiry modal with budget selector",
      "Custom cursor and tasteful hover transitions"
    ]
  },
  {
    id: 8,
    name: "Provisions — Specialty Goods & Pantry Shop",
    description: "E-commerce catalog template built for specialty culinary goods, micro-breweries, and organic provisions with subscription bundles and recurring delivery selector.",
    thumbnail_url: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=80",
    category: "E-commerce",
    price: "$45",
    live_demo_url: "https://provisions.preview.store",
    tags: ["React", "Tailwind CSS", "Cart", "Checkout"],
    features: [
      "Weekly and monthly replenishment subscription picker",
      "Dietary filtering (Organic, Gluten-free, Artisan)",
      "Instant checkout drawer with address validation",
      "Customer reviews and rating breakdown module"
    ]
  }
];

const getStoredFavorites = () => {
  try {
    const raw = localStorage.getItem('ff_demo_favorites');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredFavorites = (favs) => {
  try {
    localStorage.setItem('ff_demo_favorites', JSON.stringify(favs));
  } catch (e) {}
};

export const templateService = {
  // Get all templates with optional query filters (search, category, sort)
  getTemplates: async (params = {}) => {
    try {
      const response = await api.get('/templates', { params });
      return response.data;
    } catch (err) {
      // Fallback for static hosting
      let result = [...fallbackTemplates];
      if (params.category && params.category !== 'All') {
        result = result.filter(t => t.category === params.category);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        result = result.filter(t => t.name.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
      }
      const categories = ['All', 'Landing Page', 'Dashboard', 'E-commerce', 'Portfolio', 'Blog'];
      return { success: true, count: result.length, categories, templates: result };
    }
  },

  // Get template details by ID
  getTemplateById: async (id) => {
    try {
      const response = await api.get(`/templates/${id}`);
      return response.data;
    } catch (err) {
      const found = fallbackTemplates.find(t => t.id === parseInt(id, 10));
      if (found) return { success: true, template: found };
      throw err;
    }
  },

  // Get all favorite templates for authenticated user
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (err) {
      const favIds = getStoredFavorites();
      const favTemplates = fallbackTemplates.filter(t => favIds.includes(t.id));
      return { success: true, count: favTemplates.length, favorites: favTemplates };
    }
  },

  // Add template to favorites
  addFavorite: async (templateId) => {
    try {
      const response = await api.post(`/favorites/${templateId}`);
      return response.data;
    } catch (err) {
      const id = parseInt(templateId, 10);
      const favs = getStoredFavorites();
      if (!favs.includes(id)) {
        favs.push(id);
        saveStoredFavorites(favs);
      }
      return { success: true, is_favorite: true };
    }
  },

  // Remove template from favorites
  removeFavorite: async (templateId) => {
    try {
      const response = await api.delete(`/favorites/${templateId}`);
      return response.data;
    } catch (err) {
      const id = parseInt(templateId, 10);
      const favs = getStoredFavorites().filter(item => item !== id);
      saveStoredFavorites(favs);
      return { success: true, is_favorite: false };
    }
  },
};
