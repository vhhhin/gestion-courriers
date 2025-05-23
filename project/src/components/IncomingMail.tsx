import React, { useState, useEffect } from "react";
import { courierService } from "../services/courierService";
import { Courier } from "../types/courier";
import { Download, FileText, Trash2, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import exportCourriersPDF from "../utils/exportCourriersPDF";
import { EditDialog } from "./EditDialog";
import { DetailsDialog } from "./DetailsDialog";

interface IncomingMailProps {
  isOpen: boolean;
  onClose: () => void;
  language: "fr" | "ar";
}

const customConfirm = (message) => {
  return new Promise((resolve) => {
    const dialog = document.createElement("div");
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.backgroundColor = "#fff";
    dialog.style.padding = "20px";
    dialog.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    dialog.style.zIndex = "1000";
    dialog.style.borderRadius = "8px";
    dialog.style.textAlign = "center";

    const messageText = document.createElement("p");
    messageText.innerText = message;
    messageText.style.marginBottom = "20px";
    dialog.appendChild(messageText);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "space-around";

    const yesButton = document.createElement("button");
    yesButton.innerText = "Oui";
    yesButton.style.padding = "10px 20px";
    yesButton.style.backgroundColor = "#007BFF";
    yesButton.style.color = "#fff";
    yesButton.style.border = "none";
    yesButton.style.borderRadius = "5px";
    yesButton.style.cursor = "pointer";
    yesButton.onclick = () => {
      document.body.removeChild(dialog);
      resolve(true);
    };

    const noButton = document.createElement("button");
    noButton.innerText = "Non";
    noButton.style.padding = "10px 20px";
    noButton.style.backgroundColor = "#ccc";
    noButton.style.color = "#000";
    noButton.style.border = "none";
    noButton.style.borderRadius = "5px";
    noButton.style.cursor = "pointer";
    noButton.onclick = () => {
      document.body.removeChild(dialog);
      resolve(false);
    };

    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(noButton);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
  });
};

export const IncomingMail = ({
  isOpen,
  onClose,
  language,
}: IncomingMailProps) => {
  const [mails, setMails] = useState<Courier[]>([]);
  const [selectedMail, setSelectedMail] = useState<Courier | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const allMails = courierService.getAll();
      setMails(allMails.filter((mail) => mail.type === "incoming"));
    }
  }, [isOpen]);

  const handleDelete = async (mailId: string) => {
    const confirmation = await customConfirm(
      "Êtes-vous sûr de vouloir supprimer ce courrier ?"
    );
    if (confirmation) {
      try {
        courierService.deleteById(mailId);
        setMails((prev) => prev.filter((mail) => mail.id !== mailId));
        toast.success("Courrier supprimé avec succès");
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleEdit = (mailId: string) => {
    const mailToEdit = mails.find((mail) => mail.id === mailId);
    if (mailToEdit) {
      setSelectedMail(mailToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleViewDetails = (mailId: string) => {
    const mail = mails.find((mail) => mail.id === mailId);
    if (mail) {
      setSelectedMail(mail); // Assurez-vous que `mail` contient toutes les propriétés nécessaires
      setIsDetailsDialogOpen(true);
    }
  };

  const handleExportPDF = () => {
    if (mails.length === 0) {
      toast.error(
        language === "ar"
          ? "لا يوجد أي بريد لتصديره."
          : "Aucun courrier à exporter."
      );
      return;
    }

    const dataToExport = mails.map(
      ({
        number,
        date,
        sender,
        subject,
        reference,
        recipient,
        observation,
      }) => ({
        number,
        date: new Date(date).toLocaleDateString(),
        sender,
        subject,
        reference,
        recipient,
        observation: observation || "N/A",
      })
    );

    exportCourriersPDF(dataToExport, "arrive");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const tableContent = mails
      .map(
        ({ number, date, sender, subject, reference, recipient }) => `
      <tr>
        <td>${number}</td>
        <td>${new Date(date).toLocaleDateString()}</td>
        <td>${sender}</td>
        <td>${subject}</td>
        <td>${reference}</td>
        <td>${recipient}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <html>
        <head>
          <title>Liste des Courriers Arrivés</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Liste des Courriers Arrivés</h1>
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Date</th>
                <th>Expéditeur</th>
                <th>Objet</th>
                <th>Référence</th>
                <th>Destinataire</th>
              </tr>
            </thead>
            <tbody>
              ${tableContent}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {language === "ar" ? "البريد الوارد" : "Courriers Arrivés"}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <FileText size={18} className="mr-2" />
              {language === "ar" ? "تصدير PDF" : "Exporter en PDF"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FileText size={18} className="mr-2" />
              {language === "ar" ? "طباعة" : "Imprimer"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {mails.map((mail) => (
              <div
                key={mail.id}
                className="p-4 border rounded-lg hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{mail.subject}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>N° {mail.number}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(mail.date).toLocaleDateString()}</span>
                    </div>
                    {mail.reference && (
                      <div className="text-sm text-gray-500">
                        Ref: {mail.reference}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(mail.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(mail.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Modifier"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => handleViewDetails(mail.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                      title="Voir Détails"
                    >
                      <FileText size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isEditDialogOpen && (
          <EditDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            mail={selectedMail}
            onSave={() => {
              setIsEditDialogOpen(false);
              const allMails = courierService.getAll();
              setMails(allMails.filter((mail) => mail.type === "incoming"));
              toast.success("Courrier modifié avec succès");
            }}
          />
        )}

        {isDetailsDialogOpen && (
          <DetailsDialog
            isOpen={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            mail={selectedMail}
          />
        )}

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            {language === "ar" ? "إغلاق" : "Fermer"}
          </button>
        </div>
      </div>
    </div>
  );
};
