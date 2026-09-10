const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { corsOrigin } = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const moviesRoutes = require('./routes/movies');
const wishlistRoutes = require('./routes/wishlist');

const app = express();

const path = require('path');
const fs = require('fs');

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  cors({
    origin: corsOrigin,
    credentials: false,
  })
);
app.use(express.json({ limit: '100kb' }));
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api', moviesRoutes);
app.use('/api', wishlistRoutes);

const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

module.exports = app;
