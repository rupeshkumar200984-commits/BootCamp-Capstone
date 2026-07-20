const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Mentor'], default: 'Student' },
    skills: [{ type: String }],
    bio: { type: String, default: '' },
    // Specialized Mentor Fields
    domain: { type: String, default: '' }, // e.g., UI/UX Design, Data Structures
    availability: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
