import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resetPassword, getUserOrders } from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser, updateUser, logout } = useAuth();
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
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [passwordResetData, setPasswordResetData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Load user orders
  useEffect(() => {
    if (activeTab === 'orders') {
      loadUserOrders();
    }
  }, [activeTab]);

  const loadUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const userOrders = await getUserOrders();
      setOrders(userOrders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMembershipDuration = () => {
    const memberSince = currentUser?.createdAt || currentUser?.joinedDate;
    if (!memberSince) return 'New member';
    
    const joinDate = new Date(memberSince);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
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
    setMessage({ type: '', text: '' });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (passwordResetData.newPassword !== passwordResetData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (passwordResetData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
      return;
    }

    try {
      await resetPassword({
        email: currentUser.email,
        currentPassword: passwordResetData.currentPassword,
        newPassword: passwordResetData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setShowPasswordReset(false);
      setPasswordResetData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password. Please try again.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type "DELETE" to confirm account deletion.' });
      return;
    }

    try {
      // Call delete account API here
      setMessage({ type: 'success', text: 'Account deletion request submitted. You will be logged out.' });
      setTimeout(() => {
        logout();
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account. Please contact support.' });
    }
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
            <h2>{getGreeting()}, {currentUser?.firstName || currentUser?.first_name || 'User'}! 🌟</h2>
            <p>Welcome back to your wellness dashboard. You've been a valued member for {getMembershipDuration()}. Manage your health journey, track your orders, and personalize your experience.</p>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`${message.type}-message`}>
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            {message.text}
          </div>
        )}
        
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {(currentUser?.firstName || currentUser?.first_name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-info">
            <h1>{currentUser?.firstName || currentUser?.first_name || 'User'} {currentUser?.lastName || currentUser?.last_name || ''}</h1>
            <p>{currentUser?.email}</p>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>
              Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}
            </p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{orders.length || 0}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat">
                <span className="stat-number">{getMembershipDuration()}</span>
                <span className="stat-label">Member</span>
              </div>
              <div className="stat">
                <span className="stat-number">{currentUser?.role === 'admin' ? 'Admin' : 'Active'}</span>
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
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Personal Info
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 My Orders
          </button>
          <button 
            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Account Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-details">
              <h2>Personal Information</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentUser?.firstName || currentUser?.first_name || 'Not provided'}
                      disabled
                    />
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
                <h2>My Orders</h2>
                <button className="view-all-btn" onClick={() => window.location.href = '/orders'}>
                  View All Orders
                </button>
              </div>
              {loadingOrders ? (
                <div className="loading-skeleton" style={{ height: '200px', borderRadius: '12px' }}>
                  Loading your orders...
                </div>
              ) : orders.length > 0 ? (
                <div className="orders-grid">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-id">Order #{order.id}</div>
                      <div className="order-details">
                        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> KSH {order.total?.toLocaleString() || '0'}</p>
                        <div className="order-status">
                          <span className={`status-${order.status}`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>No orders yet. Start shopping to see your orders here!</p>
                  <button 
                    className="edit-btn" 
                    onClick={() => window.location.href = '/shop'}
                    style={{ marginTop: '15px' }}
                  >
                    🛍️ Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-section">
              <h2>Security Settings</h2>
              
              <div className="settings-section">
                <h3>🔒 Password Management</h3>
                {!showPasswordReset ? (
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Change Password</h4>
                      <p>Update your account password for better security</p>
                    </div>
                    <button 
                      className="edit-btn"
                      onClick={() => setShowPasswordReset(true)}
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="password-reset-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        value={passwordResetData.currentPassword}
                        onChange={(e) => setPasswordResetData(prev => ({
                          ...prev,
                          currentPassword: e.target.value
                        }))}
                        required
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={passwordResetData.newPassword}
                        onChange={(e) => setPasswordResetData(prev => ({
                          ...prev,
                          newPassword: e.target.value
                        }))}
                        required
                        placeholder="Enter new password (min 6 characters)"
                        minLength="6"
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordResetData.confirmPassword}
                        onChange={(e) => setPasswordResetData(prev => ({
                          ...prev,
                          confirmPassword: e.target.value
                        }))}
                        required
                        placeholder="Confirm your new password"
                      />
                    </div>
                    <div className="edit-actions">
                      <button type="submit" className="save-btn">
                        Update Password
                      </button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => {
                          setShowPasswordReset(false);
                          setPasswordResetData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="settings-section">
                <h3>🛡️ Account Security</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Last Login</h4>
                    <p>{new Date().toLocaleDateString()} - Current session</p>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Account Created</h4>
                    <p>{new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
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
                <h3>📧 Notifications</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Email Newsletter</h4>
                    <p>Receive wellness tips and product updates</p>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={isEditing ? formData.newsletter : currentUser?.newsletter}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <label htmlFor="newsletter">Subscribe to newsletter</label>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Order Updates</h4>
                    <p>Get notified about order status changes</p>
                  </div>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="orderUpdates"
                      checked={true}
                      disabled
                    />
                    <label htmlFor="orderUpdates">Always enabled</label>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>💾 Data & Privacy</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Download My Data</h4>
                    <p>Export all your account data</p>
                  </div>
                  <button className="edit-btn">
                    📥 Export Data
                  </button>
                </div>
              </div>

              <div className="settings-section" style={{ backgroundColor: '#fff5f5', border: '2px solid #fed7d7' }}>
                <h3 style={{ color: '#e53e3e' }}>⚠️ Danger Zone</h3>
                {!showDeleteAccount ? (
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button 
                      className="cancel-btn"
                      style={{ 
                        backgroundColor: '#e53e3e', 
                        color: 'white',
                        border: 'none'
                      }}
                      onClick={() => setShowDeleteAccount(true)}
                    >
                      🗑️ Delete Account
                    </button>
                  </div>
                ) : (
                  <div className="delete-account-form">
                    <h4 style={{ color: '#e53e3e', marginBottom: '15px' }}>Are you absolutely sure?</h4>
                    <p style={{ marginBottom: '15px', color: '#666' }}>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </p>
                    <div className="form-group">
                      <label>Type <strong>DELETE</strong> to confirm:</label>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Type DELETE here"
                        style={{ borderColor: '#e53e3e' }}
                      />
                    </div>
                    <div className="edit-actions">
                      <button 
                        className="cancel-btn"
                        style={{ 
                          backgroundColor: '#e53e3e', 
                          color: 'white',
                          border: 'none'
                        }}
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== 'DELETE'}
                      >
                        I understand, delete my account
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => {
                          setShowDeleteAccount(false);
                          setDeleteConfirmation('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
