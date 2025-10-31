
import React from 'react';

const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v.5a4.5 4.5 0 0 0-4.5 4.5v0a4.5 4.5 0 0 0 4.5 4.5v.5a4.5 4.5 0 1 0 9 0v-.5a4.5 4.5 0 0 0 4.5-4.5v0a4.5 4.5 0 0 0-4.5-4.5v-.5A4.5 4.5 0 0 0 12 2Z" />
        <path d="M12 11.5v4" />
        <path d="M10 13.5h4" />
        <path d="M12 17.5v2" />
        <path d="M12 4.5v2" />
        <path d="M17.5 12h2" />
        <path d="M15 15.5h2" />
        <path d="M4.5 12h2" />
        <path d="M7 15.5h2" />
        <path d="M18 6.5h-1" />
        <path d="M7 6.5H6" />
    </svg>
);

export default BrainCircuitIcon;
