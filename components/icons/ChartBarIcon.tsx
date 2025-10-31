import React from 'react';

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M3 3v18h18"></path>
    <path d="M9 17V9"></path>
    <path d="M15 17V4"></path>
    <path d="M12 17v-3"></path>
  </svg>
);

export default ChartBarIcon;
