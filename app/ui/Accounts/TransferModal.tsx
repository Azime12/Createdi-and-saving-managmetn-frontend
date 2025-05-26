'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromAccount: any;
  accounts: any[];
  onTransfer: (toAccountId: string, amount: number) => Promise<void>;
  formatCurrency: (amount: number) => string;
  primaryColor?: string;
}

const TransferModal = ({
  isOpen,
  onClose,
  fromAccount,
  accounts,
  onTransfer,
  formatCurrency,
  primaryColor = '#3b82f6'
}: TransferModalProps) => {
  const [amount, setAmount] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccount || !toAccountId || !amount) return;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (numericAmount > parseFloat(fromAccount.balance)) {
      toast.error('Insufficient funds for transfer');
      return;
    }

    setIsLoading(true);
    try {
      await onTransfer(toAccountId, numericAmount);
      setAmount('');
      setToAccountId('');
    } catch (error) {
      console.error('Transfer error:', error);
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
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="h-5 w-5 text-gray-500" />
            </button>

            <div className="pt-6 pb-3 border-b border-gray-200 px-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Transfer Funds
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                From: {fromAccount?.accountNumber?.accountNumber} ({formatCurrency(fromAccount?.balance)})
              </p>
            </div>

            <div className="px-6 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Account
                  </label>
                  <select
                    value={toAccountId}
                    onChange={(e) => setToAccountId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountNumber?.accountNumber} ({account.SavingType?.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={formatCurrency(0).replace('0', '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    step="0.01"
                    min="0"
                    max={fromAccount?.balance}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2.5 text-sm font-medium rounded-lg text-white transition ${
                      isLoading ? 'opacity-80' : 'hover:opacity-90'
                    }`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isLoading ? 'Processing...' : 'Transfer'}
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

export default TransferModal;