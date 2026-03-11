import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { idols } from '../data/idols';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI, orderAPI } from '../services/api';


const IdolMeals = () => {
  const navigate = useNavigate();
  const [selectedIdol, setSelectedIdol] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState({});
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  const handleViewFavorites = (idol) => {
    setSelectedIdol(idol);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedIdol(null), 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleQuantityChange = (foodId, delta) => {
    setQuantities(prev => {
      const currentQty = prev[foodId] || 1;
      const newQty = Math.max(1, currentQty + delta);
      return { ...prev, [foodId]: newQty };
    });
  };

  const getQuantity = (foodId) => {
    return quantities[foodId] || 1;
  };

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
        name: food.name,
        price: food.price,
        image: food.image,
        description: food.description,
        category: food.category
      });
      alert('Added to wishlist!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to wishlist');
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
        name: food.name,
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
      alert('Order placed successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div>
      {/* Category Header */}
      <div className="category-header">
        <div className="container">
          <h1 className="category-title">Idol Meals</h1>
          <p className="category-description">
            Discover your favorite K-pop idols and their go-to Korean dishes
          </p>
        </div>
      </div>

      {/* Idol Cards Section */}
      <section className="container">
        <div className="idols-grid">
          {idols.map((idol) => (
            <div key={idol.id} className="idol-card">
              <div className="idol-profile">
                <img 
                  src={idol.image} 
                  alt={idol.name}
                  className="idol-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                <div className="idol-info">
                  <h3 className="idol-name">{idol.name}</h3>
                  <p className="idol-group">{idol.group}</p>
                </div>
              </div>
              <button 
                className="btn btn-primary view-favorites-btn"
                onClick={() => handleViewFavorites(idol)}
              >
                View Favorite Meals
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedIdol && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-container">
            <button className="modal-close-btn" onClick={closeModal}>
              ✕
            </button>

            <div className="modal-idol-header">
              <img 
                src={selectedIdol.image} 
                alt={selectedIdol.name}
                className="modal-idol-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
              <div className="modal-idol-info">
                <h2 className="modal-idol-name">{selectedIdol.name}</h2>
                <p className="modal-idol-group">{selectedIdol.group}</p>
              </div>
            </div>

            <div className="modal-foods-section">
              <h3 className="modal-foods-title">
                {selectedIdol.name}'s Favorite Korean Foods
              </h3>
              <div className="modal-foods-grid">
                {selectedIdol.favoriteFoods.map((food) => (
                  <div key={food._id} className="modal-food-card">
                    <img 
                      src={food.image} 
                      alt={food.name}
                      className="modal-food-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <div className="modal-food-info">
                      <h4 className="modal-food-name">{food.name}</h4>
                      <p className="modal-food-description">{food.description}</p>
                      <div className="modal-food-price">${food.price.toFixed(2)}</div>
                      
                      {/* Quantity Selector */}
                      <div className="quantity-selector">
                        <label>Qty:</label>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => handleQuantityChange(food._id, -1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="qty-value">{getQuantity(food._id)}</span>
                          <button 
                            onClick={() => handleQuantityChange(food._id, 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="modal-food-actions">
                        <button 
                          className="btn btn-outline modal-wishlist-btn"
                          onClick={() => handleAddToWishlist(food)}
                        >
                          ♡ Wishlist
                        </button>
                        <button 
                          className="btn btn-primary modal-order-btn"
                          onClick={() => handleOrderNow(food, getQuantity(food._id))}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        .idols-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          padding: 20px 0;
        }

        .idol-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .idol-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .idol-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 20px;
        }

        .idol-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #ff6b6b;
          margin-bottom: 16px;
        }

        .idol-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
        }

        .idol-group {
          font-size: 1rem;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .view-favorites-btn {
          width: 100%;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .view-favorites-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
          padding: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          background: white;
          border-radius: 20px;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-close-btn {
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
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .modal-close-btn:hover {
          background: #ff6b6b;
          color: white;
        }

        .modal-idol-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          border-radius: 20px 20px 0 0;
        }

        .modal-idol-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .modal-idol-info {
          color: white;
        }

        .modal-idol-name {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 5px 0;
        }

        .modal-idol-group {
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.9;
        }

        .modal-foods-section {
          padding: 30px;
        }

        .modal-foods-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 20px 0;
          text-align: center;
        }

        .modal-foods-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .modal-food-card {
          background: #fff;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .modal-food-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .modal-food-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .modal-food-info {
          padding: 15px;
        }

        .modal-food-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 5px 0;
        }

        .modal-food-description {
          font-size: 0.85rem;
          color: #666;
          margin: 0 0 10px 0;
          line-height: 1.4;
        }

        .modal-food-price {
          font-size: 1.3rem;
          font-weight: 800;
          color: #ff6b6b;
          margin-bottom: 10px;
        }

        /* Quantity Selector */
        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .quantity-selector label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
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

        .modal-food-actions {
          display: flex;
          gap: 8px;
        }

        .modal-wishlist-btn,
        .modal-order-btn {
          flex: 1;
          padding: 10px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-wishlist-btn {
          background: white;
          border: 2px solid #ff6b6b;
          color: #ff6b6b;
        }

        .modal-wishlist-btn:hover {
          background: #ff6b6b;
          color: white;
        }

        .modal-order-btn {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          border: none;
          color: white;
        }

        .modal-order-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        @media (max-width: 768px) {
          .idols-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .idol-image {
            width: 120px;
            height: 120px;
          }

          .modal-idol-header {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }

          .modal-foods-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default IdolMeals;
