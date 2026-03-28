const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Drama Bites', 'Popular Foods', 'Idol Meals', 'AI Cook']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for searching products
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
