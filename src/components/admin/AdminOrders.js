import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaCalendar, FaDollarSign, FaEye, FaEdit, FaFilter, FaDownload, FaBox, FaTruck, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const orderStatuses = [
    'pending', 'paid', 'processing', 'shipped', 'delivered', 
    'completed', 'cancelled', 'refunded', 'failed', 'on_hold'
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found. Please login as admin first.');
        }

        console.log('🛒 Fetching orders with correct Authorization header...');
        
        // Set token in correct Django REST Framework format
        api.defaults.headers.common['Authorization'] = `Token ${token}`;

        let data;
        try {
          console.log('🔄 Attempting to fetch all orders...');
          const response = await api.get('/store/all-orders');
          data = response.data;
          console.log('✅ Orders API request successful');
          console.log('📦 Orders received:', data);
        } catch (apiError) {
          console.log('⚠️ API service failed:', apiError);
          throw apiError;
        }

        // Process orders data
        const processedOrders = (Array.isArray(data) ? data : []).map(order => ({
          ...order,
          total_amount: calculateOrderTotal(order),
          item_count: order.items ? order.items.length : 0,
          status_color: getStatusColor(order.status)
        }));

        console.log('✅ Total processed orders:', processedOrders.length);
        setOrders(processedOrders);
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        setError(error.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculateOrderTotal = (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => {
      // You might need to fetch item prices from another endpoint
      // For now, using placeholder calculation
      return total + (item.quantity * 100); // placeholder price
    }, 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      paid: '#28a745',
      processing: '#17a2b8', 
      shipped: '#6f42c1',
      delivered: '#20c997',
      completed: '#28a745',
      cancelled: '#dc3545',
      refunded: '#6c757d',
      failed: '#dc3545',
      on_hold: '#fd7e14'
    };
    return colors[status] || '#6c757d';
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = (
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.buyer.toString().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      const response = await api.post(`/store/update-order-status/${orderId}/`, {
        status: newStatus
      });

      console.log('✅ Order status updated:', response.data);

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, status_color: getStatusColor(newStatus) }
            : order
        )
      );

      // Update selected order if it's currently shown in modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ 
          ...prev, 
          status: newStatus, 
          status_color: getStatusColor(newStatus) 
        }));
      }

      alert(`✅ Order #${orderId} status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`❌ Error updating order status: ${error.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      console.log('👁️ Viewing order details for ID:', order.id);
      setSelectedOrder(order);
      setShowModal(true);
      
      // Optionally fetch detailed order data
      // const detailedOrder = await fetchOrderDetails(order.id);
      // setSelectedOrder(detailedOrder);
    } catch (error) {
      console.error('Error viewing order details:', error);
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Buyer', 'Status', 'Items', 'Total', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.buyer,
        order.status,
        order.item_count,
        order.total_amount,
        new Date(order.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Pending' },
      paid: { class: 'badge-success', text: 'Paid' },
      processing: { class: 'badge-info', text: 'Processing' },
      shipped: { class: 'badge-purple', text: 'Shipped' },
      delivered: { class: 'badge-teal', text: 'Delivered' },
      completed: { class: 'badge-success', text: 'Completed' },
      cancelled: { class: 'badge-danger', text: 'Cancelled' },
      refunded: { class: 'badge-secondary', text: 'Refunded' },
      failed: { class: 'badge-danger', text: 'Failed' },
      on_hold: { class: 'badge-orange', text: 'On Hold' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  const getStatusActions = (order) => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          <button key="paid" className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(order.id, 'paid')} title="Mark as Paid">
            💰 Paid
          </button>
        );
        actions.push(
          <button key="cancelled" className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate(order.id, 'cancelled')} title="Cancel Order">
            <FaTimes /> Cancel
          </button>
        );
        break;
      case 'paid':
        actions.push(
          <button key="processing" className="btn btn-sm btn-info" onClick={() => handleStatusUpdate(order.id, 'processing')} title="Start Processing">
            ⚙️ Process
          </button>
        );
        break;
      case 'processing':
        actions.push(
          <button key="shipped" className="btn btn-sm btn-purple" onClick={() => handleStatusUpdate(order.id, 'shipped')} title="Mark as Shipped">
            <FaTruck /> Ship
          </button>
        );
        break;
      case 'shipped':
        actions.push(
          <button key="delivered" className="btn btn-sm btn-teal" onClick={() => handleStatusUpdate(order.id, 'delivered')} title="Mark as Delivered">
            📦 Delivered
          </button>
        );
        break;
      case 'delivered':
        actions.push(
          <button key="completed" className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(order.id, 'completed')} title="Complete Order">
            <FaCheck /> Complete
          </button>
        );
        break;
      default:
        break;
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="admin-orders loading">
        <div className="loading-spinner">
          <div className="dots-loader">...</div>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="admin-orders error">
        <div className="error-message">
          <h3>❌ Error Loading Orders</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {/* Header Section */}
      <div className="orders-header">
        <div className="orders-header__left">
          <h2>Orders Management</h2>
          <p>Manage customer orders and track shipments</p>
        </div>
        <div className="orders-header__right">
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            🔄 Refresh
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{orders.filter(o => o.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card__icon pending">
            <FaShoppingCart />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{orders.filter(o => ['paid', 'processing'].includes(o.status)).length}</h3>
            <p>Processing</p>
          </div>
          <div className="stat-card__icon processing">
            <FaBox />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{orders.filter(o => ['shipped', 'delivered'].includes(o.status)).length}</h3>
            <p>Shipped</p>
          </div>
          <div className="stat-card__icon shipped">
            <FaTruck />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
          <div className="stat-card__icon total">
            <FaDollarSign />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="orders-controls">
        <div className="orders-controls__left">
          <div className="filter-group">
            <FaFilter />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="orders-controls__right">
          <input
            type="text"
            placeholder="Search by order ID, buyer, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <div className="order-id">
                    <strong>#{order.id}</strong>
                  </div>
                </td>
                <td>
                  <div className="buyer-info">
                    <div className="buyer-avatar">
                      <FaUser />
                    </div>
                    <span>User #{order.buyer}</span>
                  </div>
                </td>
                <td>
                  <div className="items-info">
                    <span className="item-count">{order.item_count} items</span>
                  </div>
                </td>
                <td>
                  <div className="total-amount">
                    <strong>KSH {order.total_amount.toLocaleString()}</strong>
                  </div>
                </td>
                <td>
                  {getStatusBadge(order.status)}
                </td>
                <td>
                  <div className="order-date">
                    <FaCalendar /> {formatDate(order.created_at)}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleViewDetails(order)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {getStatusActions(order).map((action, index) => (
                      <React.Fragment key={index}>
                        {updatingStatus === order.id ? (
                          <button className="btn btn-sm btn-outline" disabled>
                            ⏳
                          </button>
                        ) : action}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && !loading && (
          <div className="no-orders">
            <FaShoppingCart size={48} />
            <h3>No orders found</h3>
            <p>{error ? 'Unable to load orders. Please check your connection and try again.' : 'No orders match your current filters.'}</p>
            {error && (
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
                style={{ marginTop: '15px' }}
              >
                Retry Loading
              </button>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.id}</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                <div className="detail-row">
                  <label>Order ID:</label>
                  <span>#{selectedOrder.id}</span>
                </div>
                <div className="detail-row">
                  <label>Buyer:</label>
                  <span>User #{selectedOrder.buyer}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span>{getStatusBadge(selectedOrder.status)}</span>
                </div>
                <div className="detail-row">
                  <label>Created Date:</label>
                  <span>{formatDate(selectedOrder.created_at)}</span>
                </div>
                <div className="detail-row">
                  <label>Total Amount:</label>
                  <span><strong>KSH {selectedOrder.total_amount.toLocaleString()}</strong></span>
                </div>
                
                <div className="detail-section">
                  <h4>Order Items ({selectedOrder.item_count})</h4>
                  <div className="items-list">
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <div key={index} className="item-row">
                        <span>Item #{item.item || 'Unknown'}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Status Actions</h4>
                  <div className="status-actions">
                    {orderStatuses.map(status => (
                      <button
                        key={status}
                        className={`btn btn-sm ${selectedOrder.status === status ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => {
                          if (selectedOrder.status !== status) {
                            handleStatusUpdate(selectedOrder.id, status);
                          }
                        }}
                        disabled={selectedOrder.status === status || updatingStatus === selectedOrder.id}
                      >
                        {updatingStatus === selectedOrder.id ? '⏳' : status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
