const { query } = require('../db/index');

async function getTasksForProject(projectId, filters = {}) {
  const conditions = ['project_id = $1'];
  const values = [projectId];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filters.priority) {
    values.push(filters.priority);
    conditions.push(`priority = $${values.length}`);
  }

  if (filters.assignedTo) {
    values.push(filters.assignedTo);
    conditions.push(`assigned_to = $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  const query = `
    SELECT * FROM tasks
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
  `;

  const result = await query(query, values);
  return result.rows;
}

async function createTask({ projectId, title, description, priority, dueDate, assignedTo }) {
  const result = await query(
    `INSERT INTO tasks (project_id, title, description, priority, due_date, assigned_to)
     VALUES ($1, $2, $3, COALESCE($4, 'medium'), $5, $6)
     RETURNING *`,
    [projectId, title, description, priority, dueDate, assignedTo]
  );

  return result.rows[0];
}

async function getTaskById(taskId) {
  const result = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);
  return result.rows[0] || null;
}

async function updateTask(taskId, updates) {
  const fields = [];
  const values = [];

  const fieldMap = {
    status: 'status',
    assignedTo: 'assigned_to',
    priority: 'priority',
    dueDate: 'due_date',
  };

  for (const [key, column] of Object.entries(fieldMap)) {
    if (updates[key] !== undefined) {
      values.push(updates[key]);
      fields.push(`${column} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    return getTaskById(taskId);
  }

  values.push(taskId);
  const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`;
  const result = await query(query, values);
  return result.rows[0];
}

module.exports = { getTasksForProject, createTask, getTaskById, updateTask };