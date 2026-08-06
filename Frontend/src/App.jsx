import { useState } from "react";
import { apiRequest } from "./api";
import Login from "./Login";
import Register from "./Register";
import Projects from "./Projects";
import ProjectDetail from "./ProjectDetail";

function App() {
  // page can be: "login", "register", "projects", "project"
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    setPage("projects");
  }

  // POST /api/auth/logout
  async function handleLogout() {
    await apiRequest("/auth/logout", "POST");
    setUser(null);
    setPage("login");
  }

  function openProject(id) {
    setSelectedProjectId(id);
    setPage("project");
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>TaskSync</h1>

      {user && (
        <div>
          <span>Logged in as {user.username} </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <hr />

      {page === "login" && (
        <Login onLogin={handleLogin} goToRegister={() => setPage("register")} />
      )}

      {page === "register" && <Register goToLogin={() => setPage("login")} />}

      {page === "projects" && <Projects openProject={openProject} />}

      {page === "project" && (
        <ProjectDetail
          projectId={selectedProjectId}
          backToProjects={() => setPage("projects")}
        />
      )}
    </div>
  );
}

export default App;