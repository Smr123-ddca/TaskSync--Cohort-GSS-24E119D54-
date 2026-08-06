import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeProjectId, setActiveProjectId] = useState(null);

  // Not logged in: show login or register.
  if (!user) {
    return authView === 'register' ? (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    ) : (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    );
  }

  // Logged in and a project is open: show its board.
  if (activeProjectId) {
    return (
      <ProjectBoard
        projectId={activeProjectId}
        onBack={() => setActiveProjectId(null)}
      />
    );
  }

  // Logged in, no project open: show the project list.
  return <Dashboard onOpenProject={setActiveProjectId} />;
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;