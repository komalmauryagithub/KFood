const mongoose = require('mongoose');

// DramaFood Schema
const dramaFoodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, 'Please provide a food name'],
    trim: true,
    maxlength: [100, 'Food name cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Please provide a food image URL']
  },
  dramaName: {
    type: String,
    required: [true, 'Please provide the drama name']
  },
  dramaPoster: {
    type: String,
    required: [true, 'Please provide a drama poster URL']
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide a video URL']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for searching drama foods
dramaFoodSchema.index({ foodName: 'text', dramaName: 'text', description: 'text' });

module.exports = mongoose.model('DramaFood', dramaFoodSchema);
