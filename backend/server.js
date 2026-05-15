const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// ✅ Load env first
dotenv.config();

// ✅ Connect DB
connectDB();

// ✅ IMPORTANT: JSON middleware (agar app.js me nahi hai to yaha laga)
app.use(require('express').json());

const PORT = process.env.PORT || 5000;

// ✅ Start server
const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

// ✅ Handle unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.error(`❌ Error: ${err.message}`);

  server.close(() => {
    process.exit(1);
  });
});

// ✅ Handle uncaught exceptions (VERY IMPORTANT)
process.on('uncaughtException', (err) => {
  console.error(`💥 Uncaught Exception: ${err.message}`);
  process.exit(1);
});