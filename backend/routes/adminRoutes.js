const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAllWishlists,
  getAllContacts,
  getAnalytics,
  getFavoriteFoods,
  updateFavoriteFood,
  deleteFavoriteFood,
} = require("../controllers/adminController");

const idolController = require("../controllers/idolController");

const { protect, admin } = require("../middleware/authMiddleware");

// Protect all admin routes
router.use(protect, admin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getAllUsers);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Wishlist
router.get("/wishlist", getAllWishlists);

// Contacts
router.get("/contacts", getAllContacts);

// Analytics
router.get("/analytics", getAnalytics);

// Favorite foods
router.get("/favorite-foods", getFavoriteFoods);
router.put("/favorite-foods/:id", updateFavoriteFood);
router.delete("/favorite-foods/:id", deleteFavoriteFood);

// Idols
router.get("/idols", idolController.getIdols);
router.post("/idols", idolController.createIdol);

// Node.js example
router.put("/idols/:id", async (req, res) => {
  const idol = await Idol.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ idol });
});
router.delete("/idols/:id", idolController.deleteIdol);

// Idol → Favorite foods
router.get(
  "/idols/:idolId/favorite-foods",
  idolController.getFavoriteFoodsByIdol,
);
router.post("/idols/:idolId/favorite-foods", idolController.createFavoriteFood);
router.delete(
  "/idols/:idolId/favorite-foods/:foodIndex",
  idolController.deleteFavoriteFoodByIdol,
);

module.exports = router;
