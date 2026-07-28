import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
    
    const interval = setInterval(() => {
      fetchContacts();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/admin/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-themed-page admin-loading-state loading">Loading contacts... (Auto-refreshing)</div>;

  const handleManualRefresh = () => {
    fetchContacts();
  };

  return (
    <div className="admin-themed-page admin-contacts">
      <div className="page-header">
        <h1>Contact Messages</h1>
        <button onClick={handleManualRefresh} className="btn btn-secondary">Refresh Now</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.subject || 'N/A'}</td>
                <td>{contact.message.substring(0, 100)}...</td>
                <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContacts;

