const mongoose = require('mongoose'); 
 
const RefreshTokenSchema = new mongoose.Schema({ 
  token: { type: String, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  expires: { type: Date, required: true }, 
  created: { type: Date, default: Date.now }, 
  revoked: { type: Boolean, default: false }, 
  replacedByToken: String 
}); 
 
module.exports = mongoose.model('RefreshToken', RefreshTokenSchema); 
