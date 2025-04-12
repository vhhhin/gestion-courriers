import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { NewCourierDialog } from "./NewCourierDialog";
import { SearchBar } from "./SearchBar";
import { MailManagement } from "./MailManagement";
import { Mail, FileText, LogOut } from "lucide-react";
import type { CourierType } from "../types/courier";
import toast from "react-hot-toast";
import logo from "./logo.png";
import { authService } from "../services/authService";
import { IncomingMail } from "./IncomingMail";
import { OutgoingMail } from "./OutgoingMail";
import { DecisionList } from "./DecisionList";
import { NewDecisionDialog } from "./NewDecisionDialog";
import { useAuth } from "../hooks/useAuth";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isNewCourierDialogOpen, setIsNewCourierDialogOpen] = useState(false);
  const [isMailManagementOpen, setIsMailManagementOpen] = useState(false);
  const [isDecisionListOpen, setIsDecisionListOpen] = useState(false);
  const [newCourierType, setNewCourierType] = useState<CourierType>("incoming");
  const [language, setLanguage] = useState<"fr" | "ar">("fr");
  const [theme] = useState<"light" | "dark">("light");
  const [activeLink, setActiveLink] = useState("dashboard");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeType, setActiveType] = useState<DocumentType>("incoming");

  useEffect(() => {
    if (!isAuthenticated) {
      console.error("Utilisateur non authentifié. Redirection vers /login.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleNewCourier = useCallback((type: CourierType) => {
    setNewCourierType(type);
    setIsNewCourierDialogOpen(true);
  }, []);

  const handleCourierAdded = useCallback(() => {
    toast.success("Courrier ajouté avec succès");
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const handleLanguageChange = useCallback(() => {
    setLanguage((prev) => (prev === "fr" ? "ar" : "fr"));
  }, []);

  const navigationItems = useMemo(
    () => [
      {
        key: "dashboard",
        label: "Tableau de Bord",
        icon: <FileText size={20} />,
      },
      { key: "incoming", label: "Courriers Arrivés", icon: <Mail size={20} /> },
      { key: "outgoing", label: "Courriers Départ", icon: <Mail size={20} /> },
      { key: "decisions", label: "Décisions", icon: <FileText size={20} /> },
    ],
    []
  );

  const handleNavigation = useCallback((key: string) => {
    setActiveLink(key);
    switch (key) {
      case "incoming":
        setActiveType("incoming");
        setIsMailManagementOpen(true);
        break;
      case "outgoing":
        setActiveType("outgoing");
        setIsMailManagementOpen(true);
        break;
      case "decisions":
        setActiveType("decision");
        setIsDecisionListOpen(true);
        break;
      default:
        break;
    }
  }, []);

  const handleSearch = (
    type: DocumentType,
    searchData: Record<string, string>
  ) => {
    const results = [
      {
        type,
        number: "123",
        date: "2023-10-01",
        sender: type === "incoming" ? "Expéditeur A" : "N/A",
        recipient: type === "outgoing" ? "Destinataire B" : "N/A",
        subject: "Objet Exemple",
        status: "En cours",
        attachments: type === "decision" ? "Pièce jointe 1" : "N/A",
      },
    ];
    setSearchResults(results);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation latérale */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <img src={logo} alt="Logo" className="h-20 w-auto mx-auto" />
          <h1 className="text-xl font-bold text-center mt-4 text-gray-900 dark:text-white">
            {language === "ar" ? "مكتب الضبط" : "Bureau d'Ordre"}
          </h1>
        </div>

        <div className="mt-6">
          {navigationItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => handleNavigation(key)}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
                activeLink === key
                  ? "text-blue-600 bg-blue-50 dark:text-blue-500 dark:bg-blue-900/20"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-blue-900/20"
              }`}
            >
              {icon}
              <span className="ml-4">{label}</span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20"
          >
            <LogOut size={20} />
            <span className="ml-4">
              {language === "ar" ? "تسجيل الخروج" : "Déconnexion"}
            </span>
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === "ar"
                    ? "المجلس الإقليمي لسخيرات-تمارة - مكتب الضبط"
                    : "Le Conseil Préfectoral de Skhirat-Témara "}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {language === "ar"
                    ? "نظام إدارة المراسلات"
                    : "Système de Gestion des Courriers"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLanguageChange}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {language === "fr" ? "العربية" : "Français"}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-8 py-8 pb-16">
          <div className="space-y-6">
            <SearchBar
              onSearch={handleSearch}
              language={language}
              activeType={activeType}
            />

            {/* Display search results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result, index) => (
                    <li key={index} className="border-b py-2">
                      <p>
                        <strong>
                          {language === "ar" ? "رقم:" : "Numéro:"}
                        </strong>{" "}
                        {result.number}
                      </p>
                      <p>
                        <strong>
                          {language === "ar" ? "التاريخ:" : "Date:"}
                        </strong>{" "}
                        {result.date}
                      </p>
                      <p>
                        <strong>
                          {language === "ar" ? "المرسل:" : "Expéditeur:"}
                        </strong>{" "}
                        {result.sender}
                      </p>
                      <p>
                        <strong>
                          {language === "ar" ? "المستلم:" : "Destinataire:"}
                        </strong>{" "}
                        {result.recipient}
                      </p>
                      <p>
                        <strong>
                          {language === "ar" ? "الموضوع:" : "Objet:"}
                        </strong>{" "}
                        {result.subject}
                      </p>
                      <p>
                        <strong>
                          {language === "ar" ? "الحالة:" : "Statut:"}
                        </strong>{" "}
                        {result.status}
                      </p>
                      <p>
                        <strong>
                          {language === "ar" ? "المرفقات:" : "Pièces jointes:"}
                        </strong>{" "}
                        {result.attachments}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  {language === "ar"
                    ? "لا توجد نتائج للعرض"
                    : "Aucun résultat à afficher"}
                </p>
              )}
            </div>

            <Dashboard
              onNewIncoming={() => handleNewCourier("incoming")}
              onNewOutgoing={() => handleNewCourier("outgoing")}
              onNewDecision={() => handleNewCourier("decision")}
              language={language}
              searchResults={searchResults}
            />
          </div>
        </main>

        <footer className="fixed bottom-0 left-64 right-0 bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-8 py-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()}{" "}
              {language === "ar"
                ? "المجلس الإقليمي لسخيرات-تمارة. جميع الحقوق محفوظة."
                : "Le Conseil Préfectoral de Skhirat-Témara Système de Gestion des Courriers"}
            </p>
          </div>
        </footer>
      </div>

      <NewCourierDialog
        isOpen={isNewCourierDialogOpen && newCourierType !== "decision"}
        onClose={() => setIsNewCourierDialogOpen(false)}
        type={newCourierType}
        language={language}
        onSuccess={handleCourierAdded}
      />

      <IncomingMail
        isOpen={isMailManagementOpen && activeLink === "incoming"}
        onClose={() => setIsMailManagementOpen(false)}
        language={language}
      />
      <OutgoingMail
        isOpen={isMailManagementOpen && activeLink === "outgoing"}
        onClose={() => setIsMailManagementOpen(false)}
        language={language}
      />
      <DecisionList
        isOpen={isDecisionListOpen}
        onClose={() => setIsDecisionListOpen(false)}
        language={language}
      />
      <NewDecisionDialog
        isOpen={isNewCourierDialogOpen && newCourierType === "decision"}
        onClose={() => setIsNewCourierDialogOpen(false)}
        language={language}
        onSuccess={handleCourierAdded}
        className="p-4 max-w-md mx-auto"
      />
    </div>
  );
};
