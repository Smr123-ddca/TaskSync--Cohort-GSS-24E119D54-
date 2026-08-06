// Business logic for the activity feed (audit trail).

const { query } = require('../db/index');

async function logActivity({ projectId, userId, actionType, description }) {
  await query(
    `INSERT INTO activity_logs (project_id, user_id, action_type, description)
     VALUES ($1, $2, $3, $4)`,
    [projectId, userId, actionType, description]
  );
}

// GET /api/projects/:id/activity — newest first, capped at 20 rows.
async function getRecentActivity(projectId) {
  const result = await query(
    `SELECT al.id, al.action_type, al.description, al.created_at, u.username
     FROM activity_logs al
     JOIN users u ON u.id = al.user_id
     WHERE al.project_id = $1
     ORDER BY al.created_at DESC
     LIMIT 20`,
    [projectId]
  );

  return result.rows;
}

module.exports = { logActivity, getRecentActivity };