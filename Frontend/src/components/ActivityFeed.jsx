export default function ActivityFeed({ activity }) {
  return (
    <div className="activity-feed">
      <h3>Recent activity</h3>

      {activity.length === 0 && <p>No activity yet.</p>}

      <ul>
        {activity.map((item) => (
          <li key={item.id}>
            <span>{item.description}</span>
            <time>{new Date(item.created_at).toLocaleString()}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}