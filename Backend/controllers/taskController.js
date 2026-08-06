const taskService = require('../services/taskService');
const activityService = require('../services/activityService');

async function listTasks(req, res, next) {
  try {
    const { status, priority, assignedTo, search } = req.query;

    const tasks = await taskService.getTasksForProject(req.params.id, {
      status,
      priority,
      assignedTo,
      search,
    });

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const task = await taskService.createTask({
      projectId: req.params.id,
      title,
      description,
      priority,
      dueDate,
      assignedTo,
    });

    await activityService.logActivity({
      projectId: req.params.id,
      userId: req.user.id,
      actionType: 'task_created',
      description: `${req.user.username} created "${task.title}"`,
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:taskId — updates status, assignee, priority, and/or due
// date. Logs an activity row only when status or assignee actually changed.
async function updateTask(req, res, next) {
  try {
    const { taskId } = req.params;
    const { status, assignedTo, priority, dueDate } = req.body;

    const existingTask = await taskService.getTaskById(taskId);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await taskService.updateTask(taskId, {
      status,
      assignedTo,
      priority,
      dueDate,
    });

    const statusChanged = status !== undefined && status !== existingTask.status;
    const assigneeChanged = assignedTo !== undefined && assignedTo !== existingTask.assigned_to;

    if (statusChanged) {
      await activityService.logActivity({
        projectId: req.projectId,
        userId: req.user.id,
        actionType: 'task_moved',
        description: `${req.user.username} moved "${updatedTask.title}" to ${status}`,
      });
    }

    if (assigneeChanged) {
      await activityService.logActivity({
        projectId: req.projectId,
        userId: req.user.id,
        actionType: 'task_assigned',
        description: `${req.user.username} reassigned "${updatedTask.title}"`,
      });
    }

    res.json({ task: updatedTask });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTasks, createTask, updateTask };