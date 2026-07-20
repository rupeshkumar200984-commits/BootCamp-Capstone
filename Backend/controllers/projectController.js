const mongoose = require('mongoose');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// 1. Get all projects for feed
const getProjects = async (req, res) => {
    try {
        const { skill } = req.query;
        let query = {};
        if (skill) {
            query.techStack = { $regex: new RegExp(skill, "i") };
        }
        const projects = await Project.find(query).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Create a new project post
const createProject = async (req, res) => {
    const { title, description, techStack, author, contactEmail, stage } = req.body;
    if (!title || !description || !author || !contactEmail) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }
    try {
        const newProject = await Project.create({
            user: req.user.id,
            title,
            description,
            techStack,
            author,
            contactEmail,
            stage: stage || 'Ideation'
        });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get only the logged-in user's projects
const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Delete a project post
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this post' });
        }

        await project.deleteOne();
        res.status(200).json({ message: 'Project proposal removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Send a collaboration request to a project post
const applyToProject = async (req, res) => {
    const { studentName, studentEmail, message } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.requests.push({ studentName, studentEmail, message });
        await project.save();

        await Notification.create({
            recipient: project.user,
            senderName: studentName,
            message: `applied to collaborate on your project: "${project.title}"`,
            type: 'Application'
        });

        res.status(200).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Accept or Reject an applicant
const updateRequestStatus = async (req, res) => {
    const { projectId, requestId } = req.params;
    const { status } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const request = project.requests.id(requestId);
        if (!request) return res.status(404).json({ message: 'Application request not found' });

        request.status = status;
        await project.save();

        const targetStudent = await mongoose.model('User').findOne({ email: request.studentEmail });
        if (targetStudent) {
            await Notification.create({
                recipient: targetStudent._id,
                senderName: req.user.name,
                message: `marked your collaboration request for "${project.title}" as ${status}`,
                type: 'StatusUpdate'
            });
        }

        res.status(200).json({ message: `Application status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getProjects, 
    createProject, 
    getUserProjects, 
    deleteProject, 
    applyToProject, 
    updateRequestStatus 
};