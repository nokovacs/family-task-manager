import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTask } from '../api/supabaseAPI';
import Toast from './Toast';

const AddTask = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('low');
  const [toast, setToast] = useState(null); // State for managing the toast
  const [step, setStep] = useState(1); // Track the current step (1, 2, or 3)
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const userId = 1;

  const handleNextStep = () => {
    if (step === 1 && !taskName.trim()) {
      setToast({ message: 'Task name is required.', type: 'error' });
      return;
    }
    if (step === 2 && !taskDescription.trim()) {
      setToast({ message: 'Task description is required.', type: 'error' });
      return;
    }
    setStep(step + 1);
  };

  const handleAddTask = async () => {
    try {
      await addTask(userId, taskName, taskDescription, taskPriority);
      setTaskName('');
      setTaskDescription('');
      setTaskPriority('low');
      setStep(1);
      setSuccess(true);
      setToast({ message: 'Task added successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding task:', error);
      setToast({ message: 'Failed to add task. Please try again.', type: 'error' });
    }
  };

  const closeToast = () => {
    setToast(null); // Close the toast
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (success) {
    return (
      <div className="p-4 space-y-4 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 border border-gray-300 rounded-full p-2 hover:bg-gray-200"
          onClick={() => navigate('/')}
        >
          ✖️
        </button>

        <h2 className="text-lg font-bold text-center">Task Submitted Successfully!</h2>

        {/* Success options */}
        <div className="flex flex-col space-y-4 mt-6">
          <button
            className="bg-teal-500 text-white p-2 w-full rounded"
            onClick={() => setSuccess(false)}
          >
            Submit Another Task
          </button>
          <button
            className="bg-gray-300 text-gray-700 p-2 w-full rounded"
            onClick={() => navigate('/')}
          >
            Go to To-do List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 relative">
      {/* "X" button in the top right to navigate back */}
      <button
        className="absolute top-4 right-4 text-gray-500 border border-gray-300 rounded-full p-2 hover:bg-gray-200"
        onClick={() => navigate(-1)}
      >
        ✖️
      </button>

      <h2 className="text-lg font-bold">Add a New Task</h2>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full ${step === 1 ? 'bg-teal-400 w-1/3' : step === 2 ? 'bg-teal-400 w-2/3' : 'bg-teal-500 w-full'}`}
        ></div>
      </div>

      {/* Step 1: Task Name */}
      {step === 1 && (
        <>
          <h2 className="text-lg">Enter the task name</h2>
          <input
            type="text"
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="Example: Grocery Run"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button
            className="bg-teal-500 text-white p-2 w-full rounded"
            onClick={handleNextStep}
          >
            Continue
          </button>
        </>
      )}

      {/* Step 2: Task Description */}
      {step === 2 && (
        <>
          <h2 className="text-lg">Enter the task description</h2>
          <textarea
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="Example: We need food for a large dinner"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          ></textarea>
          <button
            className="bg-teal-500 text-white p-2 w-full rounded"
            onClick={handleNextStep}
          >
            Continue
          </button>
        </>
      )}

      {/* Step 3: Select Priority */}
      {step === 3 && (
        <>
          <h2 className="text-lg">Select task priority</h2>
          <div className="flex justify-around">
            <button
              className={`p-2 rounded ${taskPriority === 'low' ? 'bg-teal-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setTaskPriority('low')}
            >
              Low
            </button>
            <button
              className={`p-2 rounded ${taskPriority === 'medium' ? 'bg-teal-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setTaskPriority('medium')}
            >
              Medium
            </button>
            <button
              className={`p-2 rounded ${taskPriority === 'high' ? 'bg-teal-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setTaskPriority('high')}
            >
              High
            </button>
          </div>
          <button
            className="bg-teal-500 text-white p-2 w-full rounded mt-4"
            onClick={handleAddTask}
          >
            Submit Task
          </button>
        </>
      )}

      {/* Toast component: conditionally rendered based on state */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
};

export default AddTask;
