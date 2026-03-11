const express = require('express');
const router = express.Router();
const { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist,
  clearWishlist 
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, getWishlist);

// @route   POST /api/wishlist
// @access  Private
router.post('/', protect, addToWishlist);

// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, removeFromWishlist);

// @route   DELETE /api/wishlist
// @access  Private
router.delete('/', protect, clearWishlist);

module.exports = router;
