import React, { useState, useEffect } from 'react';
import { Mail, Search, Filter, Download, Printer, Eye, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { courierService } from '../services/courierService';
import { Courier } from '../types/courier';
import ExcelViewer from './ExcelViewer';

interface MailManagementProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'ar';
}

export const MailManagement: React.FC<MailManagementProps> = ({ isOpen, onClose, language }) => {
  const [incomingMails, setIncomingMails] = useState<Courier[]>([]);
  const [outgoingMails, setOutgoingMails] = useState<Courier[]>([]);

  useEffect(() => {
    if (isOpen) {
      const mails = courierService.getAll();
      setIncomingMails(mails.filter(mail => mail.type === 'incoming'));
      setOutgoingMails(mails.filter(mail => mail.type === 'outgoing'));
    }
  }, [isOpen]);

  const handleViewMail = (mailId: number) => {
    toast.success(`Affichage du courrier ${mailId}`);
  };

  const handlePrint = (mailId: number) => {
    toast.success(`Impression du courrier ${mailId}`);
  };

  const handleDownload = (mailId: number) => {
    toast.success(`Téléchargement du courrier ${mailId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {language === 'ar' ? 'إدارة المراسلات' : 'Gestion des Courriers'}
        </h2>

        <ExcelViewer 
          data={incomingMails}
          onClose={onClose}
        />

        <div className="grid grid-cols-2 gap-6">
          {/* Courriers Arrivés */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-blue-600">
              {language === 'ar' ? 'البريد الوارد' : 'Courriers Arrivés'}
            </h3>
            <div className="space-y-3">
              {incomingMails.map(mail => (
                <div key={mail.id} className="p-3 border rounded-lg hover:shadow-md">
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
              ))}
            </div>
          </div>

          {/* Courriers Départ */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-green-600">
              {language === 'ar' ? 'البريد الصادر' : 'Courriers Départ'}
            </h3>
            <div className="space-y-3">
              {outgoingMails.map(mail => (
                <div key={mail.id} className="p-3 border rounded-lg hover:shadow-md">
                  <div className="font-medium">{mail.subject}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>N° {mail.number}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(mail.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
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