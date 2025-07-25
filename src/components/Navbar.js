import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage, openAppointmentModal, openCart, currentUser, onLogout }) => {
  const { getCartCount, getCartTotal } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
    setShowUserMenu(false); // Close user menu after navigation
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <>
      {/* Top Header Section */}
      <div className="top-header">
        <div className="header-container">
          {/* Contact Info */}
          <div className="contact-info">
            <span className="contact-item">📞 +254 712 345 678</span>
          </div>

          {/* Social Media Icons */}
          <div className="social-media">
            <a href="#facebook" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#instagram" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#whatsapp" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
              </svg>
            </a>
            <a href="#twitter" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo Section */}
          <div className="navbar-logo">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1753272258/Gems_of_insight_logo_ghxcbv.png" 
              alt="Gems of Insight Logo" 
              className="logo-image"
            />
            <span className="logo-text">Gems of Insight</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li className="navbar-item">
              <button 
                className={`navbar-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </button>
            </li>
            <li className="navbar-item">
              <button 
                className={`navbar-link ${currentPage === 'shop' ? 'active' : ''}`}
                onClick={() => handleNavClick('shop')}
              >
                Shop
              </button>
            </li>
            <li className="navbar-item">
              <button className="navbar-link" onClick={() => handleNavClick('about')}>About</button>
            </li>
            <li className="navbar-item">
              <button className="navbar-link" onClick={() => handleNavClick('contact')}>Contact</button>
            </li>
            <li className="navbar-item">
              <button className="navbar-link" onClick={() => handleNavClick('blog')}>Blog</button>
            </li>
            
            {/* Mobile-only items */}
            {currentUser ? (
              <>
                <li className="navbar-item mobile-only">
                  <div className="mobile-user-info" onClick={(e) => e.stopPropagation()}>
                    <div className="mobile-user-avatar">
                      <span>{currentUser.firstName?.charAt(0) || currentUser.name?.charAt(0) || 'U'}</span>
                    </div>
                    <span className="mobile-user-name">Hi, {currentUser.firstName || currentUser.name || 'User'}</span>
                  </div>
                </li>
                <li className="navbar-item mobile-only">
                  <button className="navbar-link" onClick={() => handleNavClick('profile')}>
                    👤 My Profile
                  </button>
                </li>
                <li className="navbar-item mobile-only">
                  <button className="navbar-link" onClick={() => handleNavClick('orders')}>
                    📦 My Orders
                  </button>
                </li>
                <li className="navbar-item mobile-only">
                  <button className="navbar-link logout-link" onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}>
                    🚪 Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="navbar-item mobile-only">
                <button className="navbar-link login-link" onClick={() => handleNavClick('login')}>
                  🔑 Login
                </button>
              </li>
            )}
            <li className="navbar-item mobile-only">
              <button className="navbar-link appointment-link" onClick={() => {
                openAppointmentModal();
                setIsMobileMenuOpen(false);
              }}>
                📅 Book Appointment
              </button>
            </li>
          </ul>

          {/* Right Section - Desktop Only */}
          <div className="navbar-right desktop-only">
            {currentUser ? (
              <div className="user-section" onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}>
                <div className="user-avatar">
                  <span>{currentUser.firstName?.charAt(0) || currentUser.name?.charAt(0) || 'U'}</span>
                </div>
                <span className="user-name">Hi, {currentUser.firstName || currentUser.name || 'User'}</span>
                {showUserMenu && (
                  <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleNavClick('profile')}>Profile</button>
                    <button onClick={() => handleNavClick('orders')}>My Orders</button>
                    <button onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="login-section" onClick={() => setCurrentPage('login')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="login-text">Login</span>
              </div>
            )}
            
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="appointment-icon" onClick={openAppointmentModal} title="Book appointment">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="separator-line"></div>

            <div className="cart-section" onClick={openCart}>
              <div className="cart-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </div>
              <div className="cart-info">
                <span className="cart-count-text">[ {cartCount} ]</span>
                <span className="cart-total">Basket KSH {cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Mobile Cart - Always Visible */}
          <div className="mobile-cart">
            <div className="cart-section" onClick={openCart}>
              <div className="cart-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </div>
              <span className="cart-text-mobile">KSH {cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
