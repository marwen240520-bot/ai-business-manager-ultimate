const Invoice = require('../models/Invoice'); 
const Transaction = require('../models/Transaction'); 
const logger = require('../utils/logger'); 
const PDFDocument = require('pdfkit'); 
 
exports.getInvoices = async (req, res) =
  try { 
    const { page = 1, limit = 20, status, clientId } = req.query; 
    const skip = (page - 1) * limit; 
    const query = {}; 
 
    if (status) query.status = status; 
    if (clientId) query.clientId = clientId; 
 
    const invoices = await Invoice.find(query) 
      .skip(skip) 
      .limit(parseInt(limit)) 
      .sort({ issueDate: -1 }); 
 
    const total = await Invoice.countDocuments(query); 
 
    res.json({ 
      invoices, 
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      } 
    }); 
  } catch (error) { 
    logger.error('Get invoices error:', error); 
    res.status(500).json({ error: 'Failed to fetch invoices' }); 
  } 
}; 
 
exports.getInvoiceById = async (req, res) =
  try { 
    const invoice = await Invoice.findById(req.params.id); 
    if (!invoice) { 
      return res.status(404).json({ error: 'Invoice not found' }); 
    } 
    res.json(invoice); 
  } catch (error) { 
    logger.error('Get invoice by id error:', error); 
    res.status(500).json({ error: 'Failed to fetch invoice' }); 
  } 
}; 
 
exports.createInvoice = async (req, res) =
  try { 
    const year = new Date().getFullYear(); 
    const count = await Invoice.countDocuments() + 1; 
    const invoiceNumber = `INV-${year}-${String(count).padStart(6, '0')}`; 
 
    const invoice = new Invoice({ 
      ...req.body, 
      invoiceNumber, 
      createdBy: req.headers['x-user-id'] 
    }); 
    await invoice.save(); 
 
    logger.info(`Invoice created: ${invoiceNumber}`); 
    res.status(201).json(invoice); 
  } catch (error) { 
    logger.error('Create invoice error:', error); 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
exports.updateInvoice = async (req, res) =
  try { 
    const invoice = await Invoice.findByIdAndUpdate( 
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true, runValidators: true } 
    ); 
    if (!invoice) { 
      return res.status(404).json({ error: 'Invoice not found' }); 
    } 
    res.json(invoice); 
  } catch (error) { 
    logger.error('Update invoice error:', error); 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
