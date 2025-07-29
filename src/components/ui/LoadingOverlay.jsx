// components/ui/LoadingOverlay.jsx
import React from 'react';

const LoadingOverlay = ({ isVisible, message = "Cargando..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4 min-w-[200px]">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        
        {/* Mensaje */}
        <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;