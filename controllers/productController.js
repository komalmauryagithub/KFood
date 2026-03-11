const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .limit(limit * 1)
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
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
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial products
// @route   POST /api/products/seed
// @access  Public
exports.seedProducts = async (req, res) => {
  try {
    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Products already seeded' });
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
      },
      {
        name: 'Japchae',
        description: 'Stir-fried glass noodles with vegetables',
        price: 11.99,
        category: 'Popular Foods',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        stock: 28
      },
      {
        name: 'Idol Birthday Cake',
        description: 'Special birthday cake for K-pop idol fans',
        price: 45.99,
        category: 'Idol Meals',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        stock: 15
      },
      {
        name: 'Fan Meeting Platter',
        description: 'Special platter for idol fan meetings',
        price: 59.99,
        category: 'Idol Meals',
        image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400',
        stock: 10
      },
      {
        name: 'AI-Generated K-Drama Dish',
        description: 'Unique dish inspired by the latest K-Drama created by AI',
        price: 24.99,
        category: 'AI Cook',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        stock: 20
      },
      {
        name: 'AI Fusion Korean BBQ',
        description: 'Modern twist on traditional Korean BBQ by AI',
        price: 29.99,
        category: 'AI Cook',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
        stock: 18
      }
    ];
    
    const createdProducts = await Product.insertMany(products);
    res.status(201).json({ message: 'Products seeded successfully', count: createdProducts.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
