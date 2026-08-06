const { query } = require('../db/index');
const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, username: payload.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function requireProjectMember(req, res, next) {
  const projectId = req.params.id || req.params.projectId;

  try {
    const result = await query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: not a member of this project' });
    }

    req.projectRole = result.rows[0].role;
    next();
  } catch (err) {
    next(err);
  }
}

async function requireProjectAdmin(req, res, next) {
  const projectId = req.params.id || req.params.projectId;

  try {
    const result = await query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admin role required' });
    }

    req.projectRole = 'admin';
    next();
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:taskId doesn't have a project id in the URL, only a task
// id, so this middleware first looks up which project the task belongs to
// and then applies the same membership check as requireProjectMember.
async function requireTaskProjectMember(req, res, next) {
  const { taskId } = req.params;

  try {
    const task = await query('SELECT project_id FROM tasks WHERE id = $1', [taskId]);

    if (task.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const projectId = task.rows[0].project_id;

    const membership = await query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (membership.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: not a member of this project' });
    }

    req.projectId = projectId;
    req.projectRole = membership.rows[0].role;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requireAuth,
  requireProjectMember,
  requireProjectAdmin,
  requireTaskProjectMember,
};