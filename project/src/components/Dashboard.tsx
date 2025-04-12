import React from "react";
import {
  PlusCircle,
  Mail,
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface DashboardProps {
  onNewIncoming: () => void;
  onNewOutgoing: () => void;
  onNewDecision: () => void;
  language: "fr" | "ar";
  searchResults?: Array<{
    type: "incoming" | "outgoing" | "decision";
    title: string;
    time: string;
  }>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewIncoming,
  onNewOutgoing,
  onNewDecision,
  language,
  searchResults,
}) => {
  const activities = searchResults?.length ? searchResults : [];

  return (
    <div className="flex flex-col font-['Inter'] bg-gray-50 dark:bg-gray-900">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Courriers Arrivés */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border-b border-blue-100 dark:border-blue-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600 dark:text-blue-400" size={18} />
                <h3 className="text-base font-semibold text-blue-800 dark:text-blue-300">
                  {language === "ar" ? "مراسلات الواردة" : "Courriers Arrivés"}
                </h3>
              </div>
              <button
                onClick={onNewIncoming}
                className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700 transition-all duration-200 hover:scale-110 hover:shadow-md"
                title={language === "ar" ? "إضافة جديد" : "Ajouter nouveau"}
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Courriers Départ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
          <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border-b border-green-100 dark:border-green-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Mail
                  className="text-green-600 dark:text-green-400"
                  size={18}
                />
                <h3 className="text-base font-semibold text-green-800 dark:text-green-300">
                  {language === "ar" ? "مراسلات الصادرة" : "Courriers Départ"}
                </h3>
              </div>
              <button
                onClick={onNewOutgoing}
                className="p-2 bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-700 transition-all duration-200 hover:scale-110 hover:shadow-md"
                title={language === "ar" ? "إضافة جديد" : "Ajouter nouveau"}
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Décisions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
          <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 border-b border-purple-100 dark:border-purple-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FileText
                  className="text-purple-600 dark:text-purple-400"
                  size={18}
                />
                <h3 className="text-base font-semibold text-purple-800 dark:text-purple-300">
                  {language === "ar" ? "القرارات" : "Décisions"}
                </h3>
              </div>
              <button
                onClick={onNewDecision}
                className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-700 transition-all duration-200 hover:scale-110 hover:shadow-md"
                title={language === "ar" ? "قرار جديد" : "Nouvelle Décision"}
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 m-4">
        <div className="flex items-center justify-between mb-4">
          {/* Title removed */}
        </div>
        <div className="space-y-3">
          {activities.length > 0 &&
            activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div
                  className={`p-2 ${
                    activity.type === "incoming"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : activity.type === "outgoing"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-purple-100 dark:bg-purple-900/30"
                  } rounded-full`}
                >
                  {activity.type === "decision" ? (
                    <FileText
                      size={16}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  ) : (
                    <Mail
                      size={16}
                      className={
                        activity.type === "incoming"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-green-600 dark:text-green-400"
                      }
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
