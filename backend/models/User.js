const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed password
  name: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);