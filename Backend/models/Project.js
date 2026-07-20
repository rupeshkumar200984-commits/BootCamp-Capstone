const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    author: { type: String, required: true },
    contactEmail: { type: String, required: true },
    // New: Current Development Stage Indicator
    stage: { type: String, enum: ['Ideation', 'Prototyping', 'Development', 'Testing'], default: 'Ideation' },
    requests: [{
        studentName: String,
        studentEmail: String,
        message: String,
        status: { type: String, default: 'Pending' }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);