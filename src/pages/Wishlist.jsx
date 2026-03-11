import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI, orderAPI } from '../services/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data);
    } catch (error) {
      setError('Failed to load wishlist');
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(productId);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleOrderNow = async (item) => {
    // Get the product data - could be from product or staticData
    const product = item.product || item.staticData;
    
    if (!product) {
      alert('Product data not found');
      return;
    }
    
    try {
      const orderItem = {
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      };
      
      // Add product reference if it's a MongoDB product
      if (item.product && item.product._id) {
        orderItem.product = item.product._id;
      }
      
      await orderAPI.createOrder({
        orderItems: [orderItem],
        shippingAddress: {},
        paymentMethod: 'cod'
      });
      alert('Order placed successfully!');
      // Optionally remove from wishlist after ordering
      const itemId = item.product ? item.product._id : item.staticData?._id;
      if (itemId) {
        handleRemoveFromWishlist(itemId);
      }
    } catch (error) {
      console.error('Error ordering:', error);
      alert('Failed to place order');
    }
  };

  // Helper function to get product data from item
  const getProductData = (item) => {
    if (item.product) {
      return item.product;
    }
    if (item.staticData) {
      return item.staticData;
    }
    return null;
  };

  // Helper function to get unique ID for item
  const getItemId = (item) => {
    if (item.product && item.product._id) {
      return item.product._id.toString();
    }
    if (item.staticData && item.staticData._id) {
      return item.staticData._id;
    }
    return Math.random().toString(36).substr(2, 9);
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <h1 className="page-title">My Wishlist</h1>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="page-title">My Wishlist</h1>

      {error && <div className="error-message">{error}</div>}

      {!wishlist || !wishlist.products || wishlist.products.length === 0 ? (
        <div className="wishlist-empty">
          <h2>Your wishlist is empty</h2>
          <p>Start adding your favorite Korean dishes!</p>
          <Link to="/popular-foods" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.products.map((item) => {
            const product = getProductData(item);
            const itemId = getItemId(item);
            
            if (!product) {
              return null;
            }
            
            return (
              <div key={itemId} className="product-card">
                <img 
                  src={product.image} 
                  alt={product.name || 'Product'} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                <div className="product-info">
                  <div className="product-category">{product.category || 'Food'}</div>
                  <h3 className="product-name">{product.name || 'Unknown Product'}</h3>
                  <p className="product-description">{product.description || ''}</p>
                  <div className="product-price">${(product.price || 0).toFixed(2)}</div>
                  <div className="product-actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleOrderNow(item)}
                      style={{ marginRight: '10px' }}
                    >
                      Order Now
                    </button>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => handleRemoveFromWishlist(itemId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
