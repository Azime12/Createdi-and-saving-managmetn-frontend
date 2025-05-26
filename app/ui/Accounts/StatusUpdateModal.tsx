'use client';
import React, { useState } from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onUpdate: (newStatus: string) => Promise<void>;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  onUpdate,
}) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus === currentStatus) {
      toast.info('No status change detected');
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(newStatus);
      onClose();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <FaTimes className="h-5 w-5 text-gray-500" />
            </button>

            <div className="pt-6 pb-3 border-b border-gray-200 px-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Account Status
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Current status: <span className="font-medium">{currentStatus}</span>
              </p>
            </div>

            <div className="px-6 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    disabled={isLoading}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || newStatus === currentStatus}
                    className={`px-4 py-2.5 text-sm font-medium rounded-lg text-white transition bg-yellow-600 hover:opacity-90 ${
                      (newStatus === currentStatus || isLoading) ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Updating...
                      </span>
                    ) : (
                      'Update Status'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default StatusUpdateModal;