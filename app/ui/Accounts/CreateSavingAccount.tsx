'use client';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaSave, FaSpinner, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import CInput from '@/app/components/CInput';
import { toast } from 'react-toastify';
import { useCreateAccoutMutation } from '@/redux/api/accountApiSlice';

interface CreateSavingAccountProps {
  handleCloseModal: () => void;
  userId: string;
  createdAccountNumber: any;
  savingTypes: { id: string; name: string }[];
  primaryColor?: string;
  isOpen: boolean;
}

const validationSchema = Yup.object().shape({
  savingTypeId: Yup.string().required('Saving type is required'),
  balance: Yup.number()
    .min(0, 'Balance must be 0 or more')
    .required('Initial balance is required'),
});

function CreateSavingAccount({
  handleCloseModal,
  userId,
  createdAccountNumber,
  savingTypes,
  primaryColor = '#3b82f6',
  isOpen,
}: CreateSavingAccountProps) {
  const [createSavingAccount, { isLoading }] = useCreateAccoutMutation();
  const [isBrowser, setIsBrowser] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<any>(null);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      savingTypeId: '',
      balance: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          userId,
          accountNumberId:createdAccountNumber?.id,
          savingTypeId: values.savingTypeId,
          balance: parseFloat(values.balance),
        };
        const response = await createSavingAccount(payload).unwrap();
        toast.success('Saving account created successfully!');
        setCreatedAccount(response);
      } catch (err: any) {
        toast.error(err?.data?.error || 'Failed to create saving account');
      }
    },
  });

  if (!isBrowser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={handleCloseModal}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto flex flex-col"
            >
<div className="pt-6 pb-3 border-b border-gray-200 px-6 text-center">
  <h2 className="text-xl font-semibold text-gray-800">Create Saving Account</h2>
  <p className="text-sm text-gray-500 mt-1">
    Choose a saving type and enter the initial balance.
  </p>
</div>

{createdAccountNumber && (
  <div className="px-6 pt-4 pb-2 text-sm text-gray-700">
    <p className="bg-gray-100 p-3 rounded-md border border-gray-300 text-center">
      <strong>Generated Account Number:</strong> {createdAccountNumber?.accountNumber}
    </p>
  </div>
)}



              {/* Form */}
              <div className="px-6 py-8">
                <form onSubmit={formik.handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
                  <div>
                    <label htmlFor="savingTypeId" className="block text-sm font-medium text-gray-700 mb-1">
                      Saving Type
                    </label>
                    <select
                      id="savingTypeId"
                      name="savingTypeId"
                      value={formik.values.savingTypeId}
                      onChange={formik.handleChange}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      style={{ borderColor: primaryColor }}
                    >
                      <option value="">Select saving type</option>
                      {savingTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.savingTypeId && formik.errors.savingTypeId && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.savingTypeId}</p>
                    )}
                  </div>

                  <CInput
                    label="Initial Balance"
                    name="balance"
                    type="number"
                    placeholder="0.00"
                    formik={formik}
                    primaryColor={primaryColor}
                  />

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none transition-colors ${
                        isLoading ? 'opacity-80' : ''
                      }`}
                      style={{
                        backgroundColor: primaryColor,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2 h-4 w-4" />
                          {createdAccount ? 'Re-Create Account' : 'Create Saving Account'}
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Success Info */}
                {createdAccount && (
                  <div className="mt-6 bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
                    <h4 className="font-semibold mb-2" style={{ color: primaryColor }}>
                      Saving account created!
                    </h4>
                    <p><strong>ID:</strong> {createdAccount.id}</p>
                    <p><strong>Balance:</strong> {createdAccount.balance}</p>
                    <button
                      onClick={handleCloseModal}
                      className="mt-4 px-4 py-2 bg-white border rounded-md shadow text-sm font-medium hover:bg-gray-50"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CreateSavingAccount;
