const express = require('express');
const router = express.Router();
const { 
    getProjects, 
    createProject, 
    getUserProjects, 
    deleteProject, 
    applyToProject, 
    updateRequestStatus 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Base project routes
router.route('/')
      .get(getProjects)
      .post(protect, createProject);

// Fetch logged-in user's specific projects
router.route('/user')
      .get(protect, getUserProjects);

// Handle application submission and target deletions
router.route('/:id')
      .delete(protect, deleteProject);

router.route('/:id/apply')
      .post(protect, applyToProject);

// Accept or Decline an applicant request route mapping
router.route('/:projectId/requests/:requestId')
      .put(protect, updateRequestStatus);

module.exports = router;