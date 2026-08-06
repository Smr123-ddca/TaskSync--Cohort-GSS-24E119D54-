const NEXT_STATUS = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
};

export default function TaskCard({ task, onStatusChange, onClick }) {
  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', String(task.id));
  }

  function handleQuickMove(e) {
    e.stopPropagation(); // don't also open the task modal
    onStatusChange(task.id, NEXT_STATUS[task.status]);
  }

  return (
    <div
      className={`task-card priority-${task.priority}`}
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}

      <div className="task-card-meta">
        <span className="priority-badge">{task.priority}</span>
        {task.due_date && <span>Due {task.due_date.slice(0, 10)}</span>}
      </div>

      <button className="quick-move-button" onClick={handleQuickMove}>
        Move to {NEXT_STATUS[task.status].replace('_', ' ')}
      </button>
    </div>
  );
}