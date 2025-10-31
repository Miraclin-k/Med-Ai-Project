import React from 'react';

const StethoscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4.8 2.3A.3.3 0 1 0 5 2a3.4 3.4 0 0 1 5 2.8c0 1.4-1 2.5-2.2 2.8A3.4 3.4 0 0 1 5 2m0 0v14.4a3.5 3.5 0 0 0 3.5 3.5h0a3.5 3.5 0 0 0 3.5-3.5V6.5"></path>
    <path d="M19 2a3.4 3.4 0 0 1-2.8 5 .3.3 0 1 0 .3.3 3.4 3.4 0 0 1 2.8-5m0 0v14.4a3.5 3.5 0 0 1-3.5 3.5h0a3.5 3.5 0 0 1-3.5-3.5V6.5"></path>
    <circle cx="12" cy="8" r="1"></circle>
  </svg>
);

export default StethoscopeIcon;
