const express = require('express');
const router = express.Router();
const { getUsers, getNotifications, clearNotifications, getMessages, sendMessage, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Base mapping to grab users
router.get('/', getUsers);

// Notification management endpoints
router.get('/notifications', protect, getNotifications);
router.put('/notifications', protect, clearNotifications);

// Real-time chat storage endpoints
router.get('/messages/:userId', protect, getMessages);
router.post('/messages', protect, sendMessage);

// Route endpoint configuration for handling dynamic profile modifications
router.put('/profile', protect, updateUserProfile);

module.exports = router;