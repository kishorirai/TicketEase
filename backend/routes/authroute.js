const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process. env.GOOGLE_CLIENT_ID;

console.log('🔑 Google Client ID configured:', GOOGLE_CLIENT_ID ?  'Yes ✓' : 'No ✗');

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
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Server error during signup' });
    }
  }
);

// POST /api/auth/login (Regular Email/Password)
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors. array()[0].msg, errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email });
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
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

// POST /api/auth/google (Google OAuth)
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    console.log('📩 Google auth request received');
    console.log('🔑 Credential present:', !!credential);

    if (!credential) {
      console.error('❌ No credential provided');
      return res.status(400).json({ error: 'Google credential is required' });
    }

    if (! GOOGLE_CLIENT_ID) {
      console.error('❌ GOOGLE_CLIENT_ID not configured in environment');
      return res.status(500).json({ error: 'Google authentication is not configured on server' });
    }

    console.log('🔍 Verifying Google token...');
    console.log('🔑 Using Client ID:', GOOGLE_CLIENT_ID. substring(0, 20) + '...');

    // Verify Google token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken:  credential,
        audience: GOOGLE_CLIENT_ID,
      });
      console.log('✅ Google token verified successfully');
    } catch (verifyError) {
      console.error('❌ Google token verification failed:', verifyError. message);
      return res.status(401).json({ 
        error: 'Invalid Google token', 
        details: verifyError.message 
      });
    }

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    console.log('📦 Google user data:', { email, name, googleId:  googleId.substring(0, 10) + '...' });

    if (!email) {
      console.error('❌ No email in Google payload');
      return res.status(400).json({ error: 'Email not provided by Google' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      console.log('🆕 Creating new user with Google account');
      user = await User. create({
        email,
        name:  name || email.split('@')[0],
        googleId,
        avatar: picture,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
      console.log('✅ New user created:', user._id);
    } else {
      console.log('✅ Existing user found:', user._id);
      if (! user.googleId) {
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        await user.save();
        console.log('🔗 Google account linked to existing user');
      }
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    console.log('✅ Authentication successful, sending response');
    res.json({
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
    console.error('❌ Google auth error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Google authentication failed', 
      message: error.message 
    });
  }
});

// GET /api/auth/me (Get current user)
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
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;