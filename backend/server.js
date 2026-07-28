// const app = require('./app');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// // ✅ Load env first
// dotenv.config();

// // ✅ Connect DB
// connectDB();

// // ✅ IMPORTANT: JSON middleware (agar app.js me nahi hai to yaha laga)
// app.use(require('express').json());

// const PORT = process.env.PORT || 5000;

// // ✅ Start server
// const server = app.listen(PORT, () => {
//   console.log(
//     `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
//   );
// });

// // ✅ Handle unhandled promise rejection
// process.on('unhandledRejection', (err) => {
//   console.error(`❌ Error: ${err.message}`);

//   server.close(() => {
//     process.exit(1);
//   });
// });

// // ✅ Handle uncaught exceptions (VERY IMPORTANT)
// process.on('uncaughtException', (err) => {
//   console.error(`💥 Uncaught Exception: ${err.message}`);
//   process.exit(1);
// });






const dotenv = require('dotenv');

// Environment variables sabse pehle load karo
dotenv.config();

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, HOST, () => {
      console.log(
        `🚀 Server running in ${
          process.env.NODE_ENV || 'development'
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error.message);
  console.error(error.stack);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Closing server...');

  if (server) {
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});