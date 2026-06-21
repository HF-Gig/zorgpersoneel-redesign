/**
 * Centralized error handler middleware.
 * Returns consistent JSON response for all error occurrences.
 */
export const errorHandler = (err, req, res, next) => {
  // If the status code hasn't been set, default to 500 Internal Server Error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    error: {
      message: err.message || 'An unexpected error occurred',
      status: statusCode,
      // Hide stack trace in production environment
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    }
  });
};
