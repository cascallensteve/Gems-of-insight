import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = ({ currentUser, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    gender: currentUser?.gender || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    newsletter: currentUser?.newsletter || false
  });
  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    const updatedUser = { ...currentUser, ...formData };
    onUpdate(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      dateOfBirth: currentUser?.dateOfBirth || '',
      gender: currentUser?.gender || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      newsletter: currentUser?.newsletter || false
    });
    setIsEditing(false);
  };

  // Mock data for recent activity
  const recentOrders = [
    { id: 'ORD-2024-001', date: '2024-01-15', total: 67.99, status: 'delivered' },
    { id: 'ORD-2024-002', date: '2024-01-20', total: 45.50, status: 'shipped' }
  ];

  const upcomingAppointments = [
    { id: 'APT-001', date: '2024-01-25', time: '10:00 AM', specialist: 'Dr. Sarah Mitchell' },
    { id: 'APT-002', date: '2024-02-01', time: '2:30 PM', specialist: 'Dr. James Chen' }
  ];

  return (
    <div className="user-profile">
      <div className="profile-container">
        {/* Welcome Message */}
        <div className="welcome-message">
          <div className="welcome-content">
            <h2>Welcome to your Profile, {currentUser?.firstName || currentUser?.name || 'User'}! 🎉</h2>
            <p>Manage your account information, view orders, and update your preferences here.</p>
          </div>
        </div>
        
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser?.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div className="profile-info">
            <h1>{currentUser?.firstName || currentUser?.name || 'User'} {currentUser?.lastName || ''}</h1>
            <p>{currentUser?.email}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{recentOrders.length}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat">
                <span className="stat-number">{upcomingAppointments.length}</span>
                <span className="stat-label">Appointments</span>
              </div>
              <div className="stat">
                <span className="stat-number">{currentUser?.isAdmin ? 'Admin' : 'Member'}</span>
                <span className="stat-label">Status</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  ✅ Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  ❌ Cancel
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 Appointments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-details">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-value">{currentUser?.firstName || 'Not provided'}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-value">{currentUser?.lastName || 'Not provided'}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-value">{currentUser?.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-value">{currentUser?.phone || 'Not provided'}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-value">{currentUser?.dateOfBirth || 'Not provided'}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  ) : (
                    <div className="form-value">{currentUser?.gender || 'Not provided'}</div>
                  )}
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-value">{currentUser?.address || 'Not provided'}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="form-value">{currentUser?.city || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-summary">
              <div className="section-header">
                <h2>Recent Orders</h2>
                <button className="view-all-btn">
                  View All Orders
                </button>
              </div>
              <div className="orders-list">
                {recentOrders.map(order => (
                  <div key={order.id} className="order-summary">
                    <div className="order-info">
                      <h4>Order #{order.id}</h4>
                      <p>{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="order-total">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="appointments-summary">
              <div className="section-header">
                <h2>Upcoming Appointments</h2>
                <button className="view-all-btn">
                  View All Appointments
                </button>
              </div>
              <div className="appointments-list">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-summary">
                    <div className="appointment-info">
                      <h4>{appointment.specialist}</h4>
                      <p>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="reschedule-btn">Reschedule</button>
                      <button className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-settings">
              <h2>Account Settings</h2>
              
              <div className="settings-section">
                <h3>Notifications</h3>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={isEditing ? formData.newsletter : currentUser?.newsletter}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <span className="checkmark"></span>
                    Email newsletter subscription
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Account Actions</h3>
                <div className="danger-zone">
                  <button className="danger-btn">
                    🗑️ Delete Account
                  </button>
                  <p className="danger-text">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
