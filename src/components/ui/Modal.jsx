import { createContext, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";

const ModalContext = createContext();

// ① Modal Provider
export const Modal = ({ isOpen, onClose, children }) => {
  // بستن با کلید Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

// ② Modal Header
Modal.Header = ({ children, title }) => {
  const { onClose } = useContext(ModalContext);
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        {title || children}
      </h2>
      <button
        onClick={onClose}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
        aria-label="Close modal"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};

// ③ Modal Body
Modal.Body = ({ children }) => (
  <div className="p-6">{children}</div>
);

// ④ Modal Footer
Modal.Footer = ({ children }) => (
  <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10">
    {children}
  </div>
);

// ⑤ Modal Container (پس‌زمینه مودال)
Modal.Container = ({ children }) => (
  <div className="bg-white dark:bg-[#0a0a1a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl">
    {children}
  </div>
);