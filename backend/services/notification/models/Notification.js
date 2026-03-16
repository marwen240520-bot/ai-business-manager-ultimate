const mongoose = require('mongoose'); 
 
const NotificationSchema = new mongoose.Schema({ 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  type: { 
    type: String, 
    enum: ['info', 'success', 'warning', 'error'], 
    default: 'info' 
  }, 
  title: { type: String, required: true }, 
  message: { type: String, required: true }, 
  data: Object, 
  read: { type: Boolean, default: false }, 
  readAt: Date, 
  actionUrl: String, 
  expiresAt: Date, 
  createdAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Notification', NotificationSchema); 
