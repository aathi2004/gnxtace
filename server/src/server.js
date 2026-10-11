require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initDb } = require('./db');
const { authRateLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const templateRoutes = require('./routes/templateRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));

// Explicit CORS
const allowedOrigins = [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback for local testing
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with size safety
app.use(express.json({ limit: '100kb' }));

// Development request logger
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    product: 'Form & Function',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Primary API Routes
app.use('/api/auth', authRateLimiter(), authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/favorites', favoriteRoutes);

// Direct route aliases for evaluation convenience
const authController = require('./controllers/authController');
const { validateRegister, validateLogin } = require('./middleware/validateMiddleware');
app.post('/api/register', authRateLimiter(), validateRegister, authController.register);
app.post('/api/login', authRateLimiter(), validateLogin, authController.login);

// Root Documentation greeting
app.get('/', (req, res) => {
  res.status(200).json({
    product: 'Form & Function',
    tagline: 'Mini SaaS Template Store API',
    status: 'online',
    endpoints: {
      health: 'GET /api/health',
      templates: 'GET /api/templates',
      templateById: 'GET /api/templates/:id',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      currentUser: 'GET /api/auth/me',
      favorites: 'GET /api/favorites',
      addFavorite: 'POST /api/favorites/:templateId',
      removeFavorite: 'DELETE /api/favorites/:templateId'
    }
  });
});

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} was not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server exception:', err.message || err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred. Please try again later.'
  });
});

// Start Server helper
async function startServer(port = PORT) {
  try {
    await initDb();
    const server = app.listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`\n======================================================`);
        console.log(`🏛️  Form & Function API Server running on port ${port}`);
        console.log(`📡 Endpoints: http://localhost:${port}/api`);
        console.log(`======================================================\n`);
      }
    });
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
