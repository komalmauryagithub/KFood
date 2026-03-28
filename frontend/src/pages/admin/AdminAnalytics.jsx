import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({ mostOrdered: [], dailyOrders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="admin-analytics">
      <h1>Analytics</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Most Ordered Foods</h3>
          <div className="stat-list">
            {analytics.mostOrdered.map((item, index) => (
              <div key={index}>
                {item._id} - {item.count} orders
              </div>
            ))}
          </div>
        </div>
        <div className="stat-card">
          <h3>Daily Orders (7 days)</h3>
          <div className="daily-chart">
            {analytics.dailyOrders.map((day) => (
              <div key={day._id} className="bar-container">
                <span className="bar-label">{day._id}</span>
                <div className="bar" style={{ '--bar-width': `${(day.count / Math.max(...analytics.dailyOrders.map(d => d.count), 1)) * 100}%` }}>
                  {day.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

