import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, ArrowRight, ShieldCheck, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Editorial Hero */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center flex flex-col items-center">
        {/* Editorial Subtitle Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-mono tracking-wider uppercase mb-6 border border-stone-200">
          <span>Form &amp; Function</span>
          <span className="text-stone-400">•</span>
          <span>Curated SaaS Boilerplates</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 max-w-3xl leading-[1.15]">
          Carefully Art-Directed Full-Stack Web Templates.
        </h1>

        {/* Narrative Subhead */}
        <p className="mt-5 text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
          A restrained collection of production-minded templates for founders, engineers, and digital agencies. Designed with rigorous typography, clean codebases, and straightforward licensing.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/templates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors shadow-2xs"
          >
            <Compass className="w-4 h-4" />
            <span>Explore the Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/favorites"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 transition-colors shadow-2xs"
          >
            <Heart className="w-4 h-4 text-rose-600" />
            <span>View Saved Favorites</span>
          </Link>
        </div>

        {/* Quality Pillars */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 mb-4">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Standardized Stack</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Vite, React, Tailwind CSS, Express, and Knex with SQLite. Predictable architecture without bloated runtime dependencies.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 mb-4">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Secure Authentication</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              JWT session isolation, bcrypt salted password hashing, express-validator sanitization, and Helmet HTTP protection.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 mb-4">
              <Heart className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Personal Bookmarks &amp; Cart</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Bookmark favorites with user-isolated persistence. Add templates to your purchase cart and complete checkout with license keys.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
