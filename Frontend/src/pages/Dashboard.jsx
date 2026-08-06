import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/CreateProjectModal';

export default function Dashboard({ onOpenProject }) {
  const { user, setUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/projects');
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await apiRequest('/auth/logout', { method: 'POST' });
    setUser(null);
  }

  function handleProjectCreated(project) {
    setProjects((prev) => [
      { ...project, progress_percent: 0, total_tasks: 0, done_tasks: 0 },
      ...prev,
    ]);
    setShowCreateModal(false);
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>TaskSync</h1>
        <div className="header-actions">
          <span>Hi, {user.username}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <div className="page-toolbar">
        <h2>Your projects</h2>
        <button onClick={() => setShowCreateModal(true)}>+ New project</button>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && projects.length === 0 && <p>No projects yet. Create your first one.</p>}

      <div className="project-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => onOpenProject(project.id)}
          >
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${project.progress_percent}%` }}
              />
            </div>
            <span className="progress-label">
              {project.progress_percent}% complete ({project.done_tasks}/{project.total_tasks} tasks)
            </span>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}