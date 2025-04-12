import React, { useState, useEffect } from "react";
import decisionService, { Decision } from "../services/decisionService";
import toast from "react-hot-toast";
import { FileText, Trash2 } from "lucide-react";
import exportDecisionsPDF from "../utils/exportDecisionsPDF";
import DetailsDialog from "./DetailsDialog";

interface DecisionManagementProps {
  isOpen: boolean;
  onClose: () => void;
  language: "fr" | "ar";
}

export const DecisionManagement = ({
  isOpen,
  onClose,
  language,
}: DecisionManagementProps) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(
    null
  );
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
      exportDecisionsPDF(decisions);
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

  const handleDelete = async (decisionId: string) => {
    if (
      window.confirm(
        language === "ar"
          ? "هل أنت متأكد من حذف هذا القرار؟"
          : "Êtes-vous sûr de vouloir supprimer cette décision ?"
      )
    ) {
      try {
        await decisionService.deleteById(decisionId);
        setDecisions((prev) => prev.filter((d) => d.id !== decisionId));
        toast.success(
          language === "ar"
            ? "تم حذف القرار بنجاح"
            : "Décision supprimée avec succès"
        );
      } catch (error) {
        toast.error(
          language === "ar"
            ? "خطأ في حذf القرار"
            : "Erreur lors de la suppression"
        );
      }
    }
  };

  const handleViewDetails = (decisionId: string) => {
    const decision = decisions.find((d) => d.id === decisionId);
    if (decision) {
      setSelectedDecision(decision); // Assurez-vous que `decision` contient toutes les propriétés nécessaires
      setIsDetailsDialogOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {language === "ar" ? "القرارات" : "Décisions"}
          </h2>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <FileText size={18} className="mr-2" />
            {language === "ar" ? "تصدير PDF" : "Exporter en PDF"}
          </button>
        </div>

        <div className="mt-6">
          <div className="space-y-2">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="p-4 border rounded flex justify-between items-start"
              >
                <div>
                  <div className="font-medium">{decision.subject}</div>
                  <div className="text-sm text-gray-600">
                    N° {decision.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(decision.date).toLocaleDateString()}
                  </div>
                  {decision.observation && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      Note: {decision.observation}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(decision.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title={
                      language === "ar" ? "عرض التفاصيل" : "Voir les détails"
                    }
                  >
                    <FileText size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(decision.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title={language === "ar" ? "حذف" : "Supprimer"}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        mail={selectedDecision}
      />
    </div>
  );
};
