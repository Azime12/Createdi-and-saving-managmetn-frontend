'use client';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaSave, FaSpinner, FaTimes } from 'react-icons/fa';
import CInput from '@/app/components/CInput';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import CreateSavingAccount from './newAccount';
import { useGetAllSavingTypeQuery } from '@/redux/api/settingApiSlice';
import { useCreateAccountNumberMutation } from '@/redux/api/accountApiSlice';

interface GenerateAccountNumberProps {
  handleCloseModal: () => void;
  userId: string;
  primaryColor?: string;
  isOpen: boolean;
  onAccountCreated?: (accountNumber: string) => void;
}

const validationSchema = Yup.object().shape({
  accountNumber: Yup.string().when('autoGenerate', {
    is: false,
    then: (schema) =>
      schema
        .required('Account number is required')
        .matches(/^\d{10}$/, 'Account number must be 10 digits'),
    otherwise: (schema) => schema.notRequired(),
  }),
  autoGenerate: Yup.boolean(),
});

function GenerateAccountNumber({
  handleCloseModal,
  userId,
  primaryColor = '#3b82f6',
  isOpen,
  onAccountCreated,
}: GenerateAccountNumberProps) {
  const [createAccountNumber, { isLoading }] = useCreateAccountNumberMutation();
  const [isBrowser, setIsBrowser] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<string | null>(null);
  const [showSavingModal, setShowSavingModal] = useState(false);

  const { data: savingTypes = [] } = useGetAllSavingTypeQuery();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      accountNumber: '',
      autoGenerate: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        userId,
        accountNumber: values.accountNumber,
        autoGenerate: values.autoGenerate,
      };

      try {
        const response = await createAccountNumber(payload).unwrap();
        toast.success(response.message);
        
        // Ensure we're getting the account number from the response
        const accountNumber = response.accountNumber?.accountNumber;
        if (!accountNumber) {
          throw new Error('Account number not found in response');
        }
        
        setCreatedAccount(accountNumber);
        setShowSavingModal(true);
        
        // Optional: Call the callback if provided
        if (onAccountCreated) {
          onAccountCreated(accountNumber);
        }
      } catch (err: any) {
        toast.error(err?.data?.message || err?.message || 'Failed to create account number');
      }
    },
  });

  if (!isBrowser) return null;

  return (
    <>
      {/* Generate Account Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleCloseModal}
                aria-hidden="true"
              />

              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto flex flex-col"
                role="dialog"
                aria-modal="true"
              >
                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="h-5 w-5 text-gray-500" />
                </button>

                {/* Header */}
                <div className="pt-6 pb-3 border-b border-gray-200 px-6 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Generate Account Number
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {formik.values.autoGenerate
                      ? 'System will generate a unique account number automatically.'
                      : 'Enter a custom 10-digit account number.'}
                  </p>
                </div>

                {/* Form */}
                <div className="px-6 py-8">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="space-y-6 w-full max-w-md mx-auto"
                  >
                    {/* Checkbox */}
                    <div className="flex items-start">
                      <input
                        id="autoGenerate"
                        type="checkbox"
                        name="autoGenerate"
                        checked={formik.values.autoGenerate}
                        onChange={formik.handleChange}
                        className="w-4 h-4 mt-1 rounded"
                        style={{
                          accentColor: primaryColor,
                        }}
                      />
                      <label
                        htmlFor="autoGenerate"
                        className="ml-3 text-sm font-medium text-gray-700"
                      >
                        Auto-generate account number
                      </label>
                    </div>

                    {/* Input field */}
                    {!formik.values.autoGenerate && (
                      <CInput
                        label="Account Number"
                        name="accountNumber"
                        formik={formik}
                        required={!formik.values.autoGenerate}
                        type="text"
                        placeholder="Enter 10-digit account number"
                        primaryColor={primaryColor}
                        maxLength={10}
                      />
                    )}

                    {/* Submit */}
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md text-white transition ${
                          isLoading ? 'opacity-80' : ''
                        }`}
                        style={{
                          backgroundColor: primaryColor,
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
                            {createdAccount ? 'Re-Generate' : 'Create Account'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Saving Account Modal (triggered after account number generation) */}
      {createdAccount && showSavingModal && (
        <CreateSavingAccount
          isOpen={showSavingModal}
          handleCloseModal={() => {
            setShowSavingModal(false);
            handleCloseModal(); // Close both modals
          }}
          userId={userId}
          createdAccountNumber={createdAccount}
          savingTypes={savingTypes}
          primaryColor={primaryColor}
        />
      )}
    </>
  );
}

export default GenerateAccountNumber;