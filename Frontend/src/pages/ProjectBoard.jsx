import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import FilterBar from '../components/FilterBar';
import KanbanColumn from '../components/KanbanColumn';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskModal from '../components/TaskModal';
import ActivityFeed from '../components/ActivityFeed';

const STATUSES = [
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
];

export default function ProjectBoard({ projectId, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Re-fetch tasks whenever the filters change.
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.priority) params.set('priority', filters.priority);
      if (filters.search) params.set('search', filters.search);

      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiRequest(`/projects/${projectId}/tasks${query}`);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  const loadActivity = useCallback(async () => {
    try {
      const data = await apiRequest(`/projects/${projectId}/activity`);
      setActivity(data.activity);
    } catch {
      // Activity is secondary — a failure here shouldn't block the board.
    }
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  function handleTaskCreated(task) {
    setTasks((prev) => [task, ...prev]);
    setShowCreateModal(false);
    loadActivity();
  }

  async function handleStatusChange(taskId, status) {
    try {
      const data = await apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
      loadActivity();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleTaskUpdated(updatedTask) {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(null);
    loadActivity();
  }

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={onBack}>&larr; Back to projects</button>
        <button onClick={() => setShowCreateModal(true)}>+ New task</button>
      </header>

      <FilterBar filters={filters} onChange={setFilters} />

      {error && <p className="error-text">{error}</p>}
      {loading && <p>Loading tasks...</p>}

      <div className="board">
        {STATUSES.map((s) => (
          <KanbanColumn
            key={s.key}
            title={s.label}
            status={s.key}
            tasks={tasks.filter((t) => t.status === s.key)}
            onStatusChange={handleStatusChange}
            onSelectTask={setSelectedTask}
          />
        ))}
      </div>

      <ActivityFeed activity={activity} />

      {showCreateModal && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleTaskCreated}
        />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}