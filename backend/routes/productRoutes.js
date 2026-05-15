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

// ✅ GET all products
// /api/products
router.get('/', getProducts);

// ✅ SEED (better keep it protected to avoid duplicates)
router.post('/seed', protect, admin, seedProducts);

// ✅ GET single product
// /api/products/:id
router.get('/:id', getProductById);

// ✅ CREATE product
// /api/products
router.post('/', protect, admin, createProduct);

// ✅ UPDATE product
// /api/products/:id
router.put('/:id', protect, admin, updateProduct);

// ✅ DELETE product
// /api/products/:id
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
