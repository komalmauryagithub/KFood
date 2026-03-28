const DramaFood = require('../models/DramaFood');

// @desc    Get all drama foods
// @route   GET /api/drama-foods
// @access  Public
const getDramaFoods = async (req, res) => {
  try {
    const dramaFoods = await DramaFood.find({});
    res.json(dramaFoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single drama food by ID
// @route   GET /api/drama-foods/:id
// @access  Public
const getDramaFoodById = async (req, res) => {
  try {
    const dramaFood = await DramaFood.findById(req.params.id);
    
    if (dramaFood) {
      res.json(dramaFood);
    } else {
      res.status(404).json({ message: 'Drama food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new drama food
// @route   POST /api/drama-foods
// @access  Private/Admin
const createDramaFood = async (req, res) => {
  try {
    const { foodName, price, image, dramaName, dramaPoster, videoUrl, description, productId } = req.body;
    
    const dramaFood = new DramaFood({
      foodName,
      price,
      image,
      dramaName,
      dramaPoster,
      videoUrl,
      description,
      productId
    });
    
    const createdDramaFood = await dramaFood.save();
    res.status(201).json(createdDramaFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a drama food
// @route   DELETE /api/drama-foods/:id
// @access  Private/Admin
const deleteDramaFood = async (req, res) => {
  try {
    const dramaFood = await DramaFood.findById(req.params.id);
    
    if (dramaFood) {
      await dramaFood.deleteOne();
      res.json({ message: 'Drama food removed' });
    } else {
      res.status(404).json({ message: 'Drama food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed drama foods (for testing)
// @route   POST /api/drama-foods/seed
// @access  Public
const seedDramaFoods = async (req, res) => {
  try {
    const dramaFoods = [
      {
        foodName: 'Tteokbokki',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=400',
        dramaName: 'Crash Landing on You',
        dramaPoster: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400',
        videoUrl: 'https://www.youtube.com/embed/taRiydbh8UE',
        description: 'Spicy rice cakes in gochujang sauce, a beloved Korean street food'
      },
      {
        foodName: 'Ramyeon',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        dramaName: 'Itaewon Class',
        dramaPoster: 'https://images.unsplash.com/photo-1512070679635-db38f2cd17da?w=400',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Instant Korean ramen, a comfort food for all occasions'
      },
      {
        foodName: 'Jjajangmyeon',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=400',
        dramaName: 'True Beauty',
        dramaPoster: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=400',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Black bean noodles with vegetables and pork'
      },
      {
        foodName: 'Fried Chicken & Beer',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=400',
        dramaName: 'My Love From The Star',
        dramaPoster: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=400',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Crispy fried chicken with refreshing beer - the perfect combo'
      },
      {
        foodName: 'Bibimbap',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400',
        dramaName: 'Start-Up',
        dramaPoster: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Mixed rice bowl with vegetables, egg, and spicy sauce'
      },
      {
        foodName: 'Gimbap',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        dramaName: 'Hospital Playlist',
        dramaPoster: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Korean sushi rolls with various fillings'
      }
    ];
    
    // Clear existing drama foods and create new ones
    await DramaFood.deleteMany({});
    const createdDramaFoods = await DramaFood.insertMany(dramaFoods);
    
    res.status(201).json(createdDramaFoods);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDramaFoods,
  getDramaFoodById,
  createDramaFood,
  deleteDramaFood,
  seedDramaFoods
};
