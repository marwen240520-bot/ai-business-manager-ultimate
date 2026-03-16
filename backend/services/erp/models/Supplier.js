const mongoose = require('mongoose'); 
 
const SupplierSchema = new mongoose.Schema({ 
  name: { type: String, required: true, index: true }, 
  contactPerson: String, 
  email: String, 
  phone: String, 
  address: String, 
  website: String, 
  paymentTerms: String, 
  deliveryDelay: Number, 
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
  rating: { type: Number, min: 0, max: 5 }, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }, 
  notes: String, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Supplier', SupplierSchema); 
