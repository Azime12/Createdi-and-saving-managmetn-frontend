interface ModalProps {
    title?: string;
    description?: string;
    onConfirm?: () => Promise<void>; // onConfirm is async
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isOpen: boolean;
    onClose: () => void;
    loading: boolean; // Accept loading as a prop
  }
  
  const Modal: React.FC<ModalProps> = ({
    title = "Are you sure?",
    description = "Do you really want to proceed? This action cannot be undone.",
    onConfirm,
    onCancel,
    confirmText = "Yes, I'm sure",
    cancelText = "No, cancel",
    isOpen,
    onClose,
    loading, // Use the loading prop
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6 w-full max-w-md relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            disabled={loading} // Disable when loading
          >
            ✕
          </button>
  
          {/* Modal Content */}
          <div className="text-center">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mb-5 text-gray-500 dark:text-gray-400">{description}</p>
  
            {/* Action Buttons */}
            <button
              onClick={onConfirm} // No need for handleConfirm, parent manages state
              className={`text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Signing out..." : confirmText}
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              disabled={loading} // Disable Cancel button when loading
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  