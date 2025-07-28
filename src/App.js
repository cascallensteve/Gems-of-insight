import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureBenefits from './components/FeatureBenefits';
// import FeaturedServices from './components/FeaturedServices';
import NewArrivals from './components/NewArrivals';

import BlogPage from './components/BlogPage';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import UserProfile from './components/UserProfile';
import OrdersPage from './components/OrdersPage';
import ProductSection from './components/ProductSection';
import ConsultationPage from './components/ConsultationPage';
import ContactPage from './components/ContactPage';
import Shop from './components/Shop';
import Cart from './components/Cart';
import ProductView from './components/ProductView';
import QuickView from './components/QuickView';
import CoursesPage from './components/CoursesPage';
import CheckoutPage from './components/CheckoutPage';

import WhatsAppFloat from './components/WhatsAppFloat';
import NewFooter from './components/NewFooter';

// Authentication Pages
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const handleOpenAppointmentModal = () => {
    // Placeholder for appointment modal functionality
    alert('Appointment booking feature coming soon!');
  };

  const handleOpenCart = () => {
    // Navigate to cart page
    window.location.href = '/cart';
  };

  return (
    <>
      <Navbar 
        openAppointmentModal={handleOpenAppointmentModal}
        openCart={handleOpenCart}
      />
      <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <FeatureBenefits />
                {/* <FeaturedServices /> */}
                <NewArrivals />
              </>
            }
          />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* User Pages */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductSection />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/quickview/:id" element={<QuickView />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>

      <WhatsAppFloat />
      <NewFooter />
    </>
  );
}

export default App;
