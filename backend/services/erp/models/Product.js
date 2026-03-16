const mongoose = require('mongoose'); 
 
const ProductSchema = new mongoose.Schema({ 
  sku: { type: String, required: true, unique: true, index: true }, 
  name: { type: String, required: true, index: true }, 
  description: String, 
  category: { type: String, index: true }, 
  subcategory: String, 
  brand: String, 
  unit: { type: String, enum: ['piece', 'kg', 'liter', 'meter', 'box'], default: 'piece' }, 
  price: { type: Number, required: true, min: 0 }, 
  cost: { type: Number, min: 0 }, 
  taxRate: { type: Number, default: 20 }, 
  stock: { type: Number, default: 0, min: 0 }, 
  minStock: { type: Number, default: 0 }, 
  maxStock: Number, 
  location: String, 
  barcode: String, 
  images: [String], 
  attributes: Map, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Product', ProductSchema); 
