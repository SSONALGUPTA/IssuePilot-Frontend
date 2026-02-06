import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import IssueList from './components/IssueList'
import KanbanBoard from './components/KanbanBoard'
import IssueForm from './components/IssueForm' 
import Login from './components/Login'
import Register from './components/Register'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))
  const [currentView, setCurrentView] = useState('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Force logout if token exists but user data is missing (legacy session)
  useEffect(() => {
      if (token && !user) {
          handleLogout();
      }
  }, [token, user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (data) => {
    const newToken = data.token;
    const newUser = data.user;
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const handleEditIssue = (issue) => {
      setEditingIssue(issue);
      setCurrentView('edit-issue');
  }

  if (!token) {
    if (isRegistering) {
        return <Register onRegister={handleLogin} onSwitchToLogin={() => setIsRegistering(false)} />
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} onEdit={handleEditIssue} />;
      case 'issues':
        return <IssueList onEdit={handleEditIssue} />;
      case 'new-issue':
        return <IssueForm onViewChange={setCurrentView} />;
      case 'edit-issue':
        return <IssueForm onViewChange={setCurrentView} initialData={editingIssue} />;
      case 'kanban':
        return <KanbanBoard onEdit={handleEditIssue} />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} user={user}>
      {renderView()}
    </Layout>
  )
}
