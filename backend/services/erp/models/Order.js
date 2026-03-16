const mongoose = require('mongoose'); 
 
const OrderItemSchema = new mongoose.Schema({ 
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
  quantity: { type: Number, required: true, min: 1 }, 
  unitPrice: { type: Number, required: true, min: 0 }, 
  discount: { type: Number, default: 0, min: 0, max: 100 }, 
  total: { type: Number, required: true } 
}); 
 
const OrderSchema = new mongoose.Schema({ 
  orderNumber: { type: String, required: true, unique: true }, 
  type: { type: String, enum: ['purchase', 'sale', 'return', 'transfer'], required: true }, 
  status: { 
    type: String, 
    enum: ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'draft' 
  }, 
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, 
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, 
  items: [OrderItemSchema], 
  subtotal: { type: Number, required: true }, 
  tax: { type: Number, required: true }, 
  shipping: { type: Number, default: 0 }, 
  total: { type: Number, required: true }, 
  notes: String, 
  orderDate: { type: Date, default: Date.now }, 
  expectedDate: Date, 
  deliveredDate: Date, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Order', OrderSchema); 
