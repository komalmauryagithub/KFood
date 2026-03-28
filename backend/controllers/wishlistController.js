const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      // Create empty wishlist for user
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
      return res.json(wishlist);
    }

    // Manually populate only the MongoDB products (not staticData)
    const populatedProducts = await Promise.all(
      wishlist.products.map(async (item) => {
        if (item.product) {
          try {
            const product = await Product.findById(item.product).select('name price description image category stock');
            return {
              product: product,
              staticData: item.staticData,
              addedAt: item.addedAt
            };
          } catch (err) {
            // If product not found, just return staticData if available
            return {
              product: null,
              staticData: item.staticData,
              addedAt: item.addedAt
            };
          }
        }
        return item;
      })
    );

    wishlist.products = populatedProducts;
    res.json(wishlist);
  } catch (error) {
    console.error('Error in getWishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  const { productId, staticData } = req.body;

  try {
    // Check if this is static data (Idol Meals or Drama Bites)
    const isStaticData = staticData && staticData._id;
    
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      // Create new wishlist
      if (isStaticData) {
        // Add static data item
        wishlist = await Wishlist.create({
          user: req.user._id,
          products: [{ staticData }]
        });
      } else {
        // Check if MongoDB product exists
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        wishlist = await Wishlist.create({
          user: req.user._id,
          products: [{ product: productId }]
        });
      }
    } else {
      // Check if product already in wishlist
      let productIndex = -1;
      
      if (isStaticData) {
        // Check for static data
        productIndex = wishlist.products.findIndex(
          p => p.staticData && p.staticData._id === staticData._id
        );
      } else {
        // Check for MongoDB product
        productIndex = wishlist.products.findIndex(
          p => p.product && p.product.toString() === productId
        );
      }

      if (productIndex > -1) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }

      // Add product to wishlist
      if (isStaticData) {
        wishlist.products.push({ staticData });
      } else {
        // Verify MongoDB product exists
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        wishlist.products.push({ product: productId });
      }
      
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const productIdToRemove = req.params.productId;

    // Remove product from wishlist (check both MongoDB and static data)
    wishlist.products = wishlist.products.filter((item) => {
      // Check if this is a MongoDB product
      if (item.product) {
        const mongoId = item.product.toString();
        return mongoId !== productIdToRemove;
      }
      // Check if this is static data
      if (item.staticData && item.staticData._id) {
        return item.staticData._id !== productIdToRemove;
      }
      // Keep item if neither matches
      return true;
    });

    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({ message: 'Wishlist cleared', wishlist });
  } catch (error) {
    console.error('Error in clearWishlist:', error);
    res.status(500).json({ message: error.message });
  }
};
