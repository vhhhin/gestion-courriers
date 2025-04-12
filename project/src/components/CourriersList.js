import React, { useState } from 'react';
import exportCourriersPDF from '../utils/exportCourriersPDF';

const CourriersList = ({ courriers, type }) => {
  const [selectedCourrier, setSelectedCourrier] = useState(null);

  const handleExport = () => {
    if (type === 'depart') {
      const dataToExport = courriers.map(({ numero, date, destinataire, objet, piecesJointes }) => ({
        numero,
        date,
        destinataire,
        objet,
        piecesJointes: piecesJointes ? piecesJointes.join(', ') : 'Aucune',
      }));
      exportCourriersPDF(dataToExport, 'Courriers Départ');
    } else {
      const dataToExport = courriers.map(({ numero, date, expediteur, destinataire, objet, reference }) => ({
        numero,
        date,
        expediteur,
        destinataire,
        objet,
        reference,
      }));
      exportCourriersPDF(dataToExport, 'Courriers Départ');
    }
  };

  const handleViewDetails = (courrier) => {
    setSelectedCourrier(courrier);
  };

  return (
    <div>
      <button onClick={handleExport} className="btn btn-primary">Exporter la liste</button>
      {type === 'depart' && (
        <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-2">Exporter en PDF</button>
      )}

      <ul>
        {courriers.map((courrier) => (
          <li key={courrier.id}>
            {courrier.numero} - {courrier.objet}
            <button onClick={() => handleViewDetails(courrier)} className="btn btn-secondary ml-2">
              Voir Détails
            </button>
          </li>
        ))}
      </ul>

      {selectedCourrier && (
        <div className="courrier-details">
          <h3>Détails du Courrier</h3>
          <p><strong>Numéro:</strong> {selectedCourrier.numero}</p>
          <p><strong>Date:</strong> {selectedCourrier.date}</p>
          <p><strong>Expéditeur:</strong> {selectedCourrier.expediteur}</p>
          <p><strong>Destinataire:</strong> {selectedCourrier.destinataire}</p>
          <p><strong>Objet:</strong> {selectedCourrier.objet}</p>
          <p><strong>Référence:</strong> {selectedCourrier.reference}</p>
          {selectedCourrier.observation && (
            <p><strong>Observation:</strong> {selectedCourrier.observation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourriersList;