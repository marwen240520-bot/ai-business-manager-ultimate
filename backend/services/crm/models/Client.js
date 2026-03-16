const mongoose = require('mongoose'); 
 
const ContactSchema = new mongoose.Schema({ 
  firstName: { type: String, required: true }, 
  lastName: { type: String, required: true }, 
  email: { type: String, required: true, lowercase: true }, 
  phone: String, 
  position: String, 
  isPrimary: { type: Boolean, default: false } 
}); 
 
const AddressSchema = new mongoose.Schema({ 
  street: String, 
  city: String, 
  state: String, 
  zipCode: String, 
  country: { type: String, default: 'France' } 
}); 
 
const ClientSchema = new mongoose.Schema({ 
  companyName: { type: String, required: true, index: true }, 
  legalForm: { type: String, enum: ['SARL','SAS','SA','EURL','EI','Association','Autre'] }, 
  siret: { type: String, unique: true, sparse: true }, 
  vatNumber: String, 
  website: String, 
  phone: String, 
  email: String, 
  address: AddressSchema, 
  contacts: [ContactSchema], 
  industry: { type: String, index: true }, 
  size: { type: String, enum: ['1-10','11-50','51-200','201-500','500+'] }, 
  status: { type: String, enum: ['active','inactive','prospect'], default: 'prospect', index: true }, 
  source: { type: String, enum: ['web','referral','ad','direct','other'] }, 
  score: { type: Number, min: 0, max: 100, default: 0 }, 
  tags: [String], 
  customFields: Map, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now, index: true }, 
  updatedAt: { type: Date, default: Date.now } 
}); 
 
module.exports = mongoose.model('Client', ClientSchema); 
