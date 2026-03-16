const winston = require('winston'); 
 
const logger = winston.createLogger({ 
  level: 'info', 
  format: winston.format.combine( 
    winston.format.timestamp(), 
    winston.format.json() 
  ), 
  transports: [ 
    new winston.transports.File({ filename: '../../../logs/erp-error.log', level: 'error' }), 
    new winston.transports.File({ filename: '../../../logs/erp-combined.log' }), 
    new winston.transports.Console({ format: winston.format.simple() }) 
  ] 
}); 
 
module.exports = logger; 
