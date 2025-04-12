import React, { useState, useEffect } from "react";
import decisionService, { Decision } from "../services/decisionService";
import toast from "react-hot-toast";
import { FileText, Printer, Trash2, Edit3 } from "lucide-react";
import exportDecisionsPDF from "../utils/exportDecisionsPDF";
import { EditDialog } from "./EditDialog";
import { DetailsDialog } from "./DetailsDialog";

interface DecisionListProps {
  isOpen: boolean;
  onClose: () => void;
  language: "fr" | "ar";
}

export const DecisionList = ({
  isOpen,
  onClose,
  language,
}: DecisionListProps) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDecisions();
    }
  }, [isOpen]);

  const loadDecisions = () => {
    try {
      const allDecisions = decisionService.getAll();
      setDecisions(allDecisions);
    } catch (error) {
      toast.error(
        language === "ar"
          ? "خطأ في تحميل القرارات"
          : "Erreur lors du chargement des décisions"
      );
    }
  };

  const handleExportPDF = () => {
    if (decisions.length === 0) {
      toast.error(
        language === "ar"
          ? "لا توجد قرارات للتصدير"
          : "Aucune décision à exporter"
      );
      return;
    }
    try {
      const dataToExport = decisions.map(
        ({
          number,
          date,
          subject,
          observation,
          author,
          status,
          additionalDetails,
        }) => ({
          number,
          date: new Date(date).toLocaleDateString(),
          subject,
          observation: observation || "N/A",
          author: author || "N/A",
          status: status || "N/A",
          additionalDetails: additionalDetails || "N/A",
        })
      );
      exportDecisionsPDF(dataToExport);
      toast.success(
        language === "ar" ? "تم تصدير القرارات بنجاح" : "Export PDF réussi"
      );
    } catch (error) {
      toast.error(
        language === "ar"
          ? "خطأ في تصدير القرارات"
          : "Erreur lors de l'export PDF"
      );
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const tableContent = decisions
      .map(
        ({ number, date, subject, observation }) => `
      <tr>
        <td>${number}</td>
        <td>${new Date(date).toLocaleDateString()}</td>
        <td>${subject}</td>
        <td>${observation || ""}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <html>
        <head>
          <title>${
            language === "ar" ? "قائمة القرارات" : "Liste des décisions"
          }</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${
            language === "ar" ? "قائمة القرارات" : "Liste des décisions"
          }</h1>
          <table>
            <thead>
              <tr>
                <th>${language === "ar" ? "الرقم" : "Numéro"}</th>
                <th>${language === "ar" ? "التاريخ" : "Date"}</th>
                <th>${language === "ar" ? "الموضوع" : "Sujet"}</th>
                <th>${language === "ar" ? "ملاحظة" : "Observation"}</th>
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

  const handleDelete = async (decisionId: string) => {
    const confirmation = window.confirm(
      language === "ar"
        ? "هل أنت متأكد من أنك تريد حذف هذا القرار؟"
        : "Êtes-vous sûr de vouloir supprimer cette décision ?"
    );
    if (confirmation) {
      try {
        decisionService.deleteById(decisionId);
        setDecisions((prev) =>
          prev.filter((decision) => decision.id !== decisionId)
        );
        toast.success(
          language === "ar"
            ? "تم حذف القرار بنجاح"
            : "Décision supprimée avec succès"
        );
      } catch (error) {
        toast.error(
          language === "ar"
            ? "خطأ أثناء الحذف"
            : "Erreur lors de la suppression"
        );
      }
    }
  };

  const handleEdit = (decisionId: string) => {
    const decisionToEdit = decisions.find(
      (decision) => decision.id === decisionId
    );
    if (decisionToEdit) {
      setSelectedDecision(decisionToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleViewDetails = (decisionId: string) => {
    const decision = decisions.find((decision) => decision.id === decisionId);
    if (decision) {
      setSelectedDecision(decision);
      setIsDetailsDialogOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {language === "ar" ? "قائمة القرارات" : "Liste des décisions"}
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
              <Printer size={18} className="mr-2" />
              {language === "ar" ? "طباعة" : "Imprimer"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="p-4 border rounded-lg hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{decision.subject}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>N° {decision.number}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(decision.date).toLocaleDateString()}
                      </span>
                    </div>
                    {decision.observation && (
                      <div className="text-sm text-gray-500">
                        {language === "ar" ? "ملاحظة" : "Observation"}:{" "}
                        {decision.observation}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(decision.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title={language === "ar" ? "حذف" : "Supprimer"}
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(decision.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title={language === "ar" ? "تعديل" : "Modifier"}
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => handleViewDetails(decision.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                      title={
                        language === "ar" ? "عرض التفاصيل" : "Voir Détails"
                      }
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
            mail={selectedDecision}
            onSave={() => {
              setIsEditDialogOpen(false);
              loadDecisions();
              toast.success(
                language === "ar"
                  ? "تم تعديل القرار بنجاح"
                  : "Décision modifiée avec succès"
              );
            }}
          />
        )}

        {isDetailsDialogOpen && (
          <DetailsDialog
            isOpen={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            mail={selectedDecision}
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
