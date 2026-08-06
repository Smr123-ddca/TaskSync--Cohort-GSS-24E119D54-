const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const { requireAuth, requireTaskProjectMember } = require('../middleware/auth');

router.put('/:taskId', requireAuth, requireTaskProjectMember, taskController.updateTask);

module.exports = router;