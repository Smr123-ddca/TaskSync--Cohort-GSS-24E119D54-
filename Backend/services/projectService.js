// Business logic for projects: creating them, listing a user's workspaces
// with progress %, fetching a single project, and inviting members.

const { query, pool } = require('../db/index');

// POST /api/projects — wrapped in a transaction so a project is never
// created without its owner also being added as an admin member.
async function createProject({ name, description, ownerId }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const projectResult = await client.query(
      `INSERT INTO projects (name, description, owner_id)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, owner_id, created_at`,
      [name, description, ownerId]
    );
    const project = projectResult.rows[0];

    await client.query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES ($1, $2, 'admin')`,
      [project.id, ownerId]
    );

    await client.query('COMMIT');
    return project;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// GET /api/projects — every project the user is a member of, plus a
// completion percentage computed in SQL (done tasks / total tasks).
async function getProjectsForUser(userId) {
  const result = await query(
    `SELECT
       p.id,
       p.name,
       p.description,
       p.owner_id,
       p.created_at,
       pm.role,
       COUNT(t.id) AS total_tasks,
       COUNT(t.id) FILTER (WHERE t.status = 'done') AS done_tasks,
       CASE
         WHEN COUNT(t.id) = 0 THEN 0
         ELSE ROUND(
           100.0 * COUNT(t.id) FILTER (WHERE t.status = 'done') / COUNT(t.id)
         )
       END AS progress_percent
     FROM projects p
     JOIN project_members pm ON pm.project_id = p.id
     LEFT JOIN tasks t ON t.project_id = p.id
     WHERE pm.user_id = $1
     GROUP BY p.id, pm.role
     ORDER BY p.created_at DESC`,
    [userId]
  );

  return result.rows;
}

async function getProjectById(projectId) {
  const result = await query('SELECT * FROM projects WHERE id = $1', [projectId]);
  return result.rows[0] || null;
}

// POST /api/projects/:id/invite — add an existing user to a project.
async function inviteMember({ projectId, invitedUserId, role = 'member' }) {
  const result = await query(
    `INSERT INTO project_members (project_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (project_id, user_id) DO NOTHING
     RETURNING project_id, user_id, role`,
    [projectId, invitedUserId, role]
  );

  return result.rows[0] || null; // null means the user was already a member
}

async function findUserByEmail(email) {
  const result = await query('SELECT id, username, email FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

module.exports = {
  createProject,
  getProjectsForUser,
  getProjectById,
  inviteMember,
  findUserByEmail,
};