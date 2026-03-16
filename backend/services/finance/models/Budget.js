const mongoose = require('mongoose'); 
 
const BudgetSchema = new mongoose.Schema({ 
  name: { type: String, required: true }, 
  year: { type: Number, required: true }, 
  period: { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' }, 
  category: { type: String, required: true }, 
  planned: { type: Number, required: true }, 
  actual: { type: Number, default: 0 }, 
  variance: { type: Number, default: 0 }, 
  notes: String, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Budget', BudgetSchema); 
