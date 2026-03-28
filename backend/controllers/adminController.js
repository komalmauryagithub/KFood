const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Contact = require('../models/Contact');

// @desc    Admin Dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalFoods,
      totalRevenue,
      recentOrders,
      mostPopularFood
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderItems totalAmount status createdAt user'),
      Order.aggregate([
        { $unwind: '$orderItems' },
        { $group: { _id: '$orderItems.name', count: { $sum: '$orderItems.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ])
    ]);

    res.json({
      totalUsers: totalUsers,
      totalOrders: totalOrders,
      totalFoods: totalFoods,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      mostPopularFood: mostPopularFood[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with order count
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          orderCount: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders populated
// @route   GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all wishlists monitoring
// @route   GET /api/admin/wishlist
exports.getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find()
      .populate('products.product', 'name image price')
      .populate('user', 'name email')
      .lean();

    // Calculate most liked foods
    const likedCount = {};
    wishlists.forEach(w => {
      w.products.forEach(p => {
        const id = p.product?._id || p.staticData?._id;
        const name = p.product?.name || p.staticData?.name;
        likedCount[id] = (likedCount[id] || 0) + 1;
      });
    });

    const mostLiked = Object.entries(likedCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({ id, name: /* fetch name if needed */ count }));

    res.json({ wishlists, mostLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contacts
// @route   GET /api/admin/contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [mostOrdered, dailyOrders] = await Promise.all([
      // Most ordered
      Order.aggregate([
        { $unwind: '$orderItems' },
        { $group: { _id: '$orderItems.name', count: { $sum: '$orderItems.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      // Daily orders last 7 days
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({ mostOrdered, dailyOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

