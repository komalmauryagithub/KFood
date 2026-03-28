const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
      image: { type: String },
      total: { type: Number, required: true }, // price * quantity
      // product field is optional - only needed for products from the database
      // For idol meals (static data), we don't have a Product document reference
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    }
  ],
  shippingAddress: {
    address: { type: String, default: 'Default Address' },
    city: { type: String, default: 'Default City' },
    postalCode: { type: String, default: '00000' },
    country: { type: String, default: 'Default' }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'paypal', 'cod'],
    default: 'cod'
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
