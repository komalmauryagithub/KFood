import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Drama Bites',
    image: '',
    stock: 0
  });
  const navigate = useNavigate();

  const categories = ['Drama Bites', 'Popular Foods', 'Idol Meals', 'AI Cook'];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await api.get('/products');
      setFoods(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await api.put(`/products/${editingFood._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      fetchFoods();
      setFormData({ name: '', description: '', price: '', category: 'Drama Bites', image: '', stock: 0 });
      setEditingFood(null);
    } catch (error) {
      console.error('Failed to save food:', error);
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData(food);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchFoods();
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading foods...</div>;

  return (
    <div className="admin-foods">
      <h1>Food Management</h1>

      <form onSubmit={handleSubmit} className="food-form">
        <h2>{editingFood ? 'Edit Food' : 'Add New Food'}</h2>
        <div className="form-grid">
          <input
            name="name"
            placeholder="Food Name"
            value={formData.name}
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
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingFood ? 'Update' : 'Create'}
        </button>
        {editingFood && (
          <button type="button" onClick={() => setEditingFood(null)} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </form>

      <div className="foods-list">
        <h2>All Foods ({foods.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td>
                    <img src={food.image} alt={food.name} className="table-image" />
                  </td>
                  <td>{food.name}</td>
                  <td>${parseFloat(food.price).toFixed(2)}</td>
                  <td>
                    <span className={`category-tag category-${food.category.toLowerCase().replace(' ', '-')} `}>
                      {food.category}
                    </span>
                  </td>
                  <td>{food.stock}</td>
                  <td>
                    <button onClick={() => handleEdit(food)} className="btn btn-small btn-primary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(food._id)} className="btn btn-small btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFoods;

