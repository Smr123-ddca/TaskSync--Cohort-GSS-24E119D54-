import { apiRequest } from "./api";

// PUT /api/tasks/:taskId
function TaskItem({ task, refreshTasks }) {
  async function changeStatus(newStatus) {
    await apiRequest(`/tasks/${task.id}`, "PUT", { status: newStatus });
    refreshTasks();
  }

  async function changePriority(newPriority) {
    await apiRequest(`/tasks/${task.id}`, "PUT", { priority: newPriority });
    refreshTasks();
  }

  return (
    <li style={{ marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
      <b>{task.title}</b> - status: {task.status} - priority: {task.priority}
      <br />
      <label>
        Status:{" "}
        <select value={task.status} onChange={(e) => changeStatus(e.target.value)}>
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
      </label>
      <label style={{ marginLeft: "10px" }}>
        Priority:{" "}
        <select value={task.priority} onChange={(e) => changePriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="urgent">urgent</option>
        </select>
      </label>
    </li>
  );
}

export default TaskItem;