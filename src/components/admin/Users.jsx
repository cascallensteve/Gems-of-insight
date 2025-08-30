import React, { useState, useEffect } from 'react';
import LoadingDots from '../LoadingDots';
import './Users.css';
import apiService from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
    // Set up polling to check for new users every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token required. Please log in as admin.');
      }
      
      console.log('Fetching users from API...');
      
      // Fetch real users from API
      const response = await apiService.users.getAllUsers();
      
      console.log('API Response:', response);
      
      if (response && Array.isArray(response)) {
        // Map API response to expected format
        const formattedUsers = response.map(user => ({
          id: user.id,
          firstName: user.first_name || 'Unknown',
          lastName: user.last_name || '',
          email: user.email,
          phone: user.phone || user.phone_number || 'N/A',
          role: user.userType || 'client',
          status: user.is_email_verified ? 'active' : 'pending',
          joinDate: user.created_at || user.createdAt || new Date().toISOString(),
          lastLogin: user.last_login || user.lastLogin || null,
          orders: user.orders_count || 0,
          spent: user.total_spent || 0,
          isEmailVerified: user.is_email_verified || false,
          // Store original API data for reference
          _originalData: user
        }));
        
        console.log('Formatted users:', formattedUsers);
        setUsers(formattedUsers);
        
        // Store users in localStorage for dashboard fallback
        localStorage.setItem('adminUsers', JSON.stringify(response));
      } else if (response && response.users && Array.isArray(response.users)) {
        // Handle case where API returns { users: [...] }
        const formattedUsers = response.users.map(user => ({
          id: user.id,
          firstName: user.first_name || 'Unknown',
          lastName: user.last_name || '',
          email: user.email,
          phone: user.phone || user.phone_number || 'N/A',
          role: user.userType || 'client',
          status: user.is_email_verified ? 'active' : 'pending',
          joinDate: user.created_at || user.createdAt || new Date().toISOString(),
          lastLogin: user.last_login || user.lastLogin || null,
          orders: user.orders_count || 0,
          spent: user.total_spent || 0,
          isEmailVerified: user.is_email_verified || false,
          _originalData: user
        }));
        
        console.log('Formatted users from response.users:', formattedUsers);
        setUsers(formattedUsers);
        
        // Store users in localStorage for dashboard fallback
        localStorage.setItem('adminUsers', JSON.stringify(response.users));
      } else {
        console.error('Invalid API response format:', response);
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Safe error message extraction
      let errorMessage = 'Unknown error occurred while fetching users.';
      
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response && error.response.data) {
          errorMessage = error.response.data.message || error.response.data.error || 'API error occurred';
        } else if (error.response && error.response.status) {
          if (error.response.status === 403) {
            errorMessage = 'Access denied. Admin privileges required.';
          } else if (error.response.status === 401) {
            errorMessage = 'Authentication required. Please log in as admin.';
          } else if (error.response.status === 404) {
            errorMessage = 'Users endpoint not found.';
          } else {
            errorMessage = `Server error (${error.response.status}). Please try again later.`;
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = () => {
    // Get any stored user data from localStorage as well
    const storedUsers = [];
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        storedUsers.push({
          id: user.id || 'current',
          firstName: user.firstName || user.first_name || 'Current',
          lastName: user.lastName || user.last_name || 'User',
          email: user.email,
          phone: user.phone || user.phone_number || 'N/A',
          role: user.role || user.userType || 'user',
          status: user.isEmailVerified || user.is_email_verified ? 'active' : 'pending',
          joinDate: user.createdAt || user.created_at || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          orders: 0,
          spent: 0,
          isEmailVerified: user.isEmailVerified || user.is_email_verified || false,
          _originalData: user
        });
      }
    } catch (error) {
      console.log('No stored user data found');
    }

    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gemsofinsight.com',
        phone: '+254712345678',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-15',
        lastLogin: '2024-01-20',
        orders: 5,
        spent: 12500,
        isEmailVerified: true,
        _originalData: {
          created_at: '2024-01-15T10:30:00Z',
          userType: 'user',
          is_email_verified: true
        }
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@gemsofinsight.com',
        phone: '+254798765432',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-10',
        lastLogin: '2024-01-19',
        orders: 3,
        spent: 7800,
        isEmailVerified: true,
        _originalData: {
          created_at: '2024-01-10T14:20:00Z',
          userType: 'user',
          is_email_verified: true
        }
      },
      {
        id: 3,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gemsofinsight.com',
        phone: '+254700000000',
        role: 'admin',
        status: 'active',
        joinDate: '2024-01-01',
        lastLogin: new Date().toISOString(),
        orders: 0,
        spent: 0,
        isEmailVerified: true,
        _originalData: {
          created_at: '2024-01-01T00:00:00Z',
          userType: 'admin',
          is_email_verified: true
        }
      }
    ];

    // Combine stored users with mock users, avoiding duplicates
    const allUsers = [...storedUsers];
    mockUsers.forEach(mockUser => {
      if (!allUsers.find(u => u.email === mockUser.email)) {
        allUsers.push(mockUser);
      }
    });

    return allUsers;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.joinDate) - new Date(a.joinDate);
      case 'oldest':
        return new Date(a.joinDate) - new Date(b.joinDate);
      case 'name':
        return a.firstName.localeCompare(b.firstName);
      case 'orders':
        return b.orders - a.orders;
      case 'spent':
        return b.spent - a.spent;
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleUserAction = (action, userId) => {
    switch (action) {
      case 'view':
        const viewUser = users.find(u => u.id === userId);
        setSelectedUserDetails(viewUser);
        setShowUserDetails(true);
        break;
      case 'edit':
        const user = users.find(u => u.id === userId);
        setEditingUser(user);
        setUserForm({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        });
        setShowUserModal(true);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== userId));
        }
        break;
      case 'toggle-status':
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
            : u
        ));
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
          setUsers(users.filter(u => !selectedUsers.includes(u.id)));
          setSelectedUsers([]);
        }
        break;
      case 'activate':
        setUsers(users.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
        ));
        setSelectedUsers([]);
        break;
      case 'deactivate':
        setUsers(users.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u
        ));
        setSelectedUsers([]);
        break;
      default:
        break;
    }
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...userForm }
          : u
      ));
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...userForm,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: null,
        orders: 0,
        spent: 0
      };
      setUsers([newUser, ...users]);
    }

    resetForm();
  };

  const resetForm = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active'
    });
    setEditingUser(null);
    setShowUserModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      pending: users.filter(u => u.status === 'pending').length,
      admins: users.filter(u => u.role === 'admin').length
    };
  };

  const stats = getUserStats();

  return (
    <div className="users-management">
      {/* Header */}
      <div className="users-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Manage and monitor all registered users ({users.length} total)</p>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={fetchUsers}
            disabled={loading}
          >
            🔄 Refresh Users
          </button>
          <button 
            className="add-user-btn"
            onClick={() => setShowUserModal(true)}
          >
            + Add New User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="users-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p className="stat-number active">{stats.active}</p>
        </div>
        <div className="stat-card">
          <h3>Inactive Users</h3>
          <p className="stat-number inactive">{stats.inactive}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Users</h3>
          <p className="stat-number pending">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>Administrators</h3>
          <p className="stat-number admin">{stats.admins}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="users-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="orders">Most Orders</option>
            <option value="spent">Highest Spent</option>
          </select>
        </div>

        {selectedUsers.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedUsers.length} selected</span>
            <button onClick={() => handleBulkAction('activate')}>Activate</button>
            <button onClick={() => handleBulkAction('deactivate')}>Deactivate</button>
            <button onClick={() => handleBulkAction('delete')} className="danger">Delete</button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading-state">
            <LoadingDots text="Loading users..." size="medium" />
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(currentUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Email Verified</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.firstName[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <div className="user-name">{user.firstName} {user.lastName}</div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-info">
                      <div>{user.email}</div>
                      {user._originalData && (
                        <div className="user-details">
                          <small>Created: {formatDate(user._originalData.created_at)}</small>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="phone-info">
                      {user.phone}
                      {user._originalData?.phone_number && user._originalData.phone_number !== user.phone && (
                        <small>Alt: {user._originalData.phone_number}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role || user._originalData?.userType || 'user'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>{user.status}</span>
                  </td>
                  <td>
                    <span className={`verification-badge ${user.isEmailVerified ? 'verified' : 'unverified'}`}>
                      {user.isEmailVerified ? '✅ Verified' : '❌ Unverified'}
                    </span>
                  </td>
                  <td>{formatDate(user.joinDate)}</td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td>{user.orders}</td>
                  <td>{formatCurrency(user.spent)}</td>
                  <td>
                    <div className="user-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => handleUserAction('view', user.id)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleUserAction('edit', user.id)}
                        title="Edit User"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn toggle"
                        onClick={() => handleUserAction('toggle-status', user.id)}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleUserAction('delete', user.id)}
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={currentPage === page ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleUserSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  placeholder="+254712345678"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    required
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUserDetails && (
        <div className="modal-overlay" onClick={() => setShowUserDetails(false)}>
          <div className="user-modal user-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details & Credentials</h3>
              <button className="close-btn" onClick={() => setShowUserDetails(false)}>×</button>
            </div>

            <div className="user-details-content">
              <div className="user-details-grid">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-item">
                    <label>Full Name:</label>
                    <span>{selectedUserDetails.firstName} {selectedUserDetails.lastName}</span>
                  </div>
                  <div className="detail-item">
                    <label>User ID:</label>
                    <span className="mono">{selectedUserDetails.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedUserDetails.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedUserDetails.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role:</label>
                    <span className={`role-badge ${selectedUserDetails.role}`}>
                      {selectedUserDetails.role}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedUserDetails.status}`}>
                      {selectedUserDetails.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Email Verified:</label>
                    <span className={`verification-badge ${selectedUserDetails.isEmailVerified ? 'verified' : 'unverified'}`}>
                      {selectedUserDetails.isEmailVerified ? '✅ Verified' : '❌ Unverified'}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Account Activity</h4>
                  <div className="detail-item">
                    <label>Join Date:</label>
                    <span>{formatDate(selectedUserDetails.joinDate)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Login:</label>
                    <span>{formatDate(selectedUserDetails.lastLogin)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Orders:</label>
                    <span>{selectedUserDetails.orders}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Spent:</label>
                    <span>{formatCurrency(selectedUserDetails.spent)}</span>
                  </div>
                </div>

                {selectedUserDetails._originalData && (
                  <div className="detail-section">
                    <h4>Raw API Data</h4>
                    <div className="api-data-container">
                      <pre className="api-data">
                        {JSON.stringify(selectedUserDetails._originalData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="detail-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    setShowUserDetails(false);
                    handleUserAction('edit', selectedUserDetails.id);
                  }}
                >
                  Edit User
                </button>
                <button 
                  className="refresh-btn"
                  onClick={() => {
                    fetchUsers();
                    setShowUserDetails(false);
                  }}
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
