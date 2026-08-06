import TaskCard from './TaskCard';

export default function KanbanColumn({ title, status, tasks, onStatusChange, onSelectTask }) {
  function handleDragOver(e) {
    e.preventDefault(); // required so onDrop actually fires
  }

  function handleDrop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(Number(taskId), status);
    }
  }

  return (
    <div className="kanban-column" onDragOver={handleDragOver} onDrop={handleDrop}>
      <h3>
        {title} ({tasks.length})
      </h3>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onClick={() => onSelectTask(task)}
        />
      ))}
    </div>
  );
}