import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import logo from "./logo.png";

// Mot de passe : Courriel@2025!
const SUGGESTED_PASSWORD = "Courriel@2025!";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language] = useState<"fr" | "ar">("fr");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Vérification du mot de passe
      if (password.trim() !== SUGGESTED_PASSWORD) {
        throw new Error(
          language === "ar" ? "كلمة المرور غير صحيحة" : "Mot de passe incorrect"
        );
      }

      // Tentative de connexion
      await login(fullName, password);

      // Message de succès
      toast.success(
        language === "ar" ? "تم تسجيل الدخول بنجاح!" : "Connexion réussie!",
        {
          duration: 2000,
          position: "top-center",
          style: {
            background: "#10B981",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
        }
      );
    } catch (error) {
      console.error("Erreur de connexion:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      setError(errorMessage);

      // Message d'erreur
      toast.error(
        language === "ar" ? "فشل تسجيل الدخول" : "Échec de la connexion",
        {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center">
              <img
                className="h-full w-full object-contain"
                src={logo}
                alt="Logo"
              />
            </div>
            <h1 className="mt-2 text-lg font-bold text-gray-900 text-center">
              {language === "ar"
                ? "المجلس الإقليمي الصخيرات-تمارة"
                : "Conseil Préfectoral de Skhirat-Témara"}
            </h1>
            <h2 className="text-xs text-gray-600 text-center">
              {language === "ar"
                ? "نظام إدارة المراسلات - مكتب الضبط"
                : "Gestion des Courriers - Bureau d'Ordre"}
            </h2>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200">
          <div>
            <h2 className="text-center text-2xl font-extrabold text-gray-900">
              {language === "ar" ? "تسجيل الدخول" : "Connexion"}
            </h2>
            <p className="mt-1 text-center text-xs text-gray-600">
              {language === "ar"
                ? "الرجاء إدخال بيانات الاعتماد الخاصة بك"
                : "Veuillez entrer vos identifiants"}
            </p>
          </div>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  {language === "ar" ? "الاسم الكامل" : "Nom complet"}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder={
                    language === "ar" ? "الاسم الكامل" : "Nom complet"
                  }
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  {language === "ar" ? "كلمة المرور" : "Mot de passe"}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder={
                    language === "ar" ? "كلمة المرور" : "Mot de passe"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-2 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <h3 className="text-xs font-medium text-red-800">
                      {language === "ar" ? "خطأ" : "Erreur"}
                    </h3>
                    <div className="text-xs text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                ) : null}
                {loading
                  ? language === "ar"
                    ? "جاري تسجيل الدخول..."
                    : "Connexion en cours..."
                  : language === "ar"
                  ? "تسجيل الدخول"
                  : "Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer with Copyright */}
      <footer className="bg-white/80 backdrop-blur-sm py-2 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()}{" "}
            {language === "ar"
              ? "المجلس الإقليمي الصخيرات-تمارة. جميع الحقوق محفوظة."
              : "Le Conseil Préfectoral de Skhirat-Témara Système de Gestion des Courriers"}
          </p>
        </div>
      </footer>
    </div>
  );
};
