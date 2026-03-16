const nodemailer = require('nodemailer'); 
const logger = require('../utils/logger'); 
 
const transporter = nodemailer.createTransport({ 
  secure: false, 
  auth: { 
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  } 
}); 
 
exports.sendEmail = async (to, subject, html, attachments = []) =
  try { 
    const info = await transporter.sendMail({ 
      to, 
      subject, 
      html, 
      attachments 
    }); 
    logger.info(`Email sent: ${info.messageId}`); 
    return info; 
  } catch (error) { 
    logger.error('Email send error:', error); 
    throw error; 
  } 
}; 
 
