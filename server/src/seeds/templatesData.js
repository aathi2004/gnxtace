const sampleTemplates = [
  {
    name: "Vespera — Editorial SaaS Launchpad",
    description: "Refined, high-conversion landing page crafted for technical products, developer tools, and boutique software studios. Features interactive feature tabs, client logos, and pricing tiers.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    category: "Landing Page",
    price: "$29",
    live_demo_url: "https://vespera.preview.store",
    tags: JSON.stringify(["React", "Tailwind CSS", "Vite", "Framer Motion"]),
    features: JSON.stringify([
      "Bespoke typography scale with warm editorial palette",
      "Interactive feature switcher and live product demos",
      "Tiered pricing tables with monthly/annual billing switch",
      "Optimized SEO metadata and dynamic social share cards"
    ])
  },
  {
    name: "Arbor — Minimalist Engineering Lead Portfolio",
    description: "Clean, text-first portfolio template designed for senior software engineers, founders, and technical architects. Includes case studies, reading list, and writing archive.",
    thumbnail_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    category: "Portfolio",
    price: "Free",
    live_demo_url: "https://arbor.preview.store",
    tags: JSON.stringify(["React", "MDX", "Tailwind CSS", "Lucide"]),
    features: JSON.stringify([
      "Comprehensive case study layout with metrics callouts",
      "Built-in markdown engine for technical essays",
      "Interactive career timeline and architectural diagrams",
      "Lightweight, 100/100 Lighthouse performance score"
    ])
  },
  {
    name: "MetricFlow — Executive Telemetry Dashboard",
    description: "Production-ready administrative interface featuring real-time revenue telemetry, retention cohorts, data tables with server filtering, and customizable metric widgets.",
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    category: "Dashboard",
    price: "$49",
    live_demo_url: "https://metricflow.preview.store",
    tags: JSON.stringify(["React", "Chart.js", "Express", "SQLite"]),
    features: JSON.stringify([
      "Dynamic KPI summary grid with trend indicators",
      "Paginated data table with search, sorting, and export",
      "Interactive cohort retention heatmap matrix",
      "Role-based access permissions and team management view"
    ])
  },
  {
    name: "Atelier Nordic — Curated Goods Storefront",
    description: "Scandinavian-inspired e-commerce storefront for independent makers, physical goods, and design objects. Includes variant selectors, slide-over cart, and streamlined checkout.",
    thumbnail_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    category: "E-commerce",
    price: "$39",
    live_demo_url: "https://atelier.preview.store",
    tags: JSON.stringify(["React", "Tailwind CSS", "Stripe API", "Zustand"]),
    features: JSON.stringify([
      "Slide-over mini-cart with optimistic quantity adjustment",
      "High-res product gallery with lightbox zoom",
      "Multi-currency selector and promo code calculation",
      "Mobile-first checkout flow with order summary"
    ])
  },
  {
    name: "Monograph — Engineering Essays & Publication",
    description: "Long-form reading publication template for engineering blogs, technical newsletters, and company documentation. Built for readability, code snippets, and thoughtful layout.",
    thumbnail_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    category: "Blog",
    price: "Free",
    live_demo_url: "https://monograph.preview.store",
    tags: JSON.stringify(["React", "Markdown", "Syntax Highlighting", "RSS"]),
    features: JSON.stringify([
      "Carefully calibrated typography system for sustained reading",
      "Syntax-highlighted code blocks with one-click copy",
      "Automatic table of contents with scrollspy active states",
      "Newsletter subscription module with verification status"
    ])
  },
  {
    name: "Ledgerly — B2B Financial Operations Platform",
    description: "Comprehensive financial management system featuring invoice drafting, recurring subscription schedules, tax summaries, and automated payment webhook logs.",
    thumbnail_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    category: "Dashboard",
    price: "$59",
    live_demo_url: "https://ledgerly.preview.store",
    tags: JSON.stringify(["React", "Node.js", "Express", "Knex"]),
    features: JSON.stringify([
      "Invoice generator with instant PDF download preview",
      "Recurring revenue forecast and churn analysis models",
      "Stripe and bank reconciliation audit logs",
      "Multi-entity workspace switcher"
    ])
  },
  {
    name: "Kinetic — Creative Studio Showcase",
    description: "Dynamic, motion-driven agency portfolio showcasing client case studies, design systems, and creative technology experiments. Ideal for design practices and dev boutiques.",
    thumbnail_url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
    category: "Landing Page",
    price: "$34",
    live_demo_url: "https://kinetic.preview.store",
    tags: JSON.stringify(["React", "Tailwind CSS", "Vite", "SVG"]),
    features: JSON.stringify([
      "Smooth editorial case study carousel",
      "Client testimonial marquee and awards credentials",
      "Interactive project inquiry modal with budget selector",
      "Custom cursor and tasteful hover transitions"
    ])
  },
  {
    name: "Provisions — Specialty Goods & Pantry Shop",
    description: "E-commerce catalog template built for specialty culinary goods, micro-breweries, and organic provisions with subscription bundles and recurring delivery selector.",
    thumbnail_url: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=80",
    category: "E-commerce",
    price: "$45",
    live_demo_url: "https://provisions.preview.store",
    tags: JSON.stringify(["React", "Tailwind CSS", "Cart", "Checkout"]),
    features: JSON.stringify([
      "Weekly and monthly replenishment subscription picker",
      "Dietary filtering (Organic, Gluten-free, Artisan)",
      "Instant checkout drawer with address validation",
      "Customer reviews and rating breakdown module"
    ])
  }
];

module.exports = sampleTemplates;
