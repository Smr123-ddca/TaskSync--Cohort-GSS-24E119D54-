import { useEffect, useState } from "react";
import { apiRequest } from "./api";

// GET /api/projects and POST /api/projects
function Projects({ openProject }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function loadProjects() {
    const data = await apiRequest("/projects");
    setProjects(data.projects);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await apiRequest("/projects", "POST", { name, description });
    setName("");
    setDescription("");
    loadProjects();
  }

  return (
    <div>
      <h2>Your Projects</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Project</button>
      </form>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            {p.name} ({p.done_tasks}/{p.total_tasks} done){" "}
            <button onClick={() => openProject(p.id)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;