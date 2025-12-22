// components/ArrowExchange.tsx
import React from 'react';

const ArrowExchange = ({
  size = 32,             // Arrow size in pixels
  thickness = 'thick',   // 'thin', 'medium', 'thick', 'extra-thick'
  color = '#10B981',     // Emerald green - very visible
  className = '',
  animate = false        // Add hover animation
}) => {
  // Define thickness based on prop
  const strokeWidth = {
    'thin': 2,
    'medium': 3,
    'thick': 4,
    'extra-thick': 6
  }[thickness] || 4;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`
        inline-block align-middle
        ${animate ? 'hover:scale-110 transition-transform duration-200' : ''}
        ${className}
      `}
    >
      {/* Right arrow path */}
      <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
    </svg>
  );
};

export default ArrowExchange; // Changed from GreenArrow to ArrowExchange
