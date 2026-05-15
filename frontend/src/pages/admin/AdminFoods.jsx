import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFood, setEditingFood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Drama Bites",
    image: "",
    kdramaTitle: "",
    kdramaImageUrl: "",
    videoUrl: "",
    stock: 0,
  });

  const categories = ["All", "Drama Bites", "Popular Foods"];

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory]);

  // ✅ FETCH FOODS
  const fetchFoods = async () => {
    try {
      setLoading(true);

      if (selectedCategory === "Idol Meals") {
        const res = await api.get("/admin/favorite-foods");
        setFoods(res?.data?.foods || []);
      } else {
        let url = "/products";

        if (selectedCategory !== "All") {
          url += `?category=${encodeURIComponent(selectedCategory)}`;
        }

        const res = await api.get(url);
        setFoods(res?.data?.products || []);
      }
    } catch (err) {
      console.error("Fetch error:", err?.response?.data || err.message);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ INPUT CHANGE (fix controlled input warning)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  // ✅ SUBMIT (CREATE / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isIdolFood = selectedCategory === "Idol Meals";
      
      if (editingFood) {
        const endpoint = isIdolFood ? `/admin/favorite-foods/${editingFood._id}` : `/products/${editingFood._id}`;
        await api.put(endpoint, formData);
      } else {
        const endpoint = isIdolFood ? "/admin/favorite-foods" : "/products";
        await api.post(endpoint, formData);
      }

      fetchFoods();
      setEditingFood(null);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Drama Bites",
        image: "",
        kdramaTitle: "",
        kdramaImageUrl: "",
        videoUrl: "",
        stock: 0,
      });
    } catch (err) {
      console.error("Save error:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Save failed");
    }
  };

  // ✅ EDIT (FINAL FIXED VERSION)
  const handleEdit = (food) => {
    setEditingFood(food);

    setFormData({
      name: food?.name ?? "",
      description: food?.description ?? "",
      price: food?.price ?? "",
      category: selectedCategory === "Idol Meals" ? "Idol Meals" : (food?.category ?? "Drama Bites"),
      image: food?.image ?? "",
      // Hide drama fields for idol foods
      kdramaTitle: selectedCategory === "Idol Meals" ? "" : food?.kdramaTitle ?? "",
      kdramaImageUrl: selectedCategory === "Idol Meals" ? "" : food?.kdramaImageUrl ?? "",
      videoUrl: selectedCategory === "Idol Meals" ? "" : food?.videoUrl ?? "",
      stock: selectedCategory === "Idol Meals" ? 0 : (food?.stock ?? 0),
    });
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const endpoint =
        selectedCategory === "Idol Meals"
          ? `/admin/favorite-foods/${id}`
          : `/products/${id}`;

      await api.delete(endpoint);
      fetchFoods();
    } catch (err) {
      console.error("Delete error:", err?.response?.data || err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-foods">
      <h1>Food Management</h1>

      {/* CATEGORY TABS */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn filter-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />

        <input
          name="image"
          value={formData.image || ""}
          onChange={handleInputChange}
          placeholder="Image URL"
          required
        />

        <input
          name="price"
          type="number"
          value={formData.price || ""}
          onChange={handleInputChange}
          placeholder="Price"
        />

        <select
          name="category"
          value={formData.category || "Drama Bites"}
          onChange={handleInputChange}
          disabled={selectedCategory === "Idol Meals"}
        >
          {selectedCategory === "Idol Meals" ? (
            <option>Idol Meals (fixed)</option>
          ) : (
            ["Drama Bites", "Popular Foods"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))
          )}
        </select>

        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Description"
        />

<button type="submit" className="btn btn-primary">
          {editingFood ? "Update Food" : "Add Food"}
        </button>
      </form>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Info</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {foods.map((food) => (
            <tr key={food._id}>
              <td>
                <img
                  src={food.image}
                  alt={food.name}
                  width="50"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/50")
                  }
                />
              </td>

              <td>{food.name}</td>

              <td>
                {selectedCategory === "Idol Meals"
                  ? food?.idol
                    ? `${food.idol.name} (${food.idol.groupName})`
                    : "N/A"
                : `$${Number(food.price || 0).toFixed(2)}`}
              </td>

              <td>
                <button onClick={() => handleEdit(food)} className="btn btn-small btn-secondary">
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
  );
};

export default AdminFoods;