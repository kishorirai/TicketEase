const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim:  true,
    index: true 
  },
  password: { 
    type:  String, 
    required: function() {
      // Password is required only if not using Google OAuth
      return !this.googleId;
    }
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  phone: { 
    type: String,
    trim: true,
    default: '' 
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true // Allows multiple null values
  },
  avatar:  { 
    type: String,
    default: '' 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });

// Virtual for full user profile
UserSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    phone: this.phone,
    avatar: this.avatar,
    role: this.role,
    createdAt: this.createdAt
  };
});

// Method to check if user used Google OAuth
UserSchema.methods. isGoogleUser = function() {
  return !!this.googleId;
};

// Method to get safe user object (without password)
UserSchema.methods.toSafeObject = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    phone: this.phone,
    avatar: this.avatar,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt
  };
};

// Pre-save hook to update lastLogin
UserSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);