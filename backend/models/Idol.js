const mongoose = require('mongoose');

// 🔥 Food Schema (separate for clean structure)
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  description: {
    type: String,
    default: '' // ✅ optional banaya
  },
  price: {
    type: Number,
    default: 0, // ✅ crash avoid
    min: 0
  },
  image: {
    type: String,
    default: '' // ✅ optional
  }
}, { _id: false }); // optional: separate id avoid

// 🔥 Idol Schema
const idolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Idol name is required'],
    trim: true,
    maxlength: [100, 'Name too long']
  },
  groupName: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name too long']
  },
  image: {
    type: String,
    required: [true, 'Idol image URL required']
  },

  // 🔥 IMPORTANT FIX
  favoriteFoods: {
    type: [foodSchema],
    default: [] // ✅ agar empty ho to bhi crash nahi
  }

}, {
  timestamps: true // ✅ createdAt + updatedAt auto
});

module.exports = mongoose.model('Idol', idolSchema);