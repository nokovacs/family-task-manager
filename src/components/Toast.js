// src/components/Toast.js
import React from 'react';

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-md 
      ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4">✖️</button>
      </div>
    </div>
  );
};

export default Toast;
