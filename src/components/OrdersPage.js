import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingDots from './LoadingDots';
import './OrdersPage.css';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Load real orders from localStorage (created during checkout)
        const realOrders = getLocalOrders();
        
        if (realOrders.length > 0) {
          console.log('Found real orders:', realOrders);
          setOrders(realOrders);
        } else {
          console.log('No real orders found, showing empty state');
          setOrders([]);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Function to get orders from localStorage (same as in CheckoutPage)
  const getLocalOrders = () => {
    const orders = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('order_')) {
        try {
          const order = JSON.parse(localStorage.getItem(key));
          orders.push(order);
        } catch (error) {
          console.error('Error parsing order:', error);
        }
      }
    }
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Get status color and icon
  const getStatusColor = (status) => {
    const colors = {
      pending_payment: 'var(--warning)',
      payment_completed: 'var(--success)',
      processing: 'var(--warning)',
      shipped: 'var(--info)',
      delivered: 'var(--success)',
      cancelled: 'var(--danger)'
    };
    return colors[status] || 'var(--text-light)';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending_payment: '⏳',
      payment_completed: '✅',
      processing: '⏳',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📦';
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (searchQuery && !order.orderId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'amount-high') return b.total - a.total;
    if (sortBy === 'amount-low') return a.total - b.total;
    return 0;
  });

  // Order actions
  const handleDeleteOrder = (orderId) => {
    // Remove from localStorage
    localStorage.removeItem(`order_${orderId}`);
    
    // Update state
    const updatedOrders = orders.filter(order => order.orderId !== orderId);
    setOrders(updatedOrders);
    setSelectedOrder(null);
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      const updatedOrder = { 
        ...orderToCancel, 
        status: 'cancelled', 
        cancelReason: 'Cancelled by customer',
        cancelledDate: new Date().toISOString()
      };
      
      // Update in localStorage
      localStorage.setItem(`order_${orderToCancel.orderId}`, JSON.stringify(updatedOrder));
      
      // Update state
      const updatedOrders = orders.map(order => 
        order.orderId === orderToCancel.orderId ? updatedOrder : order
      );
      setOrders(updatedOrders);
      setShowCancelModal(false);
      setOrderToCancel(null);
      setSelectedOrder(updatedOrder);
    }
  };

  const handleReorder = (order) => {
    alert(`Adding ${order.items.length} items from order ${order.orderId} to your cart`);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status display text
  const getStatusText = (status) => {
    const statusMap = {
      pending_payment: 'Pending Payment',
      payment_completed: 'Payment Completed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <LoadingDots />
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button 
              className="primary-btn" 
              onClick={() => window.location.href = '/shop'}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="orders-stats">
              <div className="stat-item">
                <span className="stat-number">{orders.length}</span>
                <span className="stat-label">Total Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</span>
                <span className="stat-label">Total Spent</span>
              </div>
            </div>

            <div className="orders-controls">
              <div className="filter-section">
                <label>Filter by Status:</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Orders ({orders.length})</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="payment_completed">Payment Completed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="sort-section">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>
              </div>

              <div className="search-section">
                <label>Search:</label>
                <input
                  type="text"
                  placeholder="Search by order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="orders-list">
              {sortedOrders.map((order) => (
                <div key={order.orderId} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.orderId}</h3>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ color: getStatusColor(order.status) }}
                      >
                        {getStatusIcon(order.status)} {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </div>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: ${order.total.toFixed(2)}</strong>
                    </div>
                    <div className="order-actions">
                      {order.status === 'pending_payment' && (
                        <button 
                          className="secondary-btn"
                          onClick={() => handleCancelOrder(order)}
                        >
                          Cancel
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button 
                          className="danger-btn"
                          onClick={() => handleDeleteOrder(order.orderId)}
                        >
                          Delete
                        </button>
                      )}
                      <button 
                        className="primary-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order #{selectedOrder.orderId}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-details">
                  <div className="detail-section">
                    <h3>Order Information</h3>
                    <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                    <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Status:</strong> {getStatusText(selectedOrder.status)}</p>
                    <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Items</h3>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="detail-item">
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {selectedOrder.shippingInfo && (
                    <div className="detail-section">
                      <h3>Shipping Information</h3>
                      <p><strong>Name:</strong> {selectedOrder.shippingInfo.fullName}</p>
                      <p><strong>Address:</strong> {selectedOrder.shippingInfo.address}</p>
                      <p><strong>City:</strong> {selectedOrder.shippingInfo.city}</p>
                      <p><strong>Phone:</strong> {selectedOrder.shippingInfo.phone}</p>
                    </div>
                  )}

                  {selectedOrder.paymentMethod && (
                    <div className="detail-section">
                      <h3>Payment Method</h3>
                      <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                      {selectedOrder.paymentMethod === 'mpesa' && (
                        <p><strong>Phone:</strong> {selectedOrder.shippingInfo?.phone}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="secondary-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
                {selectedOrder.status === 'pending_payment' && (
                  <button 
                    className="danger-btn"
                    onClick={() => {
                      handleCancelOrder(selectedOrder);
                      setSelectedOrder(null);
                    }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Cancel Order</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowCancelModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <p>Are you sure you want to cancel order #{orderToCancel?.orderId}?</p>
                <p>This action cannot be undone.</p>
              </div>

              <div className="modal-footer">
                <button 
                  className="secondary-btn"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Order
                </button>
                <button 
                  className="danger-btn"
                  onClick={confirmCancelOrder}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;