// Modal.tsx
"use client";

import { useEffect, useState } from "react";

interface ModalProps {
  id: string;
  title: React.ReactNode; // Accept JSX or string
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  id,
  title,
  children,
  isOpen,
  onClose,
  showCloseButton = true,
  size = "md",
}: ModalProps) {
  const [primaryColor, setPrimaryColor] = useState("#0ca197");

  useEffect(() => {
    const storedColor = localStorage.getItem("primaryColor") || "#0ca197";
    setPrimaryColor(storedColor);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const sizeClasses = {
    sm: "w-[20rem] max-w-full",
    md: "w-[30rem] max-w-full",
    lg: "w-[40rem] max-w-full",
    xl: "w-[50rem] max-w-full",
  };

  if (!isOpen) return null;

  return (
    <div
      id={id}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`relative ${sizeClasses[size]} max-h-full`}>
        <div
          className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 border-t-4"
          style={{ borderTopColor: primaryColor }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600 rounded-t">
            <div className="w-full">{title}</div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg w-8 h-8 flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l12 12M13 1L1 13"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
