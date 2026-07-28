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
const normalizeOrigin = (value) => (value || '').replace(/\/$/, '');

// CORS must run before rate limiting/routes so browser preflight gets headers.
const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  ...envOrigins,
]);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(
      normalizedOrigin
    );

    if (allowedOrigins.has(normalizedOrigin) || isLocalDev) {
      callback(null, true);
      return;
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
