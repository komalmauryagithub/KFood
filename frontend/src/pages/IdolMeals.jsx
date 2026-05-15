import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { idolAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/IdolMeals.css";

const IdolMeals = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdol, setSelectedIdol] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [allFavoriteFoods, setAllFavoriteFoods] = useState([]);


  // ✅ FETCH DATA (SAFE VERSION)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const idolsRes = await idolAPI.getAll();
        setIdols(idolsRes?.data?.idols || []);

        // 🔥 try foods API (agar nahi mila to fallback use karo)
        let foods = [];

        try {
          const foodsRes = await idolAPI.getAllFavoriteFoods();
          foods = foodsRes?.data?.foods || [];
        } catch (err) {
          console.warn("Foods API failed, using fallback");

          // 🔥 fallback: idols se foods nikaal
          foods = (idolsRes?.data?.idols || []).flatMap((idol) =>
            (idol.favoriteFoods || []).map((food, index) => ({
              ...food,
              idolName: idol.name,
              idolId: idol._id,
              _id: food._id || `${idol._id}-${index}`, // fallback id
            })),
          );
        }

        setAllFavoriteFoods(foods);
      } catch (err) {
        console.error("Fetch error:", err);
        setIdols([]);
        setAllFavoriteFoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // ✅ VIEW FOODS
  const handleViewFavorites = async (idol) => {
    setSelectedIdol(idol);

    try {
      const res = await idolAPI.getFavoriteFoods(idol._id);
      setFavoriteFoods(res?.data?.foods || idol.favoriteFoods || []);
    } catch (err) {
      console.warn("Using fallback foods");
      setFavoriteFoods(idol.favoriteFoods || []);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedIdol(null), 200);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };



  return (
    <div>
      {/* HEADER */}
      <div className="category-header">
        <h1>Idol Meals</h1>
        <p>Explore idols & their favorite foods</p>
      </div>

      {/* IDOLS */}
      <div className="container">
        {loading ? (
          <p>Loading...</p>
        ) : idols.length === 0 ? (
          <p>No idols found</p>
        ) : (
          <div className="idols-grid">
            {idols.map((idol) => (
              <div key={idol._id} className="idol-card">
                <img
                  src={idol.image || "https://via.placeholder.com/300"}
                  alt={idol.name}
                />
                <h3>{idol.name}</h3>
                <p>{idol.groupName}</p>

                <button onClick={() => handleViewFavorites(idol)}>
                  View Meals ({idol.favoriteFoods?.length || 0})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedIdol && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal modal-large">
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>

            <h2 className="modal-title">{selectedIdol.name}</h2>

            {favoriteFoods.length === 0 ? (
              <p>No foods found</p>
            ) : (
              <div className="products-grid">
{favoriteFoods.map((food, index) => (
                  <ProductCard key={food._id || `food-${index}`} product={food} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdolMeals;
