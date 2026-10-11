import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#1c1917] font-sans selection:bg-indigo-900 selection:text-white">
              <Navbar />
              
              <main className="flex-1 flex flex-col">
                <Routes>
                  {/* Home route */}
                  <Route path="/" element={<HomePage />} />

                  {/* Templates catalog route */}
                  <Route path="/templates" element={<TemplatesPage />} />

                  {/* Favorites route (Protected) */}
                  <Route
                    path="/favorites"
                    element={
                      <ProtectedRoute>
                        <FavoritesPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Authentication routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/templates" replace />} />
                </Routes>
              </main>

              <Footer />

              {/* Cart Drawer & Checkout Payment Modal */}
              <CartDrawer />
              <CheckoutModal />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
