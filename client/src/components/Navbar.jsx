import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Heart, 
  ShoppingBag, 
  Layers, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  User,
  Compass
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, favoritesCount } = useAuth();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? 'text-stone-900 bg-stone-100 font-semibold'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fdfcf9]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Form & Function */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs group-hover:bg-stone-800 transition-colors">
              F
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-stone-900">
                Form &amp; Function
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono -mt-0.5">
                Template Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/templates" className={navLinkClass}>
              <Compass className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </NavLink>

            <NavLink to="/favorites" className={navLinkClass}>
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-rose-600 fill-rose-600' : ''}`} />
              <span>Favorites</span>
              {isAuthenticated && favoritesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Desktop Right Actions: Cart & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-900 text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <div className="h-4 w-px bg-stone-200" />

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[11px] font-medium uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-medium text-stone-800 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openCart}
              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-900 text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#fdfcf9] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
          <NavLink
            to="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Compass className="w-4 h-4" />
            <span>Catalog</span>
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Favorites</span>
            {isAuthenticated && favoritesCount > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-700">
                {favoritesCount}
              </span>
            )}
          </NavLink>

          <div className="pt-3 border-t border-stone-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-2 py-1">
                  <p className="text-xs font-semibold text-stone-900">{user?.name}</p>
                  <p className="text-[11px] text-stone-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-center bg-white border border-stone-200 rounded-lg text-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-center bg-stone-900 text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
