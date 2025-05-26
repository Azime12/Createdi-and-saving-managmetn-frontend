'use client';
import { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import { LoanType } from '@/types';

interface Props {
  initialData: LoanType | null;
  onClose: () => void;
  primaryColor: string;
  createLoanType: (data: Partial<LoanType>) => Promise<any>;
  updateLoanType: (data: { id: number; data: Partial<LoanType> }) => Promise<any>;
}

export default function AddLoanType({ 
  initialData, 
  onClose, 
  primaryColor,
  createLoanType,
  updateLoanType
}: Props) {
  const [formData, setFormData] = useState<Partial<LoanType>>({
    name: '',
    description: '',
    min_amount: '0',
    max_amount: '0',
    min_term: 0,
    max_term: 0,
    interest_rate: '0',
    payment_frequency: 'monthly',
    is_active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        min_amount: initialData.min_amount.toString(),
        max_amount: initialData.max_amount.toString(),
        interest_rate: initialData.interest_rate.toString()
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name) return 'Name is required';
    if (!formData.min_amount || parseFloat(formData.min_amount) < 0) return 'Minimum amount must be positive';
    if (!formData.max_amount || parseFloat(formData.max_amount) < parseFloat(formData.min_amount)) 
      return 'Maximum amount must be greater than minimum';
    if (!formData.min_term || formData.min_term < 1) return 'Minimum term must be at least 1 month';
    if (!formData.max_term || formData.max_term < formData.min_term) 
      return 'Maximum term must be greater than minimum';
    if (!formData.interest_rate || parseFloat(formData.interest_rate) < 0) 
      return 'Interest rate must be positive';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formattedData = {
        ...formData,
        min_amount: parseFloat(formData.min_amount as string),
        max_amount: parseFloat(formData.max_amount as string),
        interest_rate: parseFloat(formData.interest_rate as string)
      };

      if (initialData) {
        await updateLoanType({ id: initialData.id, data: formattedData });
      } else {
        await createLoanType(formattedData);
      }
      onClose();
    } catch (err) {
      setError('Failed to save loan type. Please try again.');
      console.error('Error saving loan type:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {initialData ? 'Edit Loan Type' : 'Create New Loan Type'}
          </h3>
          
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiX className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Loan Type Name*
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="min_amount" className="block text-sm font-medium text-gray-700">
                  Minimum Amount*
                </label>
                <input
                  type="number"
                  name="min_amount"
                  id="min_amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.min_amount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="max_amount" className="block text-sm font-medium text-gray-700">
                  Maximum Amount*
                </label>
                <input
                  type="number"
                  name="max_amount"
                  id="max_amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.max_amount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="min_term" className="block text-sm font-medium text-gray-700">
                  Minimum Term (months)*
                </label>
                <input
                  type="number"
                  name="min_term"
                  id="min_term"
                  required
                  min="1"
                  value={formData.min_term}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="max_term" className="block text-sm font-medium text-gray-700">
                  Maximum Term (months)*
                </label>
                <input
                  type="number"
                  name="max_term"
                  id="max_term"
                  required
                  min="1"
                  value={formData.max_term}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700">
                  Interest Rate (%)*
                </label>
                <input
                  type="number"
                  name="interest_rate"
                  id="interest_rate"
                  required
                  min="0"
                  step="0.01"
                  value={formData.interest_rate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="payment_frequency" className="block text-sm font-medium text-gray-700">
                  Payment Frequency*
                </label>
                <select
                  name="payment_frequency"
                  id="payment_frequency"
                  required
                  value={formData.payment_frequency}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active as boolean}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active Loan Type
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: primaryColor,
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <FiSave className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}