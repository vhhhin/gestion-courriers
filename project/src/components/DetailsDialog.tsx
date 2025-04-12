import React from "react";

export const DetailsDialog = ({ isOpen, onClose, mail }) => {
  if (!isOpen || !mail) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Détails du Courrier</h2>
        <div className="space-y-2">
          <p>
            <strong>Numéro:</strong> {mail.number}
          </p>
          <p>
            <strong>Date:</strong> {new Date(mail.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Type:</strong> {mail.type}
          </p>
          <p>
            <strong>Expéditeur:</strong> {mail.sender || "N/A"}
          </p>
          <p>
            <strong>Destinataire:</strong> {mail.recipient || "N/A"}
          </p>
          <p>
            <strong>Objet:</strong> {mail.subject}
          </p>
          <p>
            <strong>Référence:</strong> {mail.reference || "N/A"}
          </p>
          <p>
            <strong>Statut:</strong> {mail.status || "N/A"}
          </p>
          <p>
            <strong>Priorité:</strong> {mail.priority || "N/A"}
          </p>
          {mail.observation && (
            <p>
              <strong>Observation:</strong> {mail.observation}
            </p>
          )}
          {mail.attachments && mail.attachments.length > 0 && (
            <p>
              <strong>Pièces Jointes:</strong>{" "}
              {mail.attachments.map((att) => att.name).join(", ")}
            </p>
          )}
          {mail.history && mail.history.length > 0 && (
            <div>
              <strong>Historique:</strong>
              <ul className="list-disc pl-5">
                {mail.history.map((entry, index) => (
                  <li key={index}>
                    {new Date(entry.date).toLocaleDateString()} - {entry.action}{" "}
                    par {entry.user}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
