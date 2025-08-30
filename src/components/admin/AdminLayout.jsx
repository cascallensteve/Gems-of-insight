import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
import Dashboard from './Dashboard';
import Users from './Users';
import Settings from './Settings';
import Sales from './Sales';
import Analytics from './Analytics';
import Products from './Products';
import Orders from './Orders';
import AdminBlogManager from '../AdminBlogManager';
import AdminAppointments from './AdminAppointments';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminNavbar from './AdminNavbar';
import Notifications from './Notifications';
import './AdminLayout.css';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [time, setTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'sales', name: 'Sales', icon: '📈' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'products', name: 'Products', icon: '🛒' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'blog', name: 'Blog Manager', icon: '📝' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <Sales />;
      case 'analytics':
        return <Analytics />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <Users />;
      case 'blog':
        return <AdminBlogManager user={currentUser} onNavigateBack={() => setActiveTab('dashboard')} />;
      case 'appointments':
        return <AdminAppointments />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNotificationClick = () => {
    setActiveTab('notifications');
  };

  return (
    <div className="admin-layout admin-layout--with-sidebar">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle desktop-hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <AdminNavbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <div className="admin-main admin-main--with-sidebar">
        <div className="admin-top-header">
          <div className="admin-top-header__left">
            <h1 className="admin-top-header__title">
              {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="admin-top-header__right">
            <div className="admin-top-header__time">{formattedTime}</div>
            <button 
              className="admin-top-header__bell" 
              title="Notifications"
              onClick={handleNotificationClick}
            >
              <FaBell size={24} />
            </button>
          </div>
        </div>
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
