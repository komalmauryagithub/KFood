const mongoose = require('mongoose');

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  products: [
    {
      // For MongoDB products
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      // For static data (Idol Meals, Drama Bites)
      staticData: {
        _id: String,
        name: String,
        price: Number,
        image: String,
        description: String,
        category: String
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
