import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import TaskItem from "./TaskItem";

// GET /api/projects/:id
// POST /api/projects/:id/invite
// GET /api/projects/:id/tasks
// POST /api/projects/:id/tasks
// GET /api/projects/:id/activity
function ProjectDetail({ projectId, backToProjects }) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activity, setActivity] = useState([]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  async function loadProject() {
    const data = await apiRequest(`/projects/${projectId}`);
    setProject(data.project);
  }

  async function loadTasks() {
    const data = await apiRequest(`/projects/${projectId}/tasks`);
    setTasks(data.tasks);
  }

  async function loadActivity() {
    const data = await apiRequest(`/projects/${projectId}/activity`);
    setActivity(data.activity);
  }

  useEffect(() => {
    loadProject();
    loadTasks();
    loadActivity();
  }, [projectId]);

  async function handleInvite(e) {
    e.preventDefault();
    await apiRequest(`/projects/${projectId}/invite`, "POST", { email: inviteEmail });
    setInviteEmail("");
    alert("Member invited!");
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    await apiRequest(`/projects/${projectId}/tasks`, "POST", { title: taskTitle });
    setTaskTitle("");
    loadTasks();
    loadActivity();
  }

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={backToProjects}>Back to Projects</button>
      <h2>{project.name}</h2>
      <p>{project.description}</p>

      <h3>Invite a member</h3>
      <form onSubmit={handleInvite}>
        <input
          placeholder="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <button type="submit">Invite</button>
      </form>

      <h3>Tasks</h3>
      <form onSubmit={handleCreateTask}>
        <input
          placeholder="new task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((t) => (
          <TaskItem key={t.id} task={t} refreshTasks={loadTasks} />
        ))}
      </ul>

      <h3>Activity</h3>
      <ul>
        {activity.map((a) => (
          <li key={a.id}>
            {a.username}: {a.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectDetail;