import React, { useState, useEffect } from 'react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

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
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock user data - replace with real API call
      const mockUsers = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+254712345678',
          role: 'admin',
          status: 'active',
          joinDate: '2024-01-15',
          lastLogin: '2025-01-30T08:30:00Z',
          orders: 5,
          spent: 12500
        },
        {
          id: 2,
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@email.com',
          phone: '+254723456789',
          role: 'user',
          status: 'active',
          joinDate: '2024-02-20',
          lastLogin: '2025-01-29T14:20:00Z',
          orders: 12,
          spent: 28750
        },
        {
          id: 3,
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.j@email.com',
          phone: '+254734567890',
          role: 'user',
          status: 'inactive',
          joinDate: '2024-03-10',
          lastLogin: '2025-01-20T10:15:00Z',
          orders: 3,
          spent: 5600
        },
        {
          id: 4,
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@email.com',
          phone: '+254745678901',
          role: 'user',
          status: 'active',
          joinDate: '2024-04-05',
          lastLogin: '2025-01-30T16:45:00Z',
          orders: 8,
          spent: 19200
        },
        {
          id: 5,
          firstName: 'David',
          lastName: 'Brown',
          email: 'david.brown@email.com',
          phone: '+254756789012',
          role: 'moderator',
          status: 'active',
          joinDate: '2024-01-30',
          lastLogin: '2025-01-30T12:30:00Z',
          orders: 15,
          spent: 42300
        },
        {
          id: 6,
          firstName: 'Lisa',
          lastName: 'Anderson',
          email: 'lisa.anderson@email.com',
          phone: '+254767890123',
          role: 'user',
          status: 'pending',
          joinDate: '2024-05-15',
          lastLogin: null,
          orders: 0,
          spent: 0
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
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
          <p>Manage and monitor all registered users</p>
        </div>
        <button 
          className="add-user-btn"
          onClick={() => setShowUserModal(true)}
        >
          + Add New User
        </button>
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
            <p>Loading users...</p>
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
                <th>Role</th>
                <th>Status</th>
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
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="user-name">{user.firstName} {user.lastName}</div>
                        <div className="user-phone">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>{user.status}</span>
                  </td>
                  <td>{formatDate(user.joinDate)}</td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td>{user.orders}</td>
                  <td>{formatCurrency(user.spent)}</td>
                  <td>
                    <div className="user-actions">
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
    </div>
  );
};

export default Users;
