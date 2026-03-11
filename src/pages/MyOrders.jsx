import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      setError('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setDeletingId(orderId);
      await orderAPI.deleteOrder(orderId);
      // Remove the deleted order from state
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete order');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate totals - use order.totalAmount which is set by backend
  const calculateTotals = () => {
    let totalItems = 0;
    let grandTotal = 0;
    
    orders.forEach(order => {
      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach(item => {
          totalItems += item.quantity || 1;
        });
      }
      // Use totalAmount from backend (calculated correctly)
      grandTotal += order.totalAmount || 0;
    });
    
    return { totalItems, grandTotal };
  };

  const { totalItems, grandTotal } = orders.length > 0 ? calculateTotals() : { totalItems: 0, grandTotal: 0 };

  const getStatusClass = (status) => {
    if (status === 'delivered') return 'delivered';
    if (status === 'processing' || status === 'shipped') return 'processing';
    return 'pending';
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <h1 className="page-title">My Orders</h1>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="page-title">My Orders</h1>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>You haven't ordered anything yet</h2>
          <p>Start ordering your favorite Korean dishes!</p>
          <Link to="/popular-foods" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div>
          {/* Order Summary */}
          <div className="orders-summary">
            <div className="summary-card">
              <div className="summary-icon">📦</div>
              <div className="summary-content">
                <div className="summary-label">Total Items Ordered</div>
                <div className="summary-value">{totalItems}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <div className="summary-label">Grand Total</div>
                <div className="summary-value">${grandTotal.toFixed(2)}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🛒</div>
              <div className="summary-content">
                <div className="summary-label">Total Orders</div>
                <div className="summary-value">{orders.length}</div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-header-actions">
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <button 
                      className="delete-order-btn"
                      onClick={() => handleDeleteOrder(order._id)}
                      disabled={deletingId === order._id}
                      title="Delete Order"
                    >
                      {deletingId === order._id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
                
                <div className="order-items">
                  {order.orderItems && order.orderItems.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-image">
                        <img 
                          src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="order-item-details">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-meta">
                          <span className="item-price">${item.price.toFixed(2)}</span>
                          <span className="item-quantity">x{item.quantity || 1}</span>
                        </div>
                      </div>
                      <div className="order-item-total">
                        ${((item.total) || (item.price * (item.quantity || 1))).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="order-payment">
                    <span className="payment-label">Payment:</span>
                    <span className="payment-method">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                    </span>
                  </div>
                  <div className="order-total">
                    <span className="total-label">Order Total:</span>
                    <span className="total-amount">${(order.totalAmount || grandTotal).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        .orders-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
        }

        .summary-icon {
          font-size: 2.5rem;
        }

        .summary-content {
          flex: 1;
        }

        .summary-label {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-bottom: 5px;
        }

        .summary-value {
          font-size: 1.8rem;
          font-weight: 700;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #eee;
        }

        .order-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .order-id {
          font-weight: 700;
          font-size: 1.1rem;
          color: #333;
        }

        .order-date {
          font-size: 0.9rem;
          color: #666;
        }

        .order-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .delete-order-btn {
          background: #ff4757;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-order-btn:hover:not(:disabled) {
          background: #ff6b81;
          transform: scale(1.05);
        }

        .delete-order-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .order-status {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .order-status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .order-status.processing {
          background: #cce5ff;
          color: #004085;
        }

        .order-status.delivered {
          background: #d4edda;
          color: #155724;
        }

        .order-items {
          padding: 20px;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-item-image {
          width: 70px;
          height: 70px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .order-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .order-item-details {
          flex: 1;
        }

        .order-item-name {
          font-weight: 600;
          font-size: 1rem;
          color: #333;
          margin-bottom: 5px;
        }

        .order-item-meta {
          display: flex;
          gap: 10px;
          font-size: 0.9rem;
          color: #666;
        }

        .item-quantity {
          background: #f0f0f0;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .order-item-total {
          font-weight: 700;
          font-size: 1.1rem;
          color: #ff6b6b;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #eee;
        }

        .order-payment {
          display: flex;
          gap: 8px;
          font-size: 0.9rem;
          color: #666;
        }

        .payment-method {
          font-weight: 600;
          color: #333;
        }

        .order-total {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .total-label {
          font-size: 0.9rem;
          color: #666;
        }

        .total-amount {
          font-size: 1.3rem;
          font-weight: 800;
          color: #ff6b6b;
        }

        @media (max-width: 768px) {
          .orders-summary {
            grid-template-columns: 1fr;
          }

          .order-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .order-header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .order-item {
            flex-wrap: wrap;
          }

          .order-footer {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
