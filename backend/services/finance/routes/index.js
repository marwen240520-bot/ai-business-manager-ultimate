const express = require('express'); 
const invoiceController = require('../controllers/invoiceController'); 
 
const router = express.Router(); 
 
router.get('/invoices', invoiceController.getInvoices); 
router.get('/invoices/:id', invoiceController.getInvoiceById); 
router.post('/invoices', invoiceController.createInvoice); 
router.put('/invoices/:id', invoiceController.updateInvoice); 
router.put('/invoices/:id/paid', invoiceController.markAsPaid); 
router.delete('/invoices/:id', invoiceController.deleteInvoice); 
router.get('/invoices/:id/pdf', invoiceController.generatePDF); 
 
module.exports = router; 
