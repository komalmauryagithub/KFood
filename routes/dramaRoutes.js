const express = require('express');
const router = express.Router();
const {
  getDramaFoods,
  getDramaFoodById,
  createDramaFood,
  deleteDramaFood,
  seedDramaFoods
} = require('../controllers/dramaController');

// Public routes
router.get('/', getDramaFoods);
router.get('/:id', getDramaFoodById);

// Seed route (for testing)
router.post('/seed', seedDramaFoods);

// Private/Admin routes (would need auth middleware in production)
router.post('/', createDramaFood);
router.delete('/:id', deleteDramaFood);

module.exports = router;
