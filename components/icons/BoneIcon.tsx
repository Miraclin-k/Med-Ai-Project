import React from 'react';

const BoneIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M17.5 10.5c-2.5 0-2.5-2-5-2s-2.5 2-5 2" />
    <path d="M17.5 14.5c-2.5 0-2.5-2-5-2s-2.5 2-5 2" />
    <path d="M12.5 6.5C14.5 6.5 16 5 17.5 5s3 1.5 3 3.5-1.5 3.5-3 3.5" />
    <path d="M11.5 18.5c-2 0-3.5-1.5-3.5-3.5s1.5-3.5 3.5-3.5 1.5 2 1.5 3.5" />
    <path d="M2.5 12.5c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5-1.5 3.5-3 3.5" />
  </svg>
);

export default BoneIcon;
