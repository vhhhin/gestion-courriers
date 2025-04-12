import React, { useState, useEffect } from "react";
import decisionService from "../services/decisionService";
import toast from "react-hot-toast";

interface NewDecisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  language: "fr" | "ar";
  onSuccess?: () => void;
}

export const NewDecisionDialog = ({
  isOpen,
  onClose,
  language,
  onSuccess,
}: NewDecisionDialogProps) => {
  const [newDecision, setNewDecision] = useState({
    date: new Date().toISOString().split("T")[0],
    subject: "",
    observation: "",
    priority: "normal" as const,
  });
  const [nextNumber, setNextNumber] = useState("");

  useEffect(() => {
    if (isOpen) {
      const number = decisionService.getNextNumber();
      setNextNumber(number);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      decisionService.save({
        type: "decision",
        number: nextNumber,
        date: new Date(newDecision.date),
        subject: newDecision.subject,
        description: "",
        reference: `${nextNumber}/${new Date().getFullYear()}`,
        status: "pending",
        priority: newDecision.priority,
        observation: newDecision.observation,
        qrCode: "",
        history: [
          {
            date: new Date(),
            action: "created",
            user: "current-user",
          },
        ],
        createdBy: "current-user",
        createdAt: new Date(),
        updatedBy: "current-user",
        updatedAt: new Date(),
      });
      setNewDecision({
        date: new Date().toISOString().split("T")[0],
        subject: "",
        observation: "",
        priority: "normal",
      });
      toast.success(
        language === "ar"
          ? "تم حفظ القرار بنجاح"
          : "Décision enregistrée avec succès"
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء الحفظ"
          : "Erreur lors de l'enregistrement"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "الرقم" : "Numéro"}
              </label>
              <input
                type="text"
                value={nextNumber}
                disabled
                className="w-full px-2 py-1 border rounded bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "التاريخ" : "Date"}
              </label>
              <input
                type="date"
                value={newDecision.date}
                onChange={(e) =>
                  setNewDecision((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-2 py-1 border rounded text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "الموضوع" : "Objet"}
              </label>
              <input
                type="text"
                value={newDecision.subject}
                onChange={(e) =>
                  setNewDecision((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                className="w-full px-2 py-1 border rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {language === "ar" ? "ملاحظة" : "Observation"}
              </label>
              <textarea
                value={newDecision.observation}
                onChange={(e) =>
                  setNewDecision((prev) => ({
                    ...prev,
                    observation: e.target.value,
                  }))
                }
                className="w-full px-2 py-1 border rounded text-sm"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm"
            >
              {language === "ar" ? "إلغاء" : "Annuler"}
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              {language === "ar" ? "حفظ" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
