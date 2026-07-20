const User = require('../models/User');

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

// 2. NEW/UPDATE: Handle profile data modification updates
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
            token: req.headers.authorization.split(' ')[1] // Retain token in payload response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    updateUserProfile
};