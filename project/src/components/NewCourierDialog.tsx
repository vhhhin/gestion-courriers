// NewCourierDialog.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import type { Courier, CourierType, CourierPriority } from "../types/courier";
import { v4 as uuidv4 } from "uuid";
import { courierService } from "../services/courierService";
import decisionService from "../services/decisionService";
import toast from "react-hot-toast";
import { SuccessToast } from "./SuccessToast";

interface NewCourierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: CourierType;
  language: "fr" | "ar";
  onSuccess?: () => void;
  editMode?: boolean;
  initialData?: Courier;
}

interface FormData {
  date: string;
  subject: string;
  reference: string;
  sender: string;
  recipient: string;
  priority: CourierPriority;
}

const getNextNumber = (type: CourierType) => {
  const allItems =
    type === "decision" ? decisionService.getAll() : courierService.getAll();
  const filteredItems = allItems.filter(
    (item) => "type" in item && item.type === type
  );
  const lastNumber = filteredItems.reduce((max, item) => {
    const num = parseInt(item.number, 10);
    return num > max ? num : max;
  }, 0);
  return (lastNumber + 1).toString();
};

export const NewCourierDialog: React.FC<NewCourierDialogProps> = ({
  isOpen,
  onClose,
  type,
  language,
  onSuccess,
  editMode = false,
  initialData,
}) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: editMode
      ? {
          date: initialData?.date.toString().split("T")[0],
          subject: initialData?.subject,
          reference: initialData?.reference,
          sender: initialData?.sender,
          recipient: initialData?.recipient,
          priority: initialData?.priority,
        }
      : {},
  });

  const [formData, setFormData] = useState({ reference: "", number: "" });
  const [nextNumber, setNextNumber] = useState("");

  useEffect(() => {
    if (isOpen && !editMode) {
      const number = getNextNumber(type);
      setNextNumber(number);
      setFormData((prev) => ({ ...prev, number }));
    } else if (editMode && initialData) {
      setNextNumber(initialData.number.toString());
    }
  }, [isOpen, type, editMode, initialData]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editMode && initialData) {
        const updatedCourier = {
          ...initialData,
          ...data,
          date: new Date(data.date),
          updatedAt: new Date(),
          updatedBy: "current-user",
        };
        await courierService.update(updatedCourier);
        toast.success(
          language === "ar"
            ? "تم تعديل المراسلة بنجاح"
            : "Courrier modifié avec succès"
        );
      } else {
        const courierId = uuidv4();
        const currentYear = new Date().getFullYear();

        const courier: Courier = {
          id: courierId,
          type,
          number: nextNumber,
          date: new Date(data.date),
          subject: data.subject,
          reference: `${formData.reference}/${currentYear}`,
          sender: data.sender || "",
          recipient: data.recipient || "",
          status: "pending",
          priority: data.priority || "normal",
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
        };

        await courierService.add(courier);

        if (type === "outgoing") {
          setShowSuccessToast(true);
        }

        reset();
        setFormData({ reference: "", number: "" });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء الحفظ"
          : "Erreur lors de l'enregistrement"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <SuccessToast
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message={
          language === "ar"
            ? "تم حفظ البريد بنجاح ✅"
            : "Courrier enregistré avec succès ✅"
        }
      />

      <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {type === "incoming"
                ? language === "ar"
                  ? "بريد وارد جديد"
                  : "Nouveau Courrier Arrivée"
                : type === "outgoing"
                ? language === "ar"
                  ? "بريد صادر جديد"
                  : "Nouveau Courrier Départ"
                : ""}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "ar" ? "الرقم" : "Numéro"}
                  </label>
                  <input
                    type="text"
                    value={nextNumber}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "ar" ? "التاريخ" : "Date"}
                  </label>
                  <input
                    type="date"
                    {...register("date", { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "ar" ? "المرسل" : "Expéditeur"}
                  </label>
                  {type === "outgoing" ? (
                    <select
                      {...register("sender", { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      defaultValue={
                        language === "ar"
                          ? "رئيسة مجلس عمالة الصخيرات تمارة"
                          : "Présidente du Conseil Préfectoral"
                      }
                    >
                      <option value=""></option>

                      <option value="رئيسة مجلس عمالة الصخيرات تمارة">
                        رئيسة مجلس عمالة الصخيرات تمارة
                      </option>
                      <option value="Présidente du Conseil Préfectoral">
                        Présidente du Conseil Préfectoral
                      </option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      {...register("sender", { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "ar" ? "المستلم" : "Destinataire"}
                  </label>
                  {type === "incoming" ? (
                    <select
                      {...register("recipient", { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      defaultValue={
                        language === "ar"
                          ? "رئيسة مجلس عمالة الصخيرات تمارة"
                          : "Présidente du Conseil Préfectoral"
                      }
                    >
                      <option value=""></option>
                      <option value="رئيسة مجلس عمالة الصخيرات تمارة">
                        رئيسة مجلس عمالة الصخيرات تمارة
                      </option>
                      <option value="Présidente du Conseil Préfectoral">
                        Présidente du Conseil Préfectoral
                      </option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      {...register("recipient", { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "ar" ? "الموضوع" : "Objet"}
                  </label>
                  <input
                    type="text"
                    {...register("subject", { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                {type !== "outgoing" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {language === "ar" ? "رقم المرجع" : "Numéro de Référence"}
                    </label>
                    <input
                      type="text"
                      {...register("reference", { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  {language === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {language === "ar" ? "حفظ" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
