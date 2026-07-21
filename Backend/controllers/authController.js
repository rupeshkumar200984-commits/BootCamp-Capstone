const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password, role, skills, domain, bio } = req.body;
    try {
        const normalizedEmail = email ? email.trim().toLowerCase() : '';

        // Case-insensitive check so Punit@gmail.com matches punit@gmail.com
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const normalizedSkills = Array.isArray(skills)
            ? skills.map(s => s.trim()).filter(Boolean)
            : typeof skills === 'string'
                ? skills.split(',').map(s => s.trim()).filter(Boolean)
                : [];

        // Pass plain password directly so User.js pre-save hook handles hashing ONCE
        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: role || 'Student',
            skills: normalizedSkills,
            domain: domain || '',
            bio: bio || ''
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey123', { expiresIn: '30d' });
        
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                skills: user.skills,
                domain: user.domain,
                bio: user.bio
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const normalizedEmail = email ? email.trim().toLowerCase() : '';

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey123', { expiresIn: '30d' });
        
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                skills: user.skills,
                domain: user.domain,
                bio: user.bio
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };