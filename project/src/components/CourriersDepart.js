import React, { useState } from "react";
import OutgoingMailManagement from "./OutgoingMailManagement";

const CourriersDepart = ({ onClose }) => {
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  const handleOpenManagement = () => {
    setIsManagementOpen(true);
  };

  const handleCloseManagement = () => {
    setIsManagementOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2"
        title="Fermer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <h1>Courriers Départ</h1>
      <button onClick={handleOpenManagement} className="btn btn-primary">
        Gérer les Courriers Départ
      </button>

      {isManagementOpen && (
        <OutgoingMailManagement
          isOpen={isManagementOpen}
          onClose={handleCloseManagement}
          language="fr"
        />
      )}
    </div>
  );
};

export default CourriersDepart;
