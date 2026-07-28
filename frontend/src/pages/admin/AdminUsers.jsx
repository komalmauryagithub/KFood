import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-themed-page admin-loading-state loading">Loading users... (Auto-refreshing)</div>;

  const handleManualRefresh = () => {
    fetchUsers();
  };

  return (
    <div className="admin-themed-page admin-users">
      <div className="page-header">
        <h1>User Management</h1>
        <button onClick={handleManualRefresh} className="btn btn-secondary">Refresh Now</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-tag role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.orderCount || 0}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

