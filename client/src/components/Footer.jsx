import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-stone-200 bg-white text-stone-600 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center font-serif font-bold text-xs">
            F
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-900">Form &amp; Function</p>
            <p className="text-[11px] text-stone-500">Curated Software Templates &amp; Production Boilerplates</p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs text-stone-500">
          <Link to="/templates" className="hover:text-stone-900 transition-colors">
            Catalog
          </Link>
          <Link to="/favorites" className="hover:text-stone-900 transition-colors">
            Saved Favorites
          </Link>
          <a 
            href="#license" 
            onClick={(e) => { e.preventDefault(); alert("Form & Function templates include perpetual commercial & personal usage rights."); }}
            className="hover:text-stone-900 transition-colors"
          >
            Licensing
          </a>
        </div>

        <div className="text-[11px] text-stone-500 text-center sm:text-right">
          <p>© {new Date().getFullYear()} Form &amp; Function. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
