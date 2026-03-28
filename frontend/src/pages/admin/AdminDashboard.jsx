import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import '../../styles/admin/Dashboard.css';
import '../../styles/admin/Table.css';
import '../../styles/admin/Buttons.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.dashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Foods</h3>
          <p className="stat-number">{stats.totalFoods || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${stats.totalRevenue?.toFixed(2) || 0}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Orders</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6)}</td>
                  <td>{order.user?.name}</td>
                  <td>${order.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className={`status status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              )) || <tr><td colSpan="5">No recent orders</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Most Popular Food</h2>
        <div className="popular-food">
          {stats.mostPopularFood ? (
            <p>{stats.mostPopularFood._id} ({stats.mostPopularFood.count} orders)</p>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

