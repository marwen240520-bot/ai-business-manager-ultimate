const mongoose = require('mongoose'); 
 
const TransactionSchema = new mongoose.Schema({ 
  transactionId: { type: String, required: true, unique: true }, 
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true }, 
  category: { type: String, required: true }, 
  amount: { type: Number, required: true }, 
  currency: { type: String, default: 'EUR' }, 
  description: String, 
  date: { type: Date, default: Date.now }, 
  paymentMethod: String, 
  reference: String, 
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }, 
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, 
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, 
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Transaction', TransactionSchema); 
