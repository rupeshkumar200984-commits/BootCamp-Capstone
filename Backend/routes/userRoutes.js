const express = require('express');
const router = express.Router();
const { getUsers, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Base mapping to grab users
router.get('/', getUsers);

// Route endpoint configuration for handling dynamic profile modifications
router.put('/profile', protect, updateUserProfile);

module.exports = router;