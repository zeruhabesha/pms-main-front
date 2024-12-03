import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 border-8 border-t-transparent border-gray-700 rounded-full animate-spin"></div>
        {/* Inner circle */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gray-800 rounded-full opacity-75 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
