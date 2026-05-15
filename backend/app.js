const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorMiddleware = require('./middleware/errorMiddleware');

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Trust proxy (important for Render/Railway/Vercel)
app.set('trust proxy', 1);

// ✅ Security middleware
app.use(helmet());

// ✅ Logger
app.use(morgan('dev'));

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max requests per IP
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

app.use(limiter);

// ✅ Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman/mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// ✅ Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KFOOD API is running 🚀'
  });
});

// ✅ API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/drama-foods', require('./routes/dramaRoutes'));
app.use('/api/idols', require('./routes/idolRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ✅ 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ✅ Global error handler
app.use(errorMiddleware);

module.exports = app;