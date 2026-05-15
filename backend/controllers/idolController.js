const Idol = require('../models/Idol');
const asyncHandler = require('express-async-handler');

// Get all idols
const getIdols = asyncHandler(async (req, res) => {
  const idols = await Idol.find({}).sort({ createdAt: -1 }).lean();
  res.json({ idols });
});

// Get all favorite foods flattened (public)
const getAllFavoriteFoods = asyncHandler(async (req, res) => {
  const idols = await Idol.find({}).lean();
  const allFoods = [];
  
  idols.forEach(idol => {
    if (idol.favoriteFoods && idol.favoriteFoods.length > 0) {
      idol.favoriteFoods.forEach(food => {
        allFoods.push({
          ...food,
          idolName: idol.name,
          groupName: idol.groupName,
          idolImage: idol.image,
          idolId: idol._id
        });
      });
    }
  });

  res.json({ foods: allFoods });
});

// Create idol
const createIdol = asyncHandler(async (req, res) => {
  const { name, groupName, image } = req.body;

  const idol = new Idol({
    name,
    groupName,
    image,
    favoriteFoods: []
  });

  const createdIdol = await idol.save();
  res.status(201).json(createdIdol);
});

// Update idol
const updateIdol = asyncHandler(async (req, res) => {
  const idol = await Idol.findById(req.params.id);

  if (!idol) {
    res.status(404);
    throw new Error('Idol not found');
  }

  const { name, groupName, image, favoriteFoods } = req.body;

  idol.name = name || idol.name;
  idol.groupName = groupName || idol.groupName;
  idol.image = image || idol.image;

  if (favoriteFoods !== undefined) {
    idol.favoriteFoods = favoriteFoods;
  }

  const updatedIdol = await idol.save();
  res.json(updatedIdol);
});

// Delete idol
const deleteIdol = asyncHandler(async (req, res) => {
  const idol = await Idol.findById(req.params.id);

  if (!idol) {
    res.status(404);
    throw new Error('Idol not found');
  }

  await idol.deleteOne();
  res.json({ message: 'Idol removed' });
});

// Get favorite foods of idol
const getFavoriteFoodsByIdol = asyncHandler(async (req, res) => {
  const idol = await Idol.findById(req.params.idolId);

  if (!idol) {
    res.status(404);
    throw new Error('Idol not found');
  }

  res.json({ foods: idol.favoriteFoods || [] });
});

// Add favorite food to idol
const createFavoriteFood = asyncHandler(async (req, res) => {
  const idol = await Idol.findById(req.params.idolId);

  if (!idol) {
    res.status(404);
    throw new Error('Idol not found');
  }

  const { name, description, price, image } = req.body;

  const newFood = {
    name,
    description,
    price,
    image,
    _id: new Date().getTime().toString() // simple unique id
  };

  idol.favoriteFoods.push(newFood);

  await idol.save();

  res.status(201).json(newFood);
});

// Delete favorite food by array index
const deleteFavoriteFoodByIdol = asyncHandler(async (req, res) => {
  const { idolId, foodIndex } = req.params;

  const idol = await Idol.findById(idolId);

  if (!idol) {
    res.status(404);
    throw new Error('Idol not found');
  }

  const index = parseInt(foodIndex);
  if (!idol.favoriteFoods || index < 0 || index >= idol.favoriteFoods.length) {
    res.status(404);
    throw new Error('Food not found');
  }

  idol.favoriteFoods.splice(index, 1);

  await idol.save();

  res.json({ message: 'Food deleted successfully' });
});

module.exports = {
  getIdols,
  getAllFavoriteFoods,
  createIdol,
  updateIdol,
  deleteIdol,
  getFavoriteFoodsByIdol,
  createFavoriteFood,
  deleteFavoriteFoodByIdol
};

