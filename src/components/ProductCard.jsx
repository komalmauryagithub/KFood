import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI, orderAPI } from '../services/api';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      setIsAddingToWishlist(true);
      
      // Check if product._id is a valid MongoDB ObjectId (24 hex characters)
      // Static data items have string IDs like "idol-1-1" or "drama-1"
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(product._id);
      
      // For static data items, pass the full object as staticData
      if (!isValidObjectId) {
        await wishlistAPI.addToWishlist(product._id, {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category
        });
      } else {
        await wishlistAPI.addToWishlist(product._id);
      }
      
      setMessage('Added to wishlist!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add to wishlist');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleOrderNow = async () => {
    if (!isAuthenticated) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      setIsOrdering(true);
      
      // Check if product._id is a valid MongoDB ObjectId (24 hex characters)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(product._id);
      
      const orderItem = {
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      };
      
      // Only add product reference if it's a valid MongoDB ObjectId
      if (isValidObjectId) {
        orderItem.product = product._id;
      }
      
      const orderData = {
        orderItems: [orderItem],
        shippingAddress: {
          address: 'Default Address',
          city: 'Default City',
          postalCode: '00000',
          country: 'Default'
        },
        paymentMethod: 'cod'
      };
      
      await orderAPI.createOrder(orderData);
      setMessage('Order placed successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to place order');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
        }}
      />
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price.toFixed(2)}</div>
        
        {/* Quantity Selector */}
        <div className="quantity-selector">
          <label>Quantity:</label>
          <div className="quantity-controls">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="qty-btn"
              disabled={isOrdering}
            >
              -
            </button>
            <span className="qty-value">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="qty-btn"
              disabled={isOrdering}
            >
              +
            </button>
          </div>
        </div>
        
        {message && <div className="success-message" style={{ marginBottom: '10px' }}>{message}</div>}
        
        <div className="product-actions">
          <button 
            className="btn btn-outline" 
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
          >
            {isAddingToWishlist ? 'Adding...' : '♡ Wishlist'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleOrderNow}
            disabled={isOrdering}
          >
            {isOrdering ? 'Ordering...' : 'Order Now'}
          </button>
        </div>
      </div>
      
      {/* Inline Styles for Quantity Selector */}
      <style>{`
        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }
        .quantity-selector label {
          font-weight: 600;
          color: #333;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .qty-btn {
          width: 30px;
          height: 30px;
          border: 2px solid #ff6b6b;
          background: white;
          color: #ff6b6b;
          border-radius: 6px;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .qty-btn:hover:not(:disabled) {
          background: #ff6b6b;
          color: white;
        }
        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .qty-value {
          min-width: 30px;
          text-align: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
