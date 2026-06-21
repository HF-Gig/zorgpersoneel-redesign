import dotenv from 'dotenv';
import app from './app.js';

// Load environmental variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`  Server running in [${NODE_ENV}] mode`);
  console.log(`  Local: http://localhost:${PORT}`);
  console.log(`==========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
