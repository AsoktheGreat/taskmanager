import React, { useState, useEffect } from 'react';
import './App.css';
import companyLogo from './assets/digital_lumad_withtext.svg';
import UserManagement from './components/UserManagement';
import Auth from './components/Auth';
import PasswordReset from './components/PasswordReset';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [searchTerm, setSearchTerm] = useState('');

  // Add missing functions
  function toggleTask(id) {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: inputValue,
        completed: false,
        dueDate: dueDate,
        priority: priority
      }]);
      setInputValue('');
      setDueDate('');
      setPriority('medium');
    }
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dueDate) - new Date(a.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });
  };

  const getFilteredTasks = () => {
    let filtered = tasks.filter(task =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (filterStatus) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        break;
    }

    return sortTasks(filtered);
  };

  // Add these new states after your existing states
  // Add all states together
  // Users state is already declared later in the code, removing duplicate declaration
// Remove isLocked state since it's not being used
  // Add session check effect
  useEffect(() => {
    const savedSession = localStorage.getItem('sessionData');
    if (savedSession) {
      const { user, expiry } = JSON.parse(savedSession);
      if (new Date().getTime() < expiry) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    }
  }, []);

  // Combine all handler functions
  const handleLogin = async (credentials) => {
    try {
      const user = users.find(u => u.name === credentials.email);
      if (user && validatePassword(credentials.password)) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        if (rememberMe) {
          const expiry = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); // 7 days
          localStorage.setItem('sessionData', JSON.stringify({ user, expiry }));
        } else {
          const expiry = new Date().getTime() + (30 * 60 * 1000); // 30 minutes
          localStorage.setItem('sessionData', JSON.stringify({ user, expiry }));
          setSessionTimeout(setTimeout(handleLogout, 30 * 60 * 1000));
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('sessionData');
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
  };

  const validatePassword = (password) => {
    return password.length >= 6 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  // Remove the standalone JSX block and these duplicate declarations:
  // - The app-header JSX block
  // - The second users state declaration
  // - The isLocked state
  // - The duplicate handleUpdateUser, handleDeleteUser, and handleAddUser functions

  // Keep only one set of user management functions
 
  // Update the header section to include logout button
  <div className="app-header">
    <img 
      src={companyLogo} 
      alt="Company Logo" 
      className="company-logo"
    />
    <p className="studio-tagline">by AVC Studio</p>
    <h1>Task Manager</h1>
    <p className="company-tagline">Company Built Application</p>
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  </div>

  // Add these new states after your existing states
// Removed unused state

  // Add these new states after your existing states
  // Remove the duplicate users array and keep only this one
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', role: 'admin', avatar: null },
    { id: 2, name: 'Regular User', role: 'user', avatar: null }
  ]);
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Keep only one set of user management functions
  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      name: 'New User',
      role: 'user',
      avatar: null
    };
    setUsers([...users, newUser]);
  };

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <Auth 
          onLogin={handleLogin} 
          rememberMe={rememberMe} 
          setRememberMe={setRememberMe}
          errorMessage={""} 
        />
      ) : (
          <div className="App">
            <div className="app-header">
              <img src={companyLogo} alt="Company Logo" className="company-logo" />
              <p className="studio-tagline">by AVC Studio</p>
              <h1>Task Manager</h1>
              <p className="company-tagline">Company Built Application</p>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>

            <div className="main-content">
              <div className="search-and-controls">
                <div className="search-bar">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="controls">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="date">Sort by Date</option>
                    <option value="priority">Sort by Priority</option>
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="task-form">
                <div className="form-row">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a new task" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)} />
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <button type="submit">
                    <i className="fas fa-plus"></i> Add Task
                  </button>
                </div>
              </form>

              <div className="tasks-container">
                <ul>
                  {getFilteredTasks().map(task => (
                    <li key={task.id} className={`priority-${task.priority}`}>
                      <div className="task-checkbox">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)} />
                      </div>
                      <div className="task-content">
                        <span className={task.completed ? 'completed' : ''}>
                          {task.text}
                        </span>
                        {task.dueDate && (
                          <span className="due-date">
                            <i className="far fa-calendar-alt"></i> Due: {task.dueDate}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="delete-btn"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {isAuthenticated && currentUser.role === 'admin' && (
                <UserManagement
                  currentUser={currentUser}
                  users={users}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  onAddUser={handleAddUser} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

export default App;
