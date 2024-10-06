import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-teal-500 shadow-md p-4 flex justify-between items-center" style={{ height: '90px' }}>
      <h1
        className="font-bold text-white"
        style={{
          fontSize: '2rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Honey-do List
      </h1>
      {/* Add Task button */}
      <button
        onClick={() => navigate('/add-task')}
        className="flex items-center border border-white text-white px-4 py-2 rounded hover:bg-teal-400"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Task
      </button>
    </header>
  );
};

export default Header;
