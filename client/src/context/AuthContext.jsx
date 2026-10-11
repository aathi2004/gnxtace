import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/authService';
import { templateService } from '../api/templateService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Load user profile and initial favorites if token exists
  const loadUserData = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setUser(null);
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    try {
      // Fetch user profile
      const userRes = await authService.getCurrentUser();
      if (userRes.success && userRes.user) {
        setUser(userRes.user);
        
        // Fetch user favorites to sync favorited state across app
        try {
          const favRes = await templateService.getFavorites();
          if (favRes.success && Array.isArray(favRes.favorites)) {
            setFavoriteIds(new Set(favRes.favorites.map((f) => f.id)));
          }
        } catch (favErr) {
          console.warn('Could not load favorites on init:', favErr);
        }
      } else {
        // Token invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setFavoriteIds(new Set());
      }
    } catch (err) {
      console.warn('Auth validation failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setFavoriteIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();

    // Listen for unauthorized events from axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setFavoriteIds(new Set());
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [loadUserData]);

  // Refresh favorites list from backend
  const refreshFavorites = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const favRes = await templateService.getFavorites();
      if (favRes.success && Array.isArray(favRes.favorites)) {
        setFavoriteIds(new Set(favRes.favorites.map((f) => f.id)));
      }
    } catch (e) {
      console.warn('Error refreshing favorites:', e);
    }
  }, []);

  // Register
  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setFavoriteIds(new Set());
        toast.success(`Welcome to SaaSVerse, ${data.user.name}! 🎉`);
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please check your inputs.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        
        // Fetch favorites after login
        try {
          const favRes = await templateService.getFavorites();
          if (favRes.success && Array.isArray(favRes.favorites)) {
            setFavoriteIds(new Set(favRes.favorites.map((f) => f.id)));
          }
        } catch (e) {
          // ignore
        }

        toast.success(`Welcome back, ${data.user.name}! 👋`);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setFavoriteIds(new Set());
    toast.info('Logged out successfully.');
  };

  // Toggle favorite helper
  const toggleFavorite = async (template) => {
    if (!user) {
      toast.info('Please log in to save templates to your favorites.');
      return { requiresAuth: true };
    }

    const templateId = template.id;
    const isCurrentlyFav = favoriteIds.has(templateId);

    // Optimistic UI update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFav) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    });

    try {
      if (isCurrentlyFav) {
        await templateService.removeFavorite(templateId);
        toast.info(`Removed "${template.name}" from favorites.`);
      } else {
        await templateService.addFavorite(templateId);
        toast.success(`Saved "${template.name}" to favorites! ❤️`);
      }
      return { success: true, isFavorited: !isCurrentlyFav };
    } catch (error) {
      // Revert optimistic update on failure
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyFav) {
          next.add(templateId);
        } else {
          next.delete(templateId);
        }
        return next;
      });
      const msg = error.response?.data?.message || 'Could not update favorites.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const isTemplateFavorited = (templateId) => favoriteIds.has(templateId);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    favoriteIds,
    favoritesCount: favoriteIds.size,
    register,
    login,
    logout,
    toggleFavorite,
    isTemplateFavorited,
    refreshFavorites
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
