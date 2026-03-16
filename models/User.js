const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 
 
const UserSchema = new mongoose.Schema({ 
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true, lowercase: true }, 
  password: { type: String, required: true }, 
  role: { type: String, enum: ['admin', 'manager', 'user', 'guest'], default: 'user' }, 
  permissions: [{ type: String }], 
  company: String, 
  department: String, 
  position: String, 
  phone: String, 
  avatar: String, 
  isActive: { type: Boolean, default: true }, 
  lastLogin: Date, 
  passwordResetToken: String, 
  passwordResetExpires: Date, 
  emailVerificationToken: String, 
  emailVerified: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
UserSchema.pre('save', async function(next) { 
  if (!this.isModified('password')) return next(); 
  this.password = await bcrypt.hash(this.password, 12); 
  next(); 
}); 
 
UserSchema.methods.comparePassword = async function(candidatePassword) { 
  return await bcrypt.compare(candidatePassword, this.password); 
}; 
 
UserSchema.methods.generateAuthToken = function() { 
  const jwt = require('jsonwebtoken'); 
  return jwt.sign( 
    { id: this._id, email: this.email, role: this.role }, 
    { expiresIn: '7d' } 
  ); 
}; 
 
module.exports = mongoose.model('User', UserSchema); 
