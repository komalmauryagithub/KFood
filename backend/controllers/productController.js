const Product = require('../models/Product');


// ✅ GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    let { category, search, page = 1, limit = 10 } = req.query;

    // 🔥 convert to number
    page = Number(page);
    limit = Number(limit);

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });

  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);

  } catch (error) {
    console.error("Create error:", error);
    res.status(400).json({ message: error.message });
  }
};


// ✅ UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: error.message });
  }
};


// ✅ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({ message: 'Product removed' });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ SEED PRODUCTS (FIXED 🔥)
exports.seedProducts = async (req, res) => {
  try {

    // 🔥 OPTIONAL: force reseed
    const force = req.query.force === "true";

    const count = await Product.countDocuments();

    if (count > 0 && !force) {
      return res.status(200).json({
        message: 'Products already exist. Use ?force=true to reseed.'
      });
    }

    // 🔥 Clear existing if force
    if (force) {
      await Product.deleteMany({});
    }

    const products = [
      {
        name: 'Korean BBQ Beef',
        description: 'Authentic Korean BBQ beef with marinated bulgogi',
        price: 15.99,
        category: 'Drama Bites',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
        stock: 50
      },
      {
        name: 'Kimchi Fried Rice',
        description: 'Spicy kimchi fried rice with crispy pork',
        price: 12.99,
        category: 'Drama Bites',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        stock: 30
      },
      {
        name: 'Tteokbokki',
        description: 'Spicy rice cakes in red pepper sauce',
        price: 10.99,
        category: 'Drama Bites',
        image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400',
        stock: 40
      },
      {
        name: 'Samgyeopsal',
        description: 'Korean pork belly grilled at your table',
        price: 18.99,
        category: 'Popular Foods',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
        stock: 25
      },
      {
        name: 'Bibimbap',
        description: 'Mixed rice bowl with vegetables and spicy sauce',
        price: 13.99,
        category: 'Popular Foods',
        image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400',
        stock: 35
      }
    ];

    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      message: 'Products seeded successfully',
      count: createdProducts.length
    });

  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ message: error.message });
  }
};