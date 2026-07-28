import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { idolAPI } from '../../services/api';
import '../../styles/admin/Table.css';
import '../../styles/admin/Forms.css';
import '../../styles/admin/Buttons.css';

const AdminIdolsFoods = () => {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIdol, setEditingIdol] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    groupName: '',
    image: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchIdols();
  }, []);

  // ✅ FETCH IDOLS (SAFE)
  const fetchIdols = async () => {
    try {
      setLoading(true);
      const response = await idolAPI.getAll();
      setIdols(response?.data?.idols || []);
    } catch (error) {
      console.error('Failed to fetch idols:', error);
      setIdols([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  // ✅ INPUT
  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingIdol) {
        await idolAPI.update(editingIdol._id, formData);
      } else {
        // 🔥 IMPORTANT FIX
        await idolAPI.create({
          ...formData,
          favoriteFoods: [] // ensure field exists
        });
      }

      await fetchIdols();

      setFormData({ name: '', groupName: '', image: '' });
      setEditingIdol(null);

    } catch (error) {
      console.error('Failed to save idol:', error);
      alert("Save failed ❌");
    }
  };

  // ✅ EDIT
  const handleEdit = (idol) => {
    setEditingIdol(idol);
    setFormData({
      name: idol.name || '',
      groupName: idol.groupName || '',
      image: idol.image || ''
    });
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this idol and all associated foods?')) return;

    try {
      await idolAPI.delete(id);
      await fetchIdols(); // 🔥 refresh instantly
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) return <div className="admin-themed-page admin-loading-state loading">Loading idols...</div>;

  return (
    <div className="admin-themed-page admin-idols admin-idol-meals-list">
      
      <div className="page-header">
        <h1>Idol Meals Management</h1>
        <p>Manage idols and their favorite foods</p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="idol-form">
        <h2>{editingIdol ? 'Edit Idol' : 'Add New Idol'}</h2>

        <div className="form-grid">
          <input
            name="name"
            placeholder="Idol Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <input
            name="groupName"
            placeholder="Group Name"
            value={formData.groupName}
            onChange={handleInputChange}
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editingIdol ? 'Update Idol' : 'Create Idol'}
        </button>

        {editingIdol && (
          <button
            type="button"
            onClick={() => setEditingIdol(null)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <div className="idols-list">
        <h2>Idols ({idols.length})</h2>

        {!idols.length ? (
          <p>No idols found ❌</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Idol</th>
                  <th>Group</th>
                  <th>Foods</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {idols.map((idol) => (
                  <tr key={idol._id}>
                    <td>
                      <img
                        src={idol.image}
                        alt={idol.name}
                        className="table-image idol-image"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/50")
                        }
                      />
                    </td>

                    <td>{idol.name}</td>
                    <td>{idol.groupName}</td>

                    <td>
                      {idol.favoriteFoods?.length
                        ? `${idol.favoriteFoods.length} foods`
                        : "No foods"}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(idol)}
                          className="btn btn-small btn-primary"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(idol._id)}
                          className="btn btn-small btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIdolsFoods;
