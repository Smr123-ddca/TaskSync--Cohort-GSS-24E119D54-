export default function FilterBar({ filters, onChange }) {
  function updateField(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => updateField('search', e.target.value)}
      />

      <select value={filters.status} onChange={(e) => updateField('status', e.target.value)}>
        <option value="">All statuses</option>
        <option value="todo">To do</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <select value={filters.priority} onChange={(e) => updateField('priority', e.target.value)}>
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
    </div>
  );
}