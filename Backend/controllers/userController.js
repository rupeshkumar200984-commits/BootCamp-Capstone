const User = require('../models/User');
const Notification = require('../models/Notification');
const Message = require('../models/Message');

// 1. Get users with optional role filtering (e.g., fetching Mentors)
const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) {
            query.role = role;
        }
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get notifications for the current user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Mark all notifications as read
const clearNotifications = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
        const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Get direct messages between authenticated user and a conversation partner
const getMessages = async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const authId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: authId, recipient: otherUserId },
                { sender: otherUserId, recipient: authId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Send a new direct message and persist it to the database
const sendMessage = async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        if (!recipientId || !text) {
            return res.status(400).json({ message: 'Recipient and text are required.' });
        }

        const message = await Message.create({
            sender: req.user.id,
            recipient: recipientId,
            text
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. NEW/UPDATE: Handle profile data modification updates
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User matrix profile not found.' });
        }

        // Apply updated values or fall back to existing database contents
        user.name = req.body.name || user.name;
        user.role = req.body.role || user.role;
        user.domain = req.body.domain || user.domain;
        user.bio = req.body.bio || user.bio;
        user.skills = req.body.skills || user.skills;

        const updatedUser = await user.save();

        // Return updated session keys excluding hashed passwords
        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            domain: updatedUser.domain,
            bio: updatedUser.bio,
            skills: updatedUser.skills,
            token: req.headers.authorization.split(' ')[1]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getNotifications,
    clearNotifications,
    getMessages,
    sendMessage,
    updateUserProfile
};