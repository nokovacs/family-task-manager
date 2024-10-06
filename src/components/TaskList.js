import React, { useState, useEffect } from 'react';
import { fetchTasks, updateTaskStatus, getUserByUserId } from '../api/supabaseAPI'; // Import getUserByUserId
import { useNavigate, useLocation } from 'react-router-dom';
import Toast from './Toast'; // Import the Toast component

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // Toast state for notifications
  const userId = 1; // Example user ID, replace with dynamic userId

  const navigate = useNavigate();
  const location = useLocation();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Extract the current status from the route (default to "Pending" if root "/")
  const status = location.pathname === "/" ? "Pending" : capitalizeFirstLetter(location.pathname.slice(1).replace('-', ' '));

  const loadTasks = async () => {
    setLoading(true);
    try {
      const taskData = await fetchTasks(userId, status); // Fetch tasks based on the status from the URL
      setTasks(taskData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [userId, status]); // Re-fetch tasks when userId or status changes

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setToast({ message: `Task marked as ${newStatus}`, type: 'success' }); // Show success toast
      loadTasks(); // Reload tasks immediately after status update
    } catch (error) {
      console.error('Error updating task status:', error);
      setToast({ message: 'Error updating task status', type: 'error' });
    }
  };

  const closeToast = () => {
    setToast(null); // Close the toast
  };

  // Automatically close toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer); // Clear the timeout on component unmount
    }
  }, [toast]);

  const tabStyles = "text-sm font-medium";
  const activeTabStyles = "text-teal-500 font-semibold border-b-2 border-teal-500";

  return (
    <div>
      {/* Tabs for filtering tasks */}
      <nav className="flex justify-evenly p-4 bg-gray-50">
        <button
          onClick={() => navigate('/')}
          className={`${status === 'Pending' ? activeTabStyles : tabStyles}`}
        >
          To-do
        </button>
        <button
          onClick={() => navigate('/in-progress')}
          className={`${status === 'In progress' ? activeTabStyles : tabStyles}`}
        >
          In Progress
        </button>
        <button
          onClick={() => navigate('/completed')}
          className={`${status === 'Completed' ? activeTabStyles : tabStyles}`}
        >
          Completed
        </button>
      </nav>

      {/* Task List */}
      <div className="space-y-4 mt-4">
        {loading ? (
          <div>Loading tasks...</div>
        ) : (
          tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white shadow rounded-lg p-4 flex justify-between cursor-pointer"
                onClick={() => navigate(`/task/${task.id}`)} // Navigate to task detail on box click
              >
                <div>
                  <h3 className="text-lg font-semibold">{task.name}</h3>
                </div>

                <div>
                  {/* Conditionally render buttons based on the task's current status */}
                  {status === 'Pending' && (
                    <button
                      className="text-teal-500"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation
                        handleUpdateStatus(task.id, 'In progress');
                      }}
                    >
                      Mark In Progress
                    </button>
                  )}
                  {status === 'In progress' && (
                    <button
                      className="text-teal-500"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation
                        handleUpdateStatus(task.id, 'Completed');
                      }}
                    >
                      Mark As Completed
                    </button>
                  )}
                  {status === 'Completed' && (
                    <span className="text-gray-500">Task Completed</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>No tasks available for this status.</div>
          )
        )}
      </div>

      {/* Toast component: conditionally rendered based on state */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
};

export default TaskList;
