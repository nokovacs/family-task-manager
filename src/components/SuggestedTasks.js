import React, { useState, useEffect } from 'react';
import { fetchSuggestedTasks, addTaskToToDo } from '../api/supabaseAPI'; // Import the API functions
import Toast from './Toast'; // Import Toast component

const SuggestedTasks = () => {
  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingTask, setProcessingTask] = useState(null); // Track task being processed
  const [toast, setToast] = useState(null); // Toast for success/error notifications

  const userId = 1; // Example userId, replace with actual user ID

  useEffect(() => {
    const loadSuggestedTasks = async () => {
      setLoading(true);
      try {
        const tasks = await fetchSuggestedTasks();
        setSuggestedTasks(tasks);
        setError(null);
      } catch (err) {
        setError('Error fetching suggested tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestedTasks();
  }, []);

  const handleAddTask = async (task) => {
    try {
      setProcessingTask(task.id); // Set the task as being processed

      // Add the task to the to-do list, passing the userId to find the family_id
      await addTaskToToDo(task, userId);

      // Show success toast when task is added
      setToast({ message: 'Task added to To-do List!', type: 'success' });

      setProcessingTask(null); // Reset processing state
    } catch (err) {
      // Show error toast if there was an issue
      setToast({ message: 'Error adding task to To-do List', type: 'error' });
      console.error(err);
    }
  };

  const closeToast = () => {
    setToast(null); // Close the toast
  };

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer); // Clear the timeout on component unmount
    }
  }, [toast]);

  if (loading) {
    return <div>Loading suggested tasks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-4">
      {suggestedTasks.map((task) => (
        <div key={task.id} className="relative bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold">{task.name}</h3>
          <p className="text-sm text-gray-500">{task.description}</p>
          <p className="text-sm font-semibold text-gray-800">${task.estimated_cost}</p>

          {/* Floating + button on the lower right */}
          <button
            className="absolute bottom-2 right-2 bg-teal-500 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg hover:bg-teal-600"
            onClick={() => handleAddTask(task)}
            disabled={processingTask === task.id} // Disable button when processing
          >
            {processingTask === task.id ? '...' : '+'}
          </button>
        </div>
      ))}

      {/* Toast component: conditionally rendered based on state */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
};

export default SuggestedTasks;
