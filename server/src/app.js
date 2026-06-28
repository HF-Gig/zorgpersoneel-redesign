import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Standard request logger
app.use(morgan('dev'));

// CORS configuration - defaults to client URL or allows all in dev
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: clientUrl,
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve API routes
app.use('/api', apiRouter);

// Root route/health check
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Zorgpersoneel API Server',
    status: 'healthy'
  });
});

// Catch-all route handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Centralized error handler
app.use(errorHandler);

export default app;
