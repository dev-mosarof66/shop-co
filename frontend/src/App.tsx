import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import WishlistPage from '@/pages/WishlistPage';
import OrdersPage from '@/pages/OrdersPage';
import ProfilePage from '@/pages/ProfilePage';
import { SellerRoute } from '@/pages/seller/SellerRoute';
import SellerDashboardPage from '@/pages/seller/SellerDashboardPage';
import SellerProductsPage from '@/pages/seller/SellerProductsPage';
import SellerProductFormPage from '@/pages/seller/SellerProductFormPage';
import SellerOrdersPage from '@/pages/seller/SellerOrdersPage';
import SellerAnalyticsPage from '@/pages/seller/SellerAnalyticsPage';
import SellerSettingsPage from '@/pages/seller/SellerSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Seller dashboard — requires role=vendor or admin */}
        <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboardPage /></SellerRoute>} />
        <Route path="/seller/products" element={<SellerRoute><SellerProductsPage /></SellerRoute>} />
        <Route path="/seller/products/new" element={<SellerRoute><SellerProductFormPage /></SellerRoute>} />
        <Route path="/seller/products/:id" element={<SellerRoute><SellerProductFormPage /></SellerRoute>} />
        <Route path="/seller/orders" element={<SellerRoute><SellerOrdersPage /></SellerRoute>} />
        <Route path="/seller/analytics" element={<SellerRoute><SellerAnalyticsPage /></SellerRoute>} />
        <Route path="/seller/settings" element={<SellerRoute><SellerSettingsPage /></SellerRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}
