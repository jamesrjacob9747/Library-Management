'use strict';

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name || 'Error'}: ${err.message || err}`);

  // ─────────────────────────────────────────────────────────────
  // Prisma known request errors
  // ─────────────────────────────────────────────────────────────

  if (err.code) {
    switch (err.code) {
      // Unique constraint violation
      case 'P2002':
        return res.status(409).json({
          success: false,
          error: 'Duplicate Entry',
          message: `A record with the same ${
            Array.isArray(err.meta?.target)
              ? err.meta.target.join(', ')
              : err.meta?.target || 'value'
          } already exists.`,
        });

      // Foreign key constraint violation
      case 'P2003':
        return res.status(400).json({
          success: false,
          error: 'Invalid Reference',
          message:
            'A referenced member, book, category, or collection does not exist.',
        });

      // Record not found
      case 'P2025':
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'The requested record was not found.',
        });

      // Required relation violation
      case 'P2014':
        return res.status(400).json({
          success: false,
          error: 'Invalid Relation',
          message:
            'The operation violates a required relationship between records.',
        });

      // Other Prisma known errors
      default:
        if (String(err.code).startsWith('P')) {
          return res.status(400).json({
            success: false,
            error: 'Database Error',
            message: 'A database operation could not be completed.',
          });
        }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Prisma validation errors
  // ─────────────────────────────────────────────────────────────

  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid data or query parameters were provided.',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Prisma initialization / database connection errors
  // ─────────────────────────────────────────────────────────────

  if (err.name === 'PrismaClientInitializationError') {
    return res.status(503).json({
      success: false,
      error: 'Database Connection Error',
      message: 'Unable to connect to the database.',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Prisma engine panic
  // ─────────────────────────────────────────────────────────────

  if (err.name === 'PrismaClientRustPanicError') {
    console.error('[PRISMA PANIC]', err);

    return res.status(500).json({
      success: false,
      error: 'Database Engine Error',
      message: 'A database engine error occurred.',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Generic fallback
  // ─────────────────────────────────────────────────────────────

  return res.status(err.status || err.statusCode || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
};

// ─────────────────────────────────────────────────────────────────
// 404 handler
// ─────────────────────────────────────────────────────────────────

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};