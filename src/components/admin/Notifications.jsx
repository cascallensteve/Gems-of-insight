import React, { useState, useEffect } from 'react';
import { FaBell, FaUserPlus, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import apiService from '../../services/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
    // Set up polling to check for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Get notifications from localStorage
      const storedNotifications = localStorage.getItem('adminNotifications') || '[]';
      let parsedNotifications = JSON.parse(storedNotifications);
      
      // Check for new users and add notifications if they don't exist
      try {
        const usersResponse = await apiService.users.getAllUsers();
        if (usersResponse && (Array.isArray(usersResponse) || (usersResponse.users && Array.isArray(usersResponse.users)))) {
          const users = Array.isArray(usersResponse) ? usersResponse : usersResponse.users;
          
          // Get existing notification IDs to avoid duplicates
          const existingNotificationIds = parsedNotifications.map(n => n.id);
          
          // Check for new users (users registered in the last 24 hours)
          const today = new Date();
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          
          const newUsers = users.filter(user => {
            const userDate = user.created_at ? new Date(user.created_at) : new Date();
            return userDate >= yesterday;
          });
          
          // Add notifications for new users that don't already have notifications
          newUsers.forEach(user => {
            const notificationId = `user_${user.id}`;
            if (!existingNotificationIds.includes(notificationId)) {
              const newNotification = {
                id: notificationId,
                type: 'user_registration',
                title: 'New User Registration',
                message: `New user registered: ${user.first_name || 'Unknown'} ${user.last_name || ''} (${user.email})`,
                timestamp: user.created_at || new Date().toISOString(),
                read: false,
                details: {
                  'User ID': user.id,
                  'Email': user.email,
                  'Phone': user.phone || user.phone_number || 'N/A',
                  'Role': user.userType || 'client',
                  'Registration Date': new Date(user.created_at || new Date()).toLocaleString()
                }
              };
              
              parsedNotifications.unshift(newNotification);
            }
          });
          
          // Save updated notifications to localStorage
          localStorage.setItem('adminNotifications', JSON.stringify(parsedNotifications));
        }
      } catch (userError) {
        console.error('Error checking for new users:', userError);
        // Continue with existing notifications if user check fails
      }
      
      // Sort by timestamp (newest first)
      const sortedNotifications = parsedNotifications.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    
    // Update localStorage
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId 
        ? { ...notif, read: true }
        : notif
    );
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    setNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      localStorage.removeItem('adminNotifications');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <FaUserPlus className="notification-icon user" />;
      case 'info':
        return <FaInfoCircle className="notification-icon info" />;
      case 'warning':
        return <FaExclamationTriangle className="notification-icon warning" />;
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      default:
        return <FaBell className="notification-icon default" />;
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notif => !notif.read);
      case 'read':
        return notifications.filter(notif => notif.read);
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <div className="notifications-header__left">
          <h1>Notifications</h1>
          <span className="notifications-count">
            {unreadCount} unread
          </span>
        </div>
        <div className="notifications-header__right">
          <button 
            className="btn btn-secondary"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
          <button 
            className="btn btn-danger"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="notifications-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {getFilteredNotifications().length === 0 ? (
          <div className="no-notifications">
            <FaBell size={48} />
            <h3>No notifications</h3>
            <p>
              {filter === 'all' 
                ? 'You\'re all caught up! No notifications to show.'
                : `No ${filter} notifications to show.`
              }
            </p>
          </div>
        ) : (
          getFilteredNotifications().map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon-wrapper">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h4 className="notification-title">{notification.title}</h4>
                  <span className="notification-time">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
                
                {notification.details && (
                  <div className="notification-details">
                    {Object.entries(notification.details).map(([key, value]) => (
                      <div key={key} className="detail-item">
                        <span className="detail-label">{key}:</span>
                        <span className="detail-value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="action-btn mark-read"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <FaCheckCircle />
                  </button>
                )}
                <button 
                  className="action-btn delete"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
