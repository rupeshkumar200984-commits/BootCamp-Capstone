const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// ENCRYPTION FIX: Intercept password modifications and apply salt blocks safely
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);