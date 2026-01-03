require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authroute');
const eventRoutes = require('./routes/eventroute');
const bookingRoutes = require('./routes/bookingroute');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',  // Vite default
  'http://localhost:3000',  // React default
  'http://localhost:4000',  // Server itself
  'http://127.0.0.1:5173',  // Alternative localhost
  'http://127.0.0.1:3000',  // Alternative localhost
  process.env.FRONTEND_URL  // Production frontend URL
]. filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('⚠️  CORS blocked origin:', origin);
      callback(null, true); // Allow in development, change to false in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

// ============================================
// Security Headers Middleware
// ============================================
app.use((req, res, next) => {
  // Allow Google OAuth popups and redirects
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  next();
});

// ============================================
// Body Parser Middleware
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Request Logging Middleware (Development)
// ============================================
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// Health Check Route (before other routes)
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env. NODE_ENV || 'development',
    database: mongoose.connection. readyState === 1 ?  'connected' : 'disconnected'
  });
});

// ============================================
// Configuration Test Route (Development only)
// ============================================
if (process.env.NODE_ENV === 'development') {
  app.get('/api/config-check', (req, res) => {
    res.json({
      googleClientId: process.env. GOOGLE_CLIENT_ID ?  '✅ Configured' :  '❌ Missing',
      jwtSecret: process.env. JWT_SECRET ? '✅ Configured' : '❌ Missing',
      mongodbUri:  process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing',
      nodeEnv: process.env.NODE_ENV || 'not set',
      port: process. env.PORT || 4000,
      allowedOrigins: allowedOrigins,
    });
  });
}

// ============================================
// Mount API Routes
// ============================================
app. use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/config-check',
      'POST /api/auth/login',
      'POST /api/auth/signup',
      'POST /api/auth/google',
      'GET /api/auth/me',
      'GET /api/auth/test-config',
      'GET /api/events',
      'POST /api/bookings'
    ]
  });
});

// ============================================
// Global Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// Server Configuration
// ============================================
const PORT = process. env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables: ');
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Create a .env file with these variables');
  process.exit(1);
}

// MongoDB Connection

mongoose
  .connect(MONGODB_URI, { 
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    // Sync Database Indexes (Fix duplicate index warning)
    
    try {
      
      const User = require('./models/User');
      
      // Drop all indexes and recreate them
      await User. collection.dropIndexes();
      
      // Sync indexes from schema
      await User.syncIndexes();
      
      
      // List current indexes
      const indexes = await User.collection.indexes();
      console.log('   📋 Current indexes: ');
      indexes.forEach(idx => {
        console.log(`      - ${JSON.stringify(idx. key)}`);
      });
      
      console.log('✅ Index sync complete\n');
    } catch (indexError) {
      console.warn('⚠️  Index sync warning:', indexError.message);
      console.warn('   Continuing anyway...\n');
    }
    
    // ============================================
    // Start Express Server
    // ============================================
    app.listen(PORT, () => {
      console.log(`🎉 Server is running! `);
      console.log(`   🌐 Local:            http://localhost:${PORT}`);
      console.log(`   🏥 Health Check:     http://localhost:${PORT}/api/health`);
      console.log(`   🔧 Config Check:     http://localhost:${PORT}/api/config-check`);
      console.log(`   📚 API Endpoints:    http://localhost:${PORT}/api/`);
      console.log(`\n✨ Ready to accept requests!\n`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB');
    console.error('   Error:', err. message);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Make sure MongoDB is running: ');
      console.error('   - Local: mongod');
      console.error('   - Docker: docker start mongodb');
      console.error('   - MongoDB Atlas: Check your connection string\n');
    }
    
    process.exit(1);
  });

// ============================================
// Graceful Shutdown
// ============================================
const gracefulShutdown = (signal) => {
  console.log(`\n⚠️  ${signal} received, closing server gracefully... `);
  
  // Stop accepting new connections
  mongoose.connection. close(false, () => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ============================================
// Unhandled Rejection Handler
// ============================================
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('   Reason:', reason);
  // Don't exit in production, just log
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// ============================================
// Uncaught Exception Handler
// ============================================
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('   Stack:', error.stack);
  // Exit on uncaught exceptions
  process.exit(1);
});

module.exports = app; // For testing