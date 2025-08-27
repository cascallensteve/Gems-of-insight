import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, createOrder, initiateMpesaPayment } from '../services/api';
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
        
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        if (savedOrders.length > 0) {
          setOrders(savedOrders);
        } else {
          // If no orders exist, show mock data for demo
          const mockOrders = generateMockOrders();
          setOrders(mockOrders);
          localStorage.setItem('orders', JSON.stringify(mockOrders));
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Generate realistic mock orders
  const generateMockOrders = () => {
    const products = [
      {
        id: 1,
        name: 'Premium Organic Green Tea Collection',
        price: 24.99,
        image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg'
      },
      // ... other products
    ];

    const statuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    const mockOrders = [];

    for (let i = 1; i <= 8; i++) {
      const items = [];
      const itemCount = Math.max(1, Math.floor(Math.random() * 4));
      
      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        items.push({
          ...product,
          quantity: Math.max(1, Math.floor(Math.random() * 3))
        });
      }

      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.99;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      mockOrders.push({
        id: `ORD-2024-${i.toString().padStart(3, '0')}`,
        date: date.toISOString().split('T')[0],
        status,
        total: parseFloat(total.toFixed(2)),
        items,
        shippingAddress: '123 Wellness St, Health City, HC 12345',
        ...(status === 'shipped' || status === 'delivered' ? {
          trackingNumber: `TRK${Math.floor(100000000 + Math.random() * 900000000)}`,
          estimatedDelivery: new Date(date.getTime() + (3 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        } : {}),
        ...(status === 'delivered' ? {
          actualDelivery: new Date(date.getTime() + (3 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        } : {}),
        ...(status === 'cancelled' ? {
          cancelReason: ['Changed mind', 'Found better price', 'No longer needed'][Math.floor(Math.random() * 3)]
        } : {})
      });
    }

    return mockOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Get status color and icon
  const getStatusColor = (status) => {
    const colors = {
      processing: 'var(--warning)',
      shipped: 'var(--info)',
      delivered: 'var(--success)',
      cancelled: 'var(--danger)'
    };
    return colors[status] || 'var(--text-light)';
  };

  const getStatusIcon = (status) => {
    const icons = {
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
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-high') return b.total - a.total;
    if (sortBy === 'amount-low') return a.total - b.total;
    return 0;
  });

  // Order actions
  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setSelectedOrder(null);
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      const updatedOrders = orders.map(order => 
        order.id === orderToCancel.id 
          ? { 
              ...order, 
              status: 'cancelled', 
              cancelReason: 'Cancelled by customer',
              cancelledDate: new Date().toISOString().split('T')[0]
            } 
          : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setShowCancelModal(false);
      setOrderToCancel(null);
      setSelectedOrder(updatedOrders.find(o => o.id === orderToCancel.id));
    }
  };

  const handleReorder = (order) => {
    alert(`Adding ${order.items.length} items from order ${order.id} to your cart`);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate order stats
  const orderStats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0).toFixed(2),
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => window.history.back()}>
              ← Back to Shop
            </button>
            <h1>My Orders</h1>
            <p>Track and manage your orders</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{orderStats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">${orderStats.totalSpent}</span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              disabled={isLoading}
            >
              <option value="all">All Orders ({orderStats.totalOrders})</option>
              <option value="processing">Processing ({orderStats.processing})</option>
              <option value="shipped">Shipped ({orderStats.shipped})</option>
              <option value="delivered">Delivered ({orderStats.delivered})</option>
              <option value="cancelled">Cancelled ({orderStats.cancelled})</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              disabled={isLoading}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <LoadingDots text="Loading your orders..." size="large" />
          </div>
        )}

        {/* Orders List */}
        {!isLoading && (
          <div className="orders-content">
            <div className="orders-list">
              {sortedOrders.length === 0 ? (
                <div className="no-orders">
                  <div className="no-orders-icon">📦</div>
                  <h3>No orders found</h3>
                  <p>
                    {searchQuery 
                      ? `No orders match your search for "${searchQuery}"`
                      : filterStatus !== 'all'
                        ? `You don't have any ${filterStatus} orders`
                        : "You haven't placed any orders yet"}
                  </p>
                  <button 
                    className="shop-now-btn" 
                    onClick={() => window.location.href = '/products'}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                sortedOrders.map(order => (
                  <div 
                    key={order.id} 
                    className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.id}</h3>
                        <p>{formatDate(order.date)}</p>
                      </div>
                      <div className="order-status">
                        <span 
                          className={`status-badge ${order.status}`}
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items.slice(0, 2).map(item => (
                        <div key={`${order.id}-${item.id}`} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="more-items">+{order.items.length - 2} more items</div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                      <div className="order-actions">
                        {order.status === 'delivered' && (
                          <button 
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                        {(order.status === 'processing' || order.status === 'shipped') && (
                          <button 
                            className="action-btn cancel-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrder(order);
                            }}
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          className="action-btn view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Details Sidebar */}
            {selectedOrder && (
              <div className="order-details">
                <div className="details-header">
                  <h2>Order Details</h2>
                  <button 
                    className="close-details"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="details-content">
                  <div className="detail-section">
                    <h3>Order Information</h3>
                    <div className="detail-row">
                      <span>Order ID:</span>
                      <span>{selectedOrder.id}</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span>{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Status:</span>
                      <span 
                        className={`status-badge ${selectedOrder.status}`}
                        style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                      >
                        {getStatusIcon(selectedOrder.status)} {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="detail-row">
                        <span>Tracking:</span>
                        <a 
                          href={`https://tracking.example.com/?tracking=${selectedOrder.trackingNumber}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="tracking-number"
                        >
                          {selectedOrder.trackingNumber}
                        </a>
                      </div>
                    )}
                    {selectedOrder.cancelReason && (
                      <div className="detail-row">
                        <span>Cancel Reason:</span>
                        <span>{selectedOrder.cancelReason}</span>
                      </div>
                    )}
                    {selectedOrder.cancelledDate && (
                      <div className="detail-row">
                        <span>Cancelled On:</span>
                        <span>{formatDate(selectedOrder.cancelledDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="detail-section">
                    <h3>Items Ordered</h3>
                    <div className="detailed-items">
                      {selectedOrder.items.map(item => (
                        <div key={`${selectedOrder.id}-${item.id}-detail`} className="detailed-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p className="item-price">${item.price.toFixed(2)} each</p>
                          </div>
                          <div className="item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${(selectedOrder.total - 5.99).toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping:</span>
                        <span>$5.99</span>
                      </div>
                      <div className="summary-row total-row">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Shipping Information</h3>
                    <p>{selectedOrder.shippingAddress}</p>
                    {selectedOrder.estimatedDelivery && (
                      <p><strong>Estimated Delivery:</strong> {formatDate(selectedOrder.estimatedDelivery)}</p>
                    )}
                    {selectedOrder.actualDelivery && (
                      <p><strong>Delivered on:</strong> {formatDate(selectedOrder.actualDelivery)}</p>
                    )}
                  </div>

                  <div className="detail-actions">
                    <button 
                      className="reorder-btn"
                      onClick={() => handleReorder(selectedOrder)}
                    >
                      🔄 Reorder Items
                    </button>
                    {selectedOrder.status === 'delivered' && (
                      <button 
                        className="delete-order-btn"
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                      >
                        🗑️ Delete Order
                      </button>
                    )}
                    {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipped') && (
                      <button 
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(selectedOrder)}
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
            <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Cancel Order #{orderToCancel?.id}</h3>
              <p>You're about to cancel this order. Are you sure you want to proceed?</p>
              <p className="cancel-warning">
                ⚠️ This action cannot be undone. Any shipped items will need to be returned.
              </p>
              <div className="modal-actions">
                <button 
                  className="cancel-btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Order
                </button>
                <button 
                  className="confirm-cancel-btn"
                  onClick={confirmCancelOrder}
                >
                  Yes, Cancel Order
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