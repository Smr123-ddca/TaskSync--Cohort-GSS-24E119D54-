const { query } = require('./index');

const initDatabase = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
    );
    `;

  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        owner_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT now()
    );
    `;

  const createProjectMembersTable = `
    CREATE TABLE IF NOT EXISTS project_members (
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member')),
        PRIMARY KEY (project_id, user_id)
    );
    `;

  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'todo'
            CHECK (status IN ('todo', 'in_progress', 'done')),
        assigned_to INTEGER REFERENCES users(id),
        priority VARCHAR(20) NOT NULL DEFAULT 'medium'
            CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        due_date DATE,
        created_at TIMESTAMPTZ DEFAULT now()
    );
    `;

  const createActivityLogsTable = `
    CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        action_type VARCHAR(30) NOT NULL
            CHECK (action_type IN ('task_created', 'task_moved', 'task_assigned', 'member_invited')),
        description VARCHAR(500) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
    );
    `;


  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_project ON activity_logs(project_id, created_at DESC);
    `;

  try {
    await query(createUsersTable);
    await query(createProjectsTable);
    await query(createProjectMembersTable);
    await query(createTasksTable);
    await query(createActivityLogsTable);
    await query(createIndexes);
    console.log('All tables created successfully');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { initDatabase };