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
    <div className="kfood-themed-page idol-meals-page">
      {/* HEADER */}
      <div className="category-header idol-hero">
        <div className="container">
          <p className="category-eyebrow">K-pop favorites</p>
          <h1 className="category-title">Idol Meals</h1>
          <p className="category-description">Explore idols and their favorite Korean foods</p>
        </div>
      </div>

      {/* IDOLS */}
      <div className="container">
        {loading ? (
          <div className="loading idol-loading">
            <div className="spinner"></div>
            <p>Loading idol meals...</p>
          </div>
        ) : idols.length === 0 ? (
          <div className="wishlist-empty idol-empty">
            <h2>No idols found</h2>
            <p>Check back later for more idol meals.</p>
          </div>
        ) : (
          <div className="idols-grid">
            {idols.map((idol) => (
              <div key={idol._id} className="idol-card">
                <img
                  src={idol.image || "https://via.placeholder.com/300"}
                  alt={idol.name}
                  className="idol-image"
                />
                <div className="idol-card-body">
                  <h3 className="idol-name">{idol.name}</h3>
                  <p className="idol-group">{idol.groupName}</p>
                </div>

                <button className="view-favorites-btn" onClick={() => handleViewFavorites(idol)}>
                  View Meals ({idol.favoriteFoods?.length || 0})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedIdol && (
        <div className="modal-overlay idol-modal-overlay" onClick={handleOverlayClick}>
          <div className="modal modal-large idol-modal">
            <button className="close-btn" onClick={closeModal}>
              X
            </button>

            <div className="idol-modal-header">
              <img
                src={selectedIdol.image || "https://via.placeholder.com/120"}
                alt={selectedIdol.name}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/120";
                }}
              />
              <div>
                <p className="idol-modal-kicker">{selectedIdol.groupName}</p>
                <h2 className="modal-title">{selectedIdol.name}</h2>
                <p className="idol-modal-subtitle">
                  {favoriteFoods.length} favorite {favoriteFoods.length === 1 ? "meal" : "meals"}
                </p>
              </div>
            </div>

            {favoriteFoods.length === 0 ? (
              <div className="idol-modal-empty">No foods found</div>
            ) : (
              <div className="idol-modal-body">
                <div className="products-grid idol-foods-modal-grid">
                  {favoriteFoods.map((food, index) => (
                  <ProductCard key={food._id || `food-${index}`} product={food} />
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdolMeals;
