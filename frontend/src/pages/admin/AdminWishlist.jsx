import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminWishlist = () => {
  const [wishlistData, setWishlistData] = useState({ wishlists: [], mostLiked: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/admin/wishlist');
      setWishlistData(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading wishlist...</div>;

  return (
    <div className="admin-wishlist">
      <h1>Wishlist Monitoring</h1>

      <div className="dashboard-section">
        <h2>Most Liked Foods</h2>
        <div className="stat-list">
          {wishlistData.mostLiked.map((item, index) => (
            <div key={index} className="stat-item">
              <span>{item.name || 'Unknown'}</span>
              <span className="stat-number">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>All Wishlists</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Products Count</th>
                <th>Added Date</th>
              </tr>
            </thead>
            <tbody>
              {wishlistData.wishlists.map((w) => (
                <tr key={w._id}>
                  <td>{w.user?.name || 'N/A'}</td>
                  <td>{w.products?.length || 0}</td>
                  <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWishlist;

