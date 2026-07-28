import { useState, useEffect } from 'react';
import { Heart, ListChecks, RefreshCw, TrendingUp, Users } from 'lucide-react';
import api from '../../services/api';
import '../../styles/admin/Buttons.css';
import '../../styles/admin/AdminWishlist.css';

const AdminWishlist = () => {
  const [wishlistData, setWishlistData] = useState({ wishlists: [], mostLiked: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
    
    const interval = setInterval(() => {
      fetchWishlist();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchWishlist = async () => {
    try {
      setError('');
      setRefreshing(true);
      const response = await api.get('/admin/wishlist');
      setWishlistData(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setError('Wishlist data load nahi ho paaya.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchWishlist();
  };

  const wishlists = Array.isArray(wishlistData.wishlists)
    ? wishlistData.wishlists
    : [];

  const getProduct = (item) => item?.product || item?.staticData || null;

  const totalItems = wishlists.reduce(
    (sum, wishlist) => sum + (wishlist.products?.length || 0),
    0
  );

  const activeUsers = wishlists.filter(
    (wishlist) => (wishlist.products?.length || 0) > 0
  ).length;

  const productCounts = wishlists.reduce((acc, wishlist) => {
    (wishlist.products || []).forEach((item) => {
      const product = getProduct(item);
      const key = product?._id || product?.name;
      if (!key) return;

      if (!acc[key]) {
        acc[key] = {
          id: key,
          name: product.name || 'Unknown food',
          image: product.image || '',
          count: 0,
        };
      }

      acc[key].count += 1;
    });

    return acc;
  }, {});

  const mostLikedFoods = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'N/A';
    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getLastActivity = (wishlist) => {
    const productDates = (wishlist.products || [])
      .map((item) => item.addedAt)
      .filter(Boolean)
      .map((date) => new Date(date).getTime())
      .filter((time) => !Number.isNaN(time));

    const lastProductDate = productDates.length
      ? Math.max(...productDates)
      : null;

    return lastProductDate || wishlist.createdAt;
  };

  if (loading) {
    return (
      <div className="admin-wishlist loading-state">
        <div className="wishlist-loading-card">
          <RefreshCw size={22} className="spin-icon" />
          <span>Loading wishlist monitor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wishlist">
      <div className="wishlist-header">
        <div>
          <p className="wishlist-kicker">Admin Panel</p>
          <h1>Wishlist Monitoring</h1>
          <p className="wishlist-subtitle">Track saved foods, active users, and top favorites.</p>
        </div>

        <button
          onClick={handleManualRefresh}
          className={`btn btn-secondary refresh-btn ${refreshing ? 'is-refreshing' : ''}`}
          disabled={refreshing}
        >
          <RefreshCw size={18} />
          {refreshing ? 'Refreshing' : 'Refresh'}
        </button>
      </div>

      {error && <div className="wishlist-alert">{error}</div>}

      <div className="wishlist-summary-grid">
        <div className="wishlist-summary-card">
          <div className="summary-icon">
            <Users size={20} />
          </div>
          <div>
            <span>Users</span>
            <strong>{wishlists.length}</strong>
          </div>
        </div>

        <div className="wishlist-summary-card">
          <div className="summary-icon">
            <Heart size={20} />
          </div>
          <div>
            <span>Total Saved</span>
            <strong>{totalItems}</strong>
          </div>
        </div>

        <div className="wishlist-summary-card">
          <div className="summary-icon">
            <ListChecks size={20} />
          </div>
          <div>
            <span>Active Wishlists</span>
            <strong>{activeUsers}</strong>
          </div>
        </div>

        <div className="wishlist-summary-card">
          <div className="summary-icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <span>Top Food Saves</span>
            <strong>{mostLikedFoods[0]?.count || 0}</strong>
          </div>
        </div>
      </div>

      <section className="wishlist-panel">
        <div className="panel-header">
          <div>
            <h2>Most Liked Foods</h2>
            <p>Top 5 foods saved across customer wishlists.</p>
          </div>
        </div>

        {mostLikedFoods.length === 0 ? (
          <div className="empty-panel">No wishlist likes yet.</div>
        ) : (
          <div className="liked-food-list">
            {mostLikedFoods.map((item, index) => (
              <div key={item.id} className="liked-food-card">
                <span className="rank-badge">{index + 1}</span>
                <img
                  src={item.image || 'https://via.placeholder.com/80?text=Food'}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/80?text=Food';
                  }}
                />
                <div className="liked-food-info">
                  <strong>{item.name}</strong>
                  <span>{item.count} saved</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="wishlist-panel">
        <div className="panel-header">
          <div>
            <h2>All Wishlists</h2>
            <p>{wishlists.length} customer records</p>
          </div>
        </div>

        <div className="wishlist-table-wrap">
          <table className="wishlist-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Items</th>
                <th>Products</th>
                <th>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {wishlists.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-table-cell">No wishlists found.</td>
                </tr>
              ) : (
                wishlists.map((w) => (
                  <tr key={w._id}>
                    <td>
                      <div className="wishlist-user">
                        <span className="user-avatar">
                          {(w.user?.name || 'NA').slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <strong>{w.user?.name || 'N/A'}</strong>
                          <span>{w.user?.email || 'No email'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="count-pill">{w.products?.length || 0}</span>
                    </td>
                    <td>
                      <div className="wishlist-products">
                        {(w.products || []).slice(0, 3).map((item, index) => {
                          const product = getProduct(item);
                          return (
                            <span key={`${w._id}-${index}`} className="product-chip">
                              <img
                                src={product?.image || 'https://via.placeholder.com/48?text=Food'}
                                alt={product?.name || 'Food'}
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/48?text=Food';
                                }}
                              />
                              <span>{product?.name || 'Unknown food'}</span>
                            </span>
                          );
                        })}
                        {(w.products?.length || 0) > 3 && (
                          <span className="more-chip">+{w.products.length - 3} more</span>
                        )}
                        {(w.products?.length || 0) === 0 && (
                          <span className="muted-text">No products</span>
                        )}
                      </div>
                    </td>
                    <td>{formatDate(getLastActivity(w))}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminWishlist;
