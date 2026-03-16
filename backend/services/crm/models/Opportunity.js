const mongoose = require('mongoose'); 
 
const OpportunitySchema = new mongoose.Schema({ 
  name: { type: String, required: true }, 
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
  amount: { type: Number, min: 0 }, 
  currency: { type: String, default: 'EUR' }, 
  probability: { type: Number, min: 0, max: 100 }, 
  expectedCloseDate: Date, 
  stage: { 
    type: String, 
    enum: ['qualification','needs-analysis','proposal','negotiation','closed-won','closed-lost'], 
    default: 'qualification' 
  }, 
  products: [{ 
    name: String, 
    quantity: Number, 
    unitPrice: Number 
  }], 
  notes: String, 
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Opportunity', OpportunitySchema); 
