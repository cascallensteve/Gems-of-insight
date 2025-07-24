import React, { useState, useEffect } from 'react';
import './OrdersPage.css';

const OrdersPage = ({ user, onNavigateBack }) => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-2024-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 67.99,
        items: [
          {
            id: 1,
            name: 'Premium Organic Green Tea Collection',
            quantity: 2,
            price: 24.99,
            image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg'
          },
          {
            id: 2,
            name: 'Raw Manuka Honey - Pure Gold',
            quantity: 1,
            price: 32.00,
            image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg'
          }
        ],
        shippingAddress: '123 Wellness St, Health City, HC 12345',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-18',
        actualDelivery: '2024-01-17'
      },
      {
        id: 'ORD-2024-002',
        date: '2024-01-20',
        status: 'shipped',
        total: 45.50,
        items: [
          {
            id: 3,
            name: 'Himalayan Herbal Wellness Mix',
            quantity: 1,
            price: 18.50,
            image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg'
          },
          {
            id: 4,
            name: 'Complete Wellness Starter Kit',
            quantity: 1,
            price: 45.99,
            image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg'
          }
        ],
        shippingAddress: '123 Wellness St, Health City, HC 12345',
        trackingNumber: 'TRK987654321',
        estimatedDelivery: '2024-01-25'
      },
      {
        id: 'ORD-2024-003',
        date: '2024-01-22',
        status: 'processing',
        total: 89.98,
        items: [
          {
            id: 5,
            name: 'Organic Superfood Bundle',
            quantity: 2,
            price: 44.99,
            image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg'
          }
        ],
        shippingAddress: '123 Wellness St, Health City, HC 12345',
        estimatedDelivery: '2024-01-28'
      },
      {
        id: 'ORD-2024-004',
        date: '2024-01-10',
        status: 'cancelled',
        total: 25.99,
        items: [
          {
            id: 6,
            name: 'Natural Energy Booster',
            quantity: 1,
            price: 25.99,
            image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg'
          }
        ],
        shippingAddress: '123 Wellness St, Health City, HC 12345',
        cancelReason: 'Changed mind'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      processing: '#f59e0b',
      shipped: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
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

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-high') return b.total - a.total;
    if (sortBy === 'amount-low') return a.total - b.total;
    return 0;
  });

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
    setSelectedOrder(null);
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      setOrders(orders.map(order => 
        order.id === orderToCancel.id 
          ? { ...order, status: 'cancelled', cancelReason: 'Cancelled by customer' }
          : order
      ));
      setShowCancelModal(false);
      setOrderToCancel(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <div className="header-left">
            <button className="back-btn" onClick={onNavigateBack}>
              ← Back to Shop
            </button>
            <h1>My Orders</h1>
            <p>Track and manage your orders</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-content">
          <div className="orders-list">
            {sortedOrders.length === 0 ? (
              <div className="no-orders">
                <div className="no-orders-icon">📦</div>
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet or no orders match your filter criteria.</p>
                <button className="shop-now-btn" onClick={onNavigateBack}>
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
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items.slice(0, 2).map(item => (
                      <div key={item.id} className="order-item">
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
                      <button className="action-btn view-btn">
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
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                    >
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="detail-row">
                      <span>Tracking:</span>
                      <span className="tracking-number">{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Items Ordered</h3>
                  <div className="detailed-items">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="detailed-item">
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

                {selectedOrder.status === 'delivered' && (
                  <div className="detail-actions">
                    <button className="reorder-btn">
                      🔄 Reorder Items
                    </button>
                    <button 
                      className="delete-order-btn"
                      onClick={() => handleDeleteOrder(selectedOrder.id)}
                    >
                      🗑️ Delete Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel order #{orderToCancel?.id}?</p>
            <p className="cancel-warning">This action cannot be undone.</p>
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
  );
};

export default OrdersPage;
