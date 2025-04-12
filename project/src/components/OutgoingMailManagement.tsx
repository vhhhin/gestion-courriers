import React, { useState, useEffect } from 'react';
import courierService, { Courier } from '../services/courierService';
import toast from 'react-hot-toast';
import { FileText, Trash2 } from 'lucide-react';
import exportCourriersPDF from '../utils/exportCourriersPDF';

interface OutgoingMailManagementProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'ar';
}

export const OutgoingMailManagement = ({
  isOpen,
  onClose,
  language,
}: OutgoingMailManagementProps) => {
  const [mails, setMails] = useState<Courier[]>([]);

  useEffect(() => {
    if (isOpen) {
      setMails(courierService.getAll().filter(mail => mail.type === 'outgoing'));
    }
  }, [isOpen]);

  const handleDelete = (mailId: string) => {
    const confirmation = window.confirm(
      language === 'ar'
        ? 'هل أنت متأكد من أنك تريد حذف هذا البريد؟'
        : 'Êtes-vous sûr de vouloir supprimer ce courrier ?'
    );
    if (confirmation) {
      try {
        courierService.deleteById(mailId);
        setMails(prev => prev.filter(mail => mail.id !== mailId));
        toast.success(language === 'ar' ? 'تم حذف البريد بنجاح' : 'Courrier supprimé avec succès');
      } catch (error) {
        toast.error(language === 'ar' ? 'خطأ أثناء الحذف' : 'Erreur lors de la suppression');
      }
    }
  };

  const handleExportPDF = () => {
    if (mails.length === 0) {
      toast.error(language === 'ar' ? 'لا يوجد أي بريد لتصديره.' : 'Aucun courrier à exporter.');
      return;
    }

    const dataToExport = mails.map(({ numero, date, expediteur, objet, reference, destinataire }) => ({
      numero,
      date,
      expediteur,
      objet,
      reference,
      destinataire,
    }));

    exportCourriersPDF(dataToExport, 'depart');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {language === 'ar' ? 'البريد الصادر' : 'Courriers Départ'}
          </h2>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <FileText size={18} className="mr-2" />
            {language === 'ar' ? 'تصدير PDF' : 'Exporter en PDF'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {mails.map(mail => (
              <div key={mail.id} className="p-4 border rounded-lg hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg">{mail.objet}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>N° {mail.numero}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(mail.date).toLocaleDateString()}</span>
                    </div>
                    {mail.observation && (
                      <p className="text-sm text-gray-500 mt-2">{mail.observation}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(mail.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title={language === 'ar' ? 'حذف' : 'Supprimer'}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            {language === 'ar' ? 'إغلاق' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};
