const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController.js');
const taskController = require('../controllers/taskController.js');
const activityController = require('../controllers/activityController.js');
const {
  requireAuth,
  requireProjectMember,
  requireProjectAdmin,
} = require('../middleware/auth.js');

// Every route below requires a logged-in user.
router.use(requireAuth);

router.post('/', projectController.createProject);
router.get('/', projectController.listProjects);

router.get('/:id', requireProjectMember, projectController.getProject);
router.post('/:id/invite', requireProjectAdmin, projectController.inviteMember);

router.get('/:id/tasks', requireProjectMember, taskController.listTasks);
router.post('/:id/tasks', requireProjectMember, taskController.createTask);

router.get('/:id/activity', requireProjectMember, activityController.getActivity);

module.exports = router;