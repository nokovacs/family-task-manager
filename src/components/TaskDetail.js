import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTask, updateTaskStatus, deleteTask, updateTaskPriority } from '../api/supabaseAPI'; // Include updateTaskPriority
import Toast from './Toast'; // Import Toast component

const TaskDetail = () => {
  const { taskId } = useParams(); // Get taskId from the route
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // For success/failure messages
  const navigate = useNavigate();

  // Fetch task details
  useEffect(() => {
    const loadTask = async () => {
      try {
        const taskData = await fetchTask(taskId);
        if (taskData) {
          setTask(taskData);
        } else {
          console.error('Task not found');
          setTask(null);
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  // Mark task as in progress or completed
  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setToast({ message: `Task marked as ${newStatus.toLowerCase()}!`, type: 'success' });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete the task
  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskId);
      setToast({ message: 'Task deleted successfully!', type: 'success' });
      navigate(-1);
    } catch (error) {
      console.error('Error deleting task:', error);
      setToast({ message: 'Error deleting task', type: 'error' });
    }
  };

  // Cycle through priority levels (low -> medium -> high -> low)
  const handlePriorityClick = async () => {
    const newPriority = getNextPriority(task.priority);
    try {
      await updateTaskPriority(taskId, newPriority);
      setTask({ ...task, priority: newPriority });
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const getNextPriority = (currentPriority) => {
    if (currentPriority === 'low') return 'medium';
    if (currentPriority === 'medium') return 'high';
    return 'low';
  };

  const priorityToExclamation = (priority) => {
    if (priority === 'low') return '!';
    if (priority === 'medium') return '!!';
    return '!!!'; // high priority
  };

  const closeToast = () => {
    setToast(null);
  };

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!task) {
    return <div>Task not found.</div>;
  }

  return (
    <div className="p-4 relative">
      {/* Styled "X" button to go back */}
      <button
        className="absolute top-4 right-4 text-gray-500 border border-gray-300 rounded-full p-2 hover:bg-gray-200"
        onClick={() => navigate(-1)}
      >
        ✖️
      </button>

      {/* Task details */}
      <h2 className="text-lg font-bold mb-2">{task.name}</h2>

      {/* Priority - clickable to cycle through levels */}
      <p className="mt-2 text-gray-500">
        Priority: <span className="cursor-pointer text-teal-500 font-semibold" onClick={handlePriorityClick}>
          {priorityToExclamation(task.priority)}
        </span>
      </p>

      {/* Date Created */}
      <p className="text-gray-400 text-xs">Created: {new Date(task.date_created).toLocaleDateString()}</p>

      {/* Description Label */}
      <h3 className="text-teal-500 font-medium mt-4">Description</h3>
      <p className="mt-2 text-gray-700">{task.description}</p>

      {/* Break line */}
      <hr className="my-4" />

      {/* Conditionally render buttons based on task status */}
      <div className="mt-4 flex space-x-4">
        {task.status === 'Pending' && (
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded"
            onClick={() => handleUpdateStatus('In progress')}
          >
            Mark In Progress
          </button>
        )}

        {task.status === 'In progress' && (
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded"
            onClick={() => handleUpdateStatus('Completed')}
          >
            Mark As Completed
          </button>
        )}

        {task.status === 'Completed' && (
          <span className="text-gray-500">Task Completed</span>
        )}

        {/* Show the delete button for all statuses */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDeleteTask}
        >
          Delete Task
        </button>
      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
};

export default TaskDetail;
