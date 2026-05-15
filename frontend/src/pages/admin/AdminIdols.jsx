import { useState, useEffect } from "react";
import { idolAPI } from "../../services/api";
import "../../styles/admin/Buttons.css";

const AdminIdols = () => {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIdol, setEditingIdol] = useState(null);
  const [editingFood, setEditingFood] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    groupName: "",
    image: "",
  });

  const [foodFormData, setFoodFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
  });

  const [selectedIdolId, setSelectedIdolId] = useState("");
  const [foods, setFoods] = useState([
    { name: "", image: "", description: "", price: 0 },
  ]);
  const [allFoods, setAllFoods] = useState([]);

  // ✅ Fetch idols
  useEffect(() => {
    fetchIdols();
  }, []);

  // ✅ Reset dropdown if idol deleted
  useEffect(() => {
    if (selectedIdolId && !idols.find((i) => i._id === selectedIdolId)) {
      setSelectedIdolId("");
    }
  }, [idols]);

  const fetchIdols = async () => {
    try {
      setLoading(true);
      const res = await idolAPI.getAll();
      const idolsData = res?.data?.idols || [];

      setIdols(idolsData);
      updateAllFoods(idolsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ flatten foods
  const updateAllFoods = (idolsList) => {
    const flat = [];

    idolsList.forEach((idol) => {
      const foods = Array.isArray(idol.favoriteFoods)
        ? idol.favoriteFoods
        : [];

      foods.forEach((food, index) => {
        flat.push({
          ...food,
          idolId: idol._id,
          idolName: idol.name,
          index,
        });
      });
    });

    setAllFoods(flat);
  };

  // ---------------- IDOL ----------------
  const handleIdolInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIdolSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIdol) {
        await idolAPI.update(editingIdol._id, formData);
      } else {
        await idolAPI.create({
          ...formData,
          favoriteFoods: [],
        });
      }

      setFormData({ name: "", groupName: "", image: "" });
      setEditingIdol(null);
      fetchIdols();
    } catch {
      alert("Save failed");
    }
  };

  const handleDeleteIdol = async (id) => {
    if (!window.confirm("Delete idol?")) return;
    await idolAPI.delete(id);
    fetchIdols();
  };

  // ---------------- ADD FOODS ----------------
  const handleFoodsChange = (index, field, value) => {
    const newFoods = [...foods];
    newFoods[index][field] = value;
    setFoods(newFoods);
  };

  const addFood = () => {
    setFoods([...foods, { name: "", image: "", description: "", price: 0 }]);
  };

  const submitFoods = async () => {
    try {
      if (!selectedIdolId) {
        alert("Select idol first ❌");
        return;
      }

      const validFoods = foods.filter((f) => f.name.trim() !== "");

      if (validFoods.length === 0) {
        alert("Enter at least one food ❌");
        return;
      }

      for (let food of validFoods) {
        await idolAPI.addFood(selectedIdolId, food);
      }

      alert("Foods added successfully ✅");

      setFoods([{ name: "", image: "", description: "", price: 0 }]);
      setSelectedIdolId("");
      fetchIdols();
    } catch (err) {
      console.error(err);
      alert("Food add failed ❌");
    }
  };

  // ---------------- DELETE FOOD ----------------
  const handleDeleteFood = async (idolId, index) => {
    const idol = idols.find((i) => i._id === idolId);
    const updatedFoods = [...idol.favoriteFoods];

    updatedFoods.splice(index, 1);

    await idolAPI.update(idolId, {
      name: idol.name,
      groupName: idol.groupName,
      image: idol.image,
      favoriteFoods: updatedFoods,
    });

    fetchIdols();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* ADD / EDIT IDOL */}
      <h2>{editingIdol ? "Edit Idol" : "Add Idol"}</h2>
      <form onSubmit={handleIdolSubmit}>
        <input name="name" value={formData.name} onChange={handleIdolInputChange} placeholder="Name" />
        <input name="groupName" value={formData.groupName} onChange={handleIdolInputChange} placeholder="Group" />
        <input name="image" value={formData.image} onChange={handleIdolInputChange} placeholder="Image" />

        <button className="btn-add">
          {editingIdol ? "Update" : "Add"}
        </button>
      </form>

      {/* ADD FOODS */}
      <h2>Add Foods</h2>

      {idols.length === 0 && <p>No idols available ❌</p>}

      <select value={selectedIdolId} onChange={(e) => setSelectedIdolId(e.target.value)}>
        <option value="">Select Idol</option>

        {idols.map((idol) => (
          <option key={idol._id} value={idol._id}>
            {idol.name} ({idol.groupName})
          </option>
        ))}
      </select>

      {foods.map((f, i) => (
        <div key={i}>
          <input value={f.name} placeholder="Food Name" onChange={(e) => handleFoodsChange(i, "name", e.target.value)} />
          <input value={f.image} placeholder="Image" onChange={(e) => handleFoodsChange(i, "image", e.target.value)} />
          <input value={f.price} type="number" placeholder="Price" onChange={(e) => handleFoodsChange(i, "price", Number(e.target.value))} />
          <textarea value={f.description} placeholder="Desc" onChange={(e) => handleFoodsChange(i, "description", e.target.value)} />
        </div>
      ))}

      <button className="btn-add" onClick={addFood}>+ Add More</button>
      <button className="btn-add" onClick={submitFoods}>Save Foods</button>

      {/* IDOLS TABLE */}
      <h2>All Idols</h2>
      <table>
        <tbody>
          {idols.map((idol) => (
            <tr key={idol._id}>
              <td>{idol.name}</td>
              <td>{idol.groupName}</td>
              <td>{idol.favoriteFoods?.length || 0}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => {
                    setEditingIdol(idol);
                    setFormData({
                      name: idol.name,
                      groupName: idol.groupName,
                      image: idol.image,
                    });
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn-danger"
                  onClick={() => handleDeleteIdol(idol._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FOODS TABLE */}
      <h2>All Favorite Foods</h2>
      <table>
        <tbody>
          {allFoods.length === 0 ? (
            <tr>
              <td>No Foods Found ❌</td>
            </tr>
          ) : (
            allFoods.map((food, i) => (
              <tr key={i}>
                <td>{food.idolName}</td>
                <td>{food.name}</td>
                <td>${food.price}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditingFood(food);
                      setFoodFormData({
                        name: food.name || "",
                        description: food.description || "",
                        price: food.price || 0,
                        image: food.image || "",
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() =>
                      handleDeleteFood(food.idolId, food.index)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* EDIT FOOD */}
      {editingFood && (
        <div>
          <h3>Edit Food</h3>

          <input value={foodFormData.name} onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })} />
          <input value={foodFormData.image} onChange={(e) => setFoodFormData({ ...foodFormData, image: e.target.value })} />
          <input type="number" value={foodFormData.price} onChange={(e) => setFoodFormData({ ...foodFormData, price: Number(e.target.value) })} />
          <textarea value={foodFormData.description} onChange={(e) => setFoodFormData({ ...foodFormData, description: e.target.value })} />

          <button
            className="btn-add"
            onClick={async () => {
              const idol = idols.find(
                (i) => i._id === editingFood.idolId
              );

              const updatedFoods = [...idol.favoriteFoods];
              updatedFoods[editingFood.index] = foodFormData;

              await idolAPI.update(idol._id, {
                name: idol.name,
                groupName: idol.groupName,
                image: idol.image,
                favoriteFoods: updatedFoods,
              });

              setEditingFood(null);
              fetchIdols();
            }}
          >
            Update Food
          </button>

          <button className="btn-secondary" onClick={() => setEditingFood(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminIdols;