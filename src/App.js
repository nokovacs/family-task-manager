import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import SuggestedTasks from './components/SuggestedTasks';
import TaskDetail from './components/TaskDetail';
import Header from './components/Header'; // Add Header as a component

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main content with padding to prevent overlap with the footer */}
        <main className="flex-grow p-4 pb-16"> {/* Add pb-16 to account for footer height */}
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/in-progress" element={<TaskList />} />
            <Route path="/completed" element={<TaskList />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/suggested-tasks" element={<SuggestedTasks />} />
            <Route path="/task/:taskId" element={<TaskDetail />} /> {/* Task Detail Route */}
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

function Footer() {
  const location = useLocation();

  const isTaskRoute =
    location.pathname === '/' ||
    location.pathname.startsWith('/in-progress') ||
    location.pathname.startsWith('/completed') ||
    location.pathname.startsWith('/task') ||
    location.pathname.startsWith('/add-task');

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-50 shadow-md p-4 flex justify-around h-16">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-sm ${isActive || isTaskRoute ? 'text-teal-500' : ''}`
        }
      >
        Task List
      </NavLink>
      <NavLink
        to="/suggested-tasks"
        className={({ isActive }) =>
          `text-sm ${isActive ? 'text-teal-500' : ''}`
        }
      >
        Suggested Tasks
      </NavLink>
    </footer>
  );
}

export default App;
