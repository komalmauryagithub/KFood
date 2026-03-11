const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrderById, 
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @access  Private
router.post('/', protect, createOrder);

// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, getOrders);

// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

// @route   DELETE /api/orders/:id
// @access  Private
router.delete('/:id', protect, deleteOrder);

module.exports = router;
