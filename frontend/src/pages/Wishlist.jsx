import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { wishlistAPI, orderAPI } from "../services/api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});

  const getProduct = (item) => {
    // Handle both populated MongoDB products and static data (idol foods)
    if (item.product && item.product.name) return item.product;
    if (item.staticData) return item.staticData;
    if (item.product) {
      return {
        name: "Item",
        image: "https://via.placeholder.com/300",
        price: 0,
        _id: item.product,
      };
    }
    return null;
  };

  const getWishlistItemKey = (item) => {
    const product = getProduct(item);
    return product?._id || item.product?._id || item.product || item._id;
  };

  const setWishlistWithQuantities = (data) => {
    const nextWishlist = data || { products: [] };
    setWishlist(nextWishlist);

    setQuantities((prev) => {
      const nextQuantities = {};

      (nextWishlist.products || []).forEach((item) => {
        const key = getWishlistItemKey(item);
        if (key) nextQuantities[key] = prev[key] || 1;
      });

      return nextQuantities;
    });
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist();
      setWishlistWithQuantities(res?.data || { products: [] });
    } catch (err) {
      setError("Failed to load wishlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const res = await wishlistAPI.removeFromWishlist(productId);
      setWishlistWithQuantities(res?.data || { products: [] });
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const handleOrderNow = async (item) => {
    const product = item.product || item.staticData;
    const itemKey = getWishlistItemKey(item);
    const quantity = quantities[itemKey] || 1;

    if (!product) {
      alert("Product not found");
      return;
    }

    try {
      const orderItem = {
        name: product.name,
        price: Number(product.price || 0),
        image: product.image,
        quantity,
      };

      if (item.product?._id) {
        orderItem.product = item.product._id;
      }

      await orderAPI.createOrder({
        orderItems: [orderItem],
        shippingAddress: {
          address: "Default",
          city: "Mumbai",
          postalCode: "400001",
          country: "India",
        },
        paymentMethod: "cod",
      });

      alert("Order placed!");

      // ✅ remove after order
      if (item.product?._id) {
        handleRemoveFromWishlist(item.product._id);
      }
    } catch (err) {
      console.error(err);
      alert("Order failed");
    }
  };

  // ✅ safer product getter
  const handleQuantityChange = (item, delta) => {
    const itemKey = getWishlistItemKey(item);
    if (!itemKey) return;

    setQuantities((prev) => ({
      ...prev,
      [itemKey]: Math.max(1, (prev[itemKey] || 1) + delta),
    }));
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div className="wishlist-page">
      
        <h1  className="page-title">My Wishlist</h1>
   
    

      {error && <p className="error-message">{error}</p>}

      {wishlist.products.length === 0 ? (
        <div className="wishlist-empty">
          <h2>Your wishlist is empty</h2>
          <Link to="/popular-foods" className="btn btn-primary">
            Browse Foods
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.products.map((item) => {
            const product = getProduct(item);
            if (!product) return null;
            const itemKey = getWishlistItemKey(item);
            const quantity = quantities[itemKey] || 1;

            return (
              <div key={itemKey} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/400x300")
                  }
                />

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <div className="product-price">
                    ₹{Number(product.price || 0).toFixed(2)}
                  </div>

                  <div className="wishlist-quantity-selector">
                    <span>Quantity</span>
                    <div className="wishlist-qty-controls">
                      <button
                        type="button"
                        className="wishlist-qty-btn"
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <strong className="wishlist-qty-value">{quantity}</strong>
                      <button
                        type="button"
                        className="wishlist-qty-btn"
                        onClick={() => handleQuantityChange(item, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOrderNow(item)}
                    >
                      Order Now
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={() => handleRemoveFromWishlist(product._id || item._id)}
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
