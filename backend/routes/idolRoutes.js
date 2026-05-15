const express = require('express');
const router = express.Router();
const Idol = require('../models/Idol');

// ✅ GET ALL
router.get('/', async (req, res) => {
  const idols = await Idol.find();
  res.json({ idols });
});

// ✅ CREATE IDOL
router.post('/', async (req, res) => {
  try {
    const idol = await Idol.create({
      name: req.body.name,
      groupName: req.body.groupName,
      image: req.body.image,
      favoriteFoods: [] // 🔥 IMPORTANT
    });

    res.status(201).json({ idol });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE (🔥 MOST IMPORTANT)
router.put('/:id', async (req, res) => {
  try {
    const idol = await Idol.findById(req.params.id);

    if (!idol) {
      return res.status(404).json({ message: "Idol not found" });
    }

    idol.name = req.body.name || idol.name;
    idol.groupName = req.body.groupName || idol.groupName;
    idol.image = req.body.image || idol.image;

    // 🔥 THIS FIXES YOUR ISSUE
    if (req.body.favoriteFoods) {
      idol.favoriteFoods = req.body.favoriteFoods;
    }

    const updated = await idol.save();

    res.json({ idol: updated });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// ✅ DELETE
router.delete('/:id', async (req, res) => {
  await Idol.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✅ GET ALL FOODS (FLATTEN)
router.get('/foods', async (req, res) => {
  const idols = await Idol.find();

  const allFoods = [];

  idols.forEach(idol => {
    idol.favoriteFoods.forEach(food => {
      allFoods.push({
        ...food.toObject(),
        idolName: idol.name,
        idolId: idol._id
      });
    });
  });

  res.json({ foods: allFoods });
});

// ✅ GET FOODS BY IDOL
router.get('/:idolId/foods', async (req, res) => {
  const idol = await Idol.findById(req.params.idolId);

  if (!idol) {
    return res.status(404).json({ message: "Idol not found" });
  }

  res.json({ foods: idol.favoriteFoods || [] });
});


// ✅ ADD FOOD (BEST METHOD)
router.post('/:idolId/foods', async (req, res) => {
  try {
    const idol = await Idol.findById(req.params.idolId);

    if (!idol) {
      return res.status(404).json({ message: "Idol not found" });
    }

    const { name, description, price, image } = req.body;

    // ✅ validation
    if (!name) {
      return res.status(400).json({ message: "Food name required" });
    }

    const newFood = {
      name,
      description: description || '',
      price: price || 0,
      image: image || ''
    };

    idol.favoriteFoods.push(newFood);

    await idol.save();

    res.status(201).json({ message: "Food added", food: newFood });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Food add failed" });
  }
});

// 🔥 ADD THIS ROUTE
router.get('/favorite-foods', async (req, res) => {
  try {
    const idols = await Idol.find();

    const allFoods = [];

    idols.forEach(idol => {
      if (idol.favoriteFoods && idol.favoriteFoods.length > 0) {
        idol.favoriteFoods.forEach(food => {
          allFoods.push({
            ...food._doc,
            idolName: idol.name,
            groupName: idol.groupName,
            idolId: idol._id
          });
        });
      }
    });

    res.json({ foods: allFoods });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch foods" });
  }
});


module.exports = router;