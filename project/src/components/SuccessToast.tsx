import { useEffect } from "react";

interface SuccessToastProps {
  show: boolean;
  onClose: () => void;
  message?: string;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ show, onClose, message }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000); // Disparaît après 3 secondes
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg flex items-center space-x-2 z-50">
      <span className="text-green-600 text-xl">✅</span>
      <p className="font-medium">
        {message || "Courrier enregistré avec succès ✅"}
      </p>
    </div>
  );
};
