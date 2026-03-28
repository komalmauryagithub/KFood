const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  seedProducts 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @access  Public
router.get('/', getProducts);

// @route   POST /api/products/seed
// @access  Public
router.post('/seed', seedProducts);

// @route   GET /api/products/:id
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
