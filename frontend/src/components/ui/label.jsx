import React from 'react';

export const Label = ({ htmlFor, children, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium text-white ${className}`}>
      {children}
    </label>
  );
};
