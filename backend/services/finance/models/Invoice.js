const mongoose = require('mongoose'); 
 
const InvoiceItemSchema = new mongoose.Schema({ 
  description: { type: String, required: true }, 
  quantity: { type: Number, required: true, min: 1 }, 
  unitPrice: { type: Number, required: true, min: 0 }, 
  taxRate: { type: Number, default: 20 }, 
  amount: { type: Number, required: true } 
}); 
 
const InvoiceSchema = new mongoose.Schema({ 
  invoiceNumber: { type: String, required: true, unique: true }, 
  type: { type: String, enum: ['invoice', 'credit_note', 'debit_note'], default: 'invoice' }, 
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], 
    default: 'draft' 
  }, 
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
  clientName: String, 
  clientAddress: String, 
  clientVat: String, 
  items: [InvoiceItemSchema], 
  subtotal: { type: Number, required: true }, 
  taxTotal: { type: Number, required: true }, 
  discount: { type: Number, default: 0 }, 
  total: { type: Number, required: true }, 
  currency: { type: String, default: 'EUR' }, 
  issueDate: { type: Date, default: Date.now }, 
  dueDate: { type: Date, required: true }, 
  paidDate: Date, 
  paymentMethod: String, 
  paymentReference: String, 
  notes: String, 
  terms: String, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Invoice', InvoiceSchema); 
