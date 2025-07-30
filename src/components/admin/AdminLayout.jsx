import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Dashboard from './Dashboard';
import Users from './Users';
import Settings from './Settings';
import AdminBlogManager from '../AdminBlogManager';
import './AdminLayout.css';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'blog', name: 'Blog Management', icon: '📝' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'blog':
        return <AdminBlogManager user={currentUser} onNavigateBack={() => setActiveTab('dashboard')} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/';
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <h2>Admin Panel</h2>
            <p>Gems of Insight</p>
          </div>
          <button 
            className="sidebar-toggle mobile-only"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="admin-user-info">
          <div className="user-avatar">
            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
          </div>
          <div className="user-details">
            <h4>{currentUser?.firstName} {currentUser?.lastName}</h4>
            <p>Administrator</p>
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay mobile-only"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <button 
            className="sidebar-toggle desktop-hidden"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          
          <div className="header-title">
            <h1>{menuItems.find(item => item.id === activeTab)?.name}</h1>
          </div>

          <div className="header-actions">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-site-btn"
            >
              🌐 View Site
            </a>
            <div className="user-menu">
              <div className="user-avatar small">
                {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
              </div>
              <span className="desktop-only">{currentUser?.firstName}</span>
            </div>
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
