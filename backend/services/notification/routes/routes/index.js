const express = require('express'); 
const notificationController = require('../controllers/notificationController'); 
 
const router = express.Router(); 
 
router.get('/notifications', notificationController.getNotifications); 
router.put('/notifications/:id/read', notificationController.markAsRead); 
router.put('/notifications/read-all', notificationController.markAllAsRead); 
router.delete('/notifications/:id', notificationController.deleteNotification); 
 
module.exports = router; 
