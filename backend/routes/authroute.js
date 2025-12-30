const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);


// POST /api/auth/signup (Regular Email/Password)

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg, errors: errors.array() });
    }

    const { email, password, name, phone } = req.body;
    
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ 
        email, 
        password: hashed, 
        name:  name || email. split('@')[0], 
        phone:  phone || '' 
      });
      
      const token = jwt. sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      
      res.status(201).json({ 
        token, 
        user: { 
          id: user._id, 
          email: user. email, 
          name: user.name,
          phone: user.phone,
          avatar: user.avatar
        } 
      });
    } catch (err) {
      console.error('❌ Signup error:', err);
      res.status(500).json({ error: 'Server error during signup' });
    }
  }
);

// ============================================
// POST /api/auth/login (Regular Email/Password)
// ============================================
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg, errors: errors.array() });
    }

    const { email, password } = req. body;
    
    try {
      const user = await User. findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!user.password) {
        return res.status(401).json({ error: 'Please sign in with Google' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn:  JWT_EXPIRES_IN });
      
      res.json({ 
        token, 
        user: { 
          id: user._id, 
          email: user.email, 
          name: user.name,
          phone: user.phone,
          avatar: user.avatar
        } 
      });
    } catch (err) {
      console.error('❌ Login error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

// ============================================
// POST /api/auth/google (Google OAuth) - FIXED! 
// ============================================
router. post('/google', async (req, res) => {
  console.log('\n📩 ========== Google Auth Request ==========');
  console.log('📍 Endpoint:  POST /api/auth/google');
  console.log('🔑 Credential present:', !!req.body.credential);
  
  try {
    const { credential } = req.body;

    // Validation
    if (!credential) {
      console.error('❌ No credential provided');
      return res.status(400).json({ error: 'Google credential is required' });
    }

    if (!GOOGLE_CLIENT_ID) {
      console.error('❌ GOOGLE_CLIENT_ID not configured');
      return res.status(500).json({ 
        error: 'Google authentication is not configured on server'
      });
    }

    console.log('🔍 Verifying token with Google...');

    // Verify Google token
    let ticket;
    let payload;
    
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience:  GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
      console.log('✅ Token verified successfully');
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError. message);
      return res.status(401).json({ 
        error: 'Invalid Google token', 
        message: verifyError.message
      });
    }

    const { email, name, sub: googleId, picture } = payload;

    console.log('📦 User data from Google: ');
    console.log('   Email:', email);
    console.log('   Name:', name);

    if (!email) {
      console.error('❌ No email in payload');
      return res.status(400).json({ error: 'Email not provided by Google' });
    }

    // Find or create user
    console.log('🔍 Looking up user in database...');
    let user = await User.findOne({ email });

    if (!user) {
      console.log('🆕 Creating new user...');
      user = await User.create({
        email,
        name:  name || email.split('@')[0],
        googleId,
        avatar: picture,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
      console.log('✅ User created:', user._id);
    } else {
      console.log('✅ User found:', user._id);
      
      // Link Google account if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        await user.save();
        console.log('🔗 Google account linked');
      }
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    console.log('✅ Sending success response');
    console.log('==========================================\n');
    
    return res.status(200).json({
      token,
      user:  {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
    
  } catch (error) {
    console.error('\n❌ ========== ERROR ==========');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('==============================\n');
    
    return res.status(500).json({ 
      error: 'Google authentication failed', 
      message: error.message
    });
  }
});

// ============================================
// GET /api/auth/me (Get current user)
// ============================================
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User. findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user. email,
        name: user. name,
        phone: user. phone,
        avatar: user. avatar,
      },
    });
  } catch (err) {
    console.error('❌ Auth verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============================================
// GET /api/auth/test-config (Debug endpoint)
// ============================================
router.get('/test-config', (req, res) => {
  res.json({
    googleClientIdConfigured: !!GOOGLE_CLIENT_ID,
    googleClientIdPrefix: GOOGLE_CLIENT_ID ?  GOOGLE_CLIENT_ID.substring(0, 30) + '...' : 'NOT SET',
    jwtSecretConfigured: !!JWT_SECRET,
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;