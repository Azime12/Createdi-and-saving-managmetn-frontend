'use client';
import { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import { LoanType } from '@/types';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface Props {
  initialData: LoanType | null;
  onClose: () => void;
  primaryColor: string;
  createLoanType: (data: Partial<LoanType>) => Promise<any>;
  updateLoanType: (data: { id: number; data: Partial<LoanType> }) => Promise<any>;
}

// Yup validation schema
const loanTypeSchema = Yup.object().shape({
  name: Yup.string().required('Loan type name is required'),
  description: Yup.string(),
  min_amount: Yup.number()
    .typeError('Minimum amount must be a number')
    .min(0, 'Minimum amount must be positive')
    .required('Minimum amount is required'),
  max_amount: Yup.number()
    .typeError('Maximum amount must be a number')
    .min(Yup.ref('min_amount'), 'Maximum amount must be greater than minimum')
    .required('Maximum amount is required'),
  min_term: Yup.number()
    .typeError('Minimum term must be a number')
    .min(1, 'Minimum term must be at least 1 month')
    .required('Minimum term is required'),
  max_term: Yup.number()
    .typeError('Maximum term must be a number')
    .min(Yup.ref('min_term'), 'Maximum term must be greater than minimum')
    .required('Maximum term is required'),
  interest_rate: Yup.number()
    .typeError('Interest rate must be a number')
    .min(0, 'Interest rate must be positive')
    .required('Interest rate is required'),
  payment_frequency: Yup.string().required('Payment frequency is required'),
  is_active: Yup.boolean(),
});

export default function AddLoanType({ 
  initialData, 
  onClose, 
  primaryColor,
  createLoanType,
  updateLoanType
}: Props) {
  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      min_amount: initialData?.min_amount.toString() || '0',
      max_amount: initialData?.max_amount.toString() || '0',
      min_term: initialData?.min_term || 0,
      max_term: initialData?.max_term || 0,
      interest_rate: initialData?.interest_rate.toString() || '0',
      payment_frequency: initialData?.payment_frequency || 'monthly',
      is_active: initialData?.is_active || true,
    },
    validationSchema: loanTypeSchema,
    onSubmit: async (values) => {
      try {
        const formattedData = {
          name: values.name,
          description: values.description,
          interest_rate: parseFloat(values.interest_rate),
          min_term: parseInt(values.min_term.toString(), 10),
          max_term: parseInt(values.max_term.toString(), 10),
          payment_frequency: values.payment_frequency,
          min_amount: parseFloat(values.min_amount),
          max_amount: parseFloat(values.max_amount),
          is_active: values.is_active,
        };

        if (initialData) {
          await updateLoanType({ id: initialData.id, data: formattedData });
        } else {
          await createLoanType(formattedData);
        }

        onClose();
      } catch (err) {
        formik.setStatus('Failed to save loan type. Please try again.');
        console.error('Error saving loan type:', err);
      }
    },
  });

  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {initialData ? 'Edit Loan Type' : 'Create New Loan Type'}
          </h3>
          
          {formik.status && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiX className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{formik.status}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6">
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
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${
                    formik.touched.name && formik.errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  value={formik.values.min_amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${
                    formik.touched.min_amount && formik.errors.min_amount ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                {formik.touched.min_amount && formik.errors.min_amount && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.min_amount}</p>
                )}
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
                  value={formik.values.max_amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${
                    formik.touched.max_amount && formik.errors.max_amount ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                {formik.touched.max_amount && formik.errors.max_amount && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.max_amount}</p>
                )}
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
                  value={formik.values.min_term}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${
                    formik.touched.min_term && formik.errors.min_term ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                {formik.touched.min_term && formik.errors.min_term && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.min_term}</p>
                )}
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
                  value={formik.values.max_term}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${
                    formik.touched.max_term && formik.errors.max_term ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                {formik.touched.max_term && formik.errors.max_term && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.max_term}</p>
                )}
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
                  value={formik.values.interest_rate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${
                    formik.touched.interest_rate && formik.errors.interest_rate ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                {formik.touched.interest_rate && formik.errors.interest_rate && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.interest_rate}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="payment_frequency" className="block text-sm font-medium text-gray-700">
                  Payment Frequency*
                </label>
                <select
                  name="payment_frequency"
                  id="payment_frequency"
                  required
                  value={formik.values.payment_frequency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full border ${
                    formik.touched.payment_frequency && formik.errors.payment_frequency ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
                {formik.touched.payment_frequency && formik.errors.payment_frequency && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.payment_frequency}</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formik.values.is_active}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                disabled={formik.isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: primaryColor,
                  opacity: formik.isSubmitting ? 0.7 : 1
                }}
              >
                <FiSave className="mr-2 h-4 w-4" />
                {formik.isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}