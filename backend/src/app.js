'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const prisma = require('./config/prisma');
const apiKeyAuth = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Routes
const memberRoutes     = require('./routes/member');
const membershipRoutes = require('./routes/membership');
const bookRoutes       = require('./routes/book');
const issuanceRoutes   = require('./routes/issuance');
const analyticsRoutes  = require('./routes/analytics');
const collectionRoutes = require('./routes/collection');
const categoryRoutes   = require('./routes/category');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Health check (no auth)
app.get('/health', (req, res) =>
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() })
);

// Protected routes
app.use('/api', apiKeyAuth);
app.use('/api/member',     memberRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/book',       bookRoutes);
app.use('/api/issuance',   issuanceRoutes);
app.use('/api/analytics',  analyticsRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/category',   categoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected via Prisma.');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
};

start();
