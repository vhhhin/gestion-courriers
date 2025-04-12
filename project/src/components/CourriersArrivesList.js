import React, { useState, useEffect } from "react";
import { courierService } from "../services/courierService";

const CourriersArrives = ({ onClose }) => {
  const [courriersArrives, setCourriersArrives] = useState([]);

  useEffect(() => {
    // Fetch courriers arrivés from the service
    const fetchedCourriers = courierService.getIncoming();
    setCourriersArrives(fetchedCourriers);
  }, []);

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
      <h1>Courriers Arrivés</h1>
      <ul>
        {courriersArrives.map((courrier, index) => (
          <li key={index}>
            {courrier.numero} - {courrier.objet}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourriersArrives;
