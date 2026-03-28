import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dramaFoods } from '../data/dramaFoods';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI, orderAPI } from '../services/api';

const DramaBites = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Use static data for now (can switch to API later)
    setFoods(dramaFoods);
    setLoading(false);
  }, []);

  // Handle Add to Wishlist
  const handleAddToWishlist = async (food) => {
    if (!isAuthenticated) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }
    try {
      await wishlistAPI.addToWishlist(food._id, {
        _id: food._id,
        name: food.foodName,
        price: food.price,
        image: food.image,
        description: food.description,
        category: 'Drama Bites'
      });
      setMessage('Added to wishlist!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add to wishlist');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Handle Order Now
  const handleOrderNow = async (food, quantity = 1) => {
    if (!isAuthenticated) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }
    try {
      const orderItem = {
        name: food.foodName,
        price: food.price,
        image: food.image,
        quantity: quantity
      };
      
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
      setTimeout(() => {
        setMessage('');
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to place order');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Open video modal
  const handleWatchScene = (food) => {
    setSelectedVideo(food);
  };

  // Close video modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div>
      {/* Category Header */}
      <div className="category-header">
        <div className="container">
          <h1 className="category-title">Drama Bites</h1>
          <p className="category-description">
            Delicious Korean dishes featured in your favorite K-Dramas
          </p>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className="toast-message">{message}</div>
      )}

      {/* Drama Foods Grid */}
      <section className="container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : foods.length === 0 ? (
          <div className="wishlist-empty">
            <h2>No products found</h2>
            <p>Check back later for new dishes!</p>
          </div>
        ) : (
          <div className="drama-foods-grid">
            {foods.map((food) => (
              <DramaFoodCard 
                key={food._id} 
                food={food} 
                onAddToWishlist={handleAddToWishlist}
                onOrderNow={handleOrderNow}
                onWatchScene={handleWatchScene}
              />
            ))}
          </div>
        )}
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeVideoModal}>
              ✕
            </button>
            <h3 className="video-modal-title">
              {selectedVideo.foodName} - {selectedVideo.dramaName}
            </h3>
            <div className="video-modal-player">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.foodName}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        /* Drama Foods Grid */
        .drama-foods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
          padding: 20px 0;
        }

        .drama-food-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .drama-food-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
        }

        /* Drama Poster Header */
        .drama-poster-header {
          height: 120px;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .drama-poster-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }

        .drama-name-overlay {
          position: relative;
          z-index: 1;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          padding-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        /* Video Section */
        .video-section {
          padding: 15px;
          background: #f8f9fa;
        }

        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #000;
        }

        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .watch-scene-btn {
          width: 100%;
          margin-top: 10px;
          padding: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .watch-scene-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        /* Food Content */
        .drama-food-content {
          padding: 20px;
        }

        .drama-food-main {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .drama-food-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .drama-food-info {
          flex: 1;
        }

        .drama-food-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 5px 0;
        }

        .drama-food-description {
          font-size: 0.85rem;
          color: #666;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .drama-food-price {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ff6b6b;
        }

        /* Quantity Selector */
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
          width: 28px;
          height: 28px;
          border: 2px solid #ff6b6b;
          background: white;
          color: #ff6b6b;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .qty-btn:hover {
          background: #ff6b6b;
          color: white;
        }
        .qty-value {
          min-width: 25px;
          text-align: center;
          font-weight: 700;
          font-size: 1rem;
          color: #333;
        }

        /* Actions */
        .drama-food-actions {
          display: flex;
          gap: 10px;
        }

        .wishlist-btn,
        .order-btn {
          flex: 1;
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .wishlist-btn {
          background: white;
          border: 2px solid #ff6b6b;
          color: #ff6b6b;
        }

        .wishlist-btn:hover {
          background: #ff6b6b;
          color: white;
        }

        .order-btn {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          border: none;
          color: white;
        }

        .order-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        /* Toast Message */
        .toast-message {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #333;
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Video Modal */
        .video-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .video-modal-content {
          background: white;
          border-radius: 20px;
          max-width: 800px;
          width: 100%;
          padding: 20px;
          position: relative;
          animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .video-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f0f0f0;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .video-modal-close:hover {
          background: #ff6b6b;
          color: white;
        }

        .video-modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 15px 0;
          text-align: center;
        }

        .video-modal-player {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #000;
        }

        .video-modal-player iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .drama-foods-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .drama-food-main {
            flex-direction: column;
          }

          .drama-food-image {
            width: 100%;
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

// Drama Food Card Component with Quantity Selector
const DramaFoodCard = ({ food, onAddToWishlist, onOrderNow, onWatchScene }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="drama-food-card">
      {/* Drama Poster Header */}
      <div 
        className="drama-poster-header"
        style={{ backgroundImage: `url(${food.dramaPoster})` }}
      >
        <div className="drama-name-overlay">{food.dramaName}</div>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <div className="video-container">
          <iframe
            src={food.videoUrl}
            title={food.foodName}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <button 
          className="watch-scene-btn"
          onClick={() => onWatchScene(food)}
        >
          ▶ Watch Scene
        </button>
      </div>

      {/* Food Content */}
      <div className="drama-food-content">
        <div className="drama-food-main">
          <img 
            src={food.image} 
            alt={food.foodName}
            className="drama-food-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          <div className="drama-food-info">
            <h3 className="drama-food-name">{food.foodName}</h3>
            <p className="drama-food-description">{food.description}</p>
            <div className="drama-food-price">${food.price.toFixed(2)}</div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="quantity-selector">
          <label>Quantity:</label>
          <div className="quantity-controls">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="qty-btn"
            >
              -
            </button>
            <span className="qty-value">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="qty-btn"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="drama-food-actions">
          <button 
            className="btn btn-outline wishlist-btn"
            onClick={() => onAddToWishlist(food)}
          >
            ♡ Wishlist
          </button>
          <button 
            className="btn btn-primary order-btn"
            onClick={() => onOrderNow(food, quantity)}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DramaBites;
