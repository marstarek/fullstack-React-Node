// GlobalDialog.tsx
import React, { createContext, useContext, useState, type ReactNode,  } from "react";

interface DialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  content?: ReactNode; // 👈 custom content
}

interface GlobalDialogContextType {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

const GlobalDialogContext = createContext<GlobalDialogContextType | undefined>(
  undefined
);

export function GlobalDialogProvider({ children }: { children: ReactNode }) {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = (options: DialogOptions) => {
    setDialogOptions(options);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setDialogOptions(null);
  };

  return (
    <GlobalDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      {isOpen && dialogOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            {dialogOptions.title && (
              <h2 className="text-xl font-semibold mb-4">{dialogOptions.title}</h2>
            )}

            {/* 👇 Either custom content OR message */}
            {dialogOptions.content ? (
              dialogOptions.content
            ) : (
              <p className="mb-6 text-gray-700">{dialogOptions.message}</p>
            )}

            {!dialogOptions.content && (
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {dialogOptions.cancelText || "Cancel"}
                </button>
                {dialogOptions.onConfirm && (
                  <button
                    onClick={dialogOptions.onConfirm}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {dialogOptions.confirmText || "Confirm"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </GlobalDialogContext.Provider>
  );
}

export function useGlobalDialog() {
  const context = useContext(GlobalDialogContext);
  if (!context) {
    throw new Error("useGlobalDialog must be used within a GlobalDialogProvider");
  }
  return context;
}
