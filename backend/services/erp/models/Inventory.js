const mongoose = require('mongoose'); 
 
const InventorySchema = new mongoose.Schema({ 
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true }, 
  quantity: { type: Number, default: 0, min: 0 }, 
  reserved: { type: Number, default: 0, min: 0 }, 
  available: { type: Number, default: 0 }, 
  reorderPoint: { type: Number, default: 0 }, 
  reorderQuantity: { type: Number, default: 0 }, 
  location: String, 
  lastCounted: Date, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Inventory', InventorySchema); 
