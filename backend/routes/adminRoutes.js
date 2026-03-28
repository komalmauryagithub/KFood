const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAllWishlists,
  getAllContacts,
  getAnalytics
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users management
router.get('/users', getAllUsers);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Wishlist monitoring
router.get('/wishlist', getAllWishlists);

// Contacts
router.get('/contacts', getAllContacts);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;

