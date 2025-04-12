// src/components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Ajoutez ici les props personnalisées si nécessaire
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      {children}
    </button>
  );
};