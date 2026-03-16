const Notification = require('../models/Notification'); 
const logger = require('../utils/logger'); 
 
exports.getNotifications = async (req, res) =
  try { 
    const userId = req.headers['x-user-id']; 
    const { page = 1, limit = 20, read } = req.query; 
    const skip = (page - 1) * limit; 
    const query = { userId }; 
 
    if (read !== undefined) { 
      query.read = read === 'true'; 
    } 
 
    const notifications = await Notification.find(query) 
      .sort({ createdAt: -1 }) 
      .skip(skip) 
      .limit(parseInt(limit)); 
 
    const total = await Notification.countDocuments(query); 
    const unreadCount = await Notification.countDocuments({ userId, read: false }); 
 
    res.json({ 
      notifications, 
      unreadCount, 
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      } 
    }); 
  } catch (error) { 
    logger.error('Get notifications error:', error); 
    res.status(500).json({ error: 'Failed to fetch notifications' }); 
  } 
}; 
 
exports.markAsRead = async (req, res) =
  try { 
    const userId = req.headers['x-user-id']; 
    const notification = await Notification.findOneAndUpdate( 
      { _id: req.params.id, userId }, 
      { read: true, readAt: new Date() }, 
      { new: true } 
    ); 
 
    if (!notification) { 
      return res.status(404).json({ error: 'Notification not found' }); 
    } 
 
    const unreadCount = await Notification.countDocuments({ userId, read: false }); 
    res.json({ notification, unreadCount }); 
  } catch (error) { 
    logger.error('Mark notification as read error:', error); 
    res.status(500).json({ error: 'Failed to update notification' }); 
  } 
}; 
 
