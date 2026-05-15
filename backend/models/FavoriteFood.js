const mongoose = require('mongoose');

const favoriteFoodSchema = new mongoose.Schema({
  idol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idol',
    required: [true, 'Idol ID is required']
  },
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
    maxlength: [100, 'Food name too long']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description too long']
  },
  image: {
    type: String,
    required: [true, 'Food image URL required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FavoriteFood', favoriteFoodSchema);

