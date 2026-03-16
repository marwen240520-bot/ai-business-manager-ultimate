const mongoose = require('mongoose'); 
 
const LeadSchema = new mongoose.Schema({ 
  firstName: { type: String, required: true }, 
  lastName: { type: String, required: true }, 
  email: { type: String, required: true, lowercase: true, index: true }, 
  phone: String, 
  company: String, 
  position: String, 
  source: String, 
  status: { 
    type: String, 
    enum: ['new','contacted','qualified','proposal','negotiation','won','lost'], 
    default: 'new', 
    index: true 
  }, 
  score: { type: Number, min: 0, max: 100 }, 
  notes: String, 
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  convertedToClient: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Lead', LeadSchema); 
