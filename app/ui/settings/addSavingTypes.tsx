'use client';
import React from 'react';
import CInput from '@/app/components/CInput';
import { useFormik } from 'formik';
import { FaSave } from 'react-icons/fa';
import * as Yup from 'yup';
import {
  useCreateLoanTypeMutation,
useUpdateLoanTypeMutation} from '@/redux/api/loanTypeApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import  {useCreateSavingTypesMutation,useUpdateSavingTypesMutation} from "@/redux/api/settingApiSlice"

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Saving type name is required'),
  description: Yup.string().required('Description is required'),
  interestRate: Yup.number()
    .required('Interest rate is required')
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate cannot exceed 100%'),
  minBalance: Yup.number()
    .required('Minimum balance is required')
    .min(0, 'Minimum balance cannot be negative'),
  withdrawalLimit: Yup.number()
    .required('Withdrawal limit is required')
    .min(0, 'Withdrawal limit cannot be negative'),
  tenureInMonths: Yup.number()
    .required('Tenure is required')
    .min(0, 'Minimum tenure is 1 month'),
  penaltyRate: Yup.number()
    .required('Penalty rate is required')
    .min(0, 'Penalty rate cannot be negative')
    .max(100, 'Penalty rate cannot exceed 100%'),
});

interface SavingType {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minBalance: number;
  withdrawalLimit: number;
  tenureInMonths: number;
  penaltyRate: number;
}

interface AddSavingTypesProps {
  initialData?: SavingType | null;
  onClose: () => void;
  primaryColor?: string;
}

function AddSavingTypes({ initialData, onClose,handleCloseModal, primaryColor = '#3b82f6' }: AddSavingTypesProps) {
  const isEditing = !!initialData;
  const [createSavingType, { isLoading: isCreating }] = useCreateSavingTypesMutation();
  const [updateSavingType, { isLoading: isUpdating }] = useUpdateSavingTypesMutation();
  const isLoading = isCreating || isUpdating;

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      interestRate: initialData?.interestRate?.toString() || '',
      minBalance: initialData?.minBalance?.toString() || '',
      withdrawalLimit: initialData?.withdrawalLimit?.toString() || '',
      tenureInMonths: initialData?.tenureInMonths?.toString() || '',
      penaltyRate: initialData?.penaltyRate?.toString() || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        description: values.description,
        interestRate: parseFloat(values.interestRate),
        minBalance: parseFloat(values.minBalance),
        withdrawalLimit: parseFloat(values.withdrawalLimit),
        tenureInMonths: parseInt(values.tenureInMonths),
        penaltyRate: parseFloat(values.penaltyRate),
      };

      try {
        if (isEditing && initialData?.id) {
          console.log("data:",payload)
          await updateSavingType({ 
            id: initialData.id, 
            data: payload 
          }).unwrap();
          toast.success('Saving type updated successfully!');
          handleCloseModal()
        } else {
          await createSavingType(payload).unwrap();
          toast.success('Saving type created successfully!');
          handleCloseModal()

        }
        handleCloseModal()

      } catch (err: any) {
        if (err?.data?.message) {
          toast.error(err.data.message);
        } else if (err?.status === 400 && err?.data?.errors) {
          // Backend validation errors
          const messages = Object.values(err.data.errors).flat();
          messages.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error('An error occurred. Please try again.');
        }
        console.error('Submission error:', err);
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Savings Type' : 'Add New Savings Type'}
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <CInput
            label="Saving Type Name"
            required={true}
            name="name"
            type="text"
            formik={formik}
            primaryColor={primaryColor}
            placeholder="Enter saving type name"
          />
        </div>

        <div className="mb-6">
          <CInput
            label="Description"
            required={true}
            name="description"
            type="textarea"
            formik={formik}
            primaryColor={primaryColor}
            placeholder="Enter description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CInput
            label="Interest Rate (%)"
            required={true}
            name="interestRate"
            type="number"
            formik={formik}
            primaryColor={primaryColor}
            placeholder="Enter interest rate"
            rightIcon={<span>%</span>}
          />
          <CInput
            label="Minimum Balance"
            required={true}
            name="minBalance"
            type="number"
            formik={formik}
            primaryColor={primaryColor}
            placeholder="Enter minimum balance"
            rightIcon={<span>$</span>}
          />
          <CInput
            label="Withdrawal Limit"
            required={true}
            name="withdrawalLimit"
            type="number"
            formik={formik}
            primaryColor={primaryColor}
            placeholder="Enter withdrawal limit"
          />
          <CInput
            label="Tenure (Months)"
            required={true}
            name="tenureInMonths"
            type="number"
            formik={formik}
            primaryColor={primaryColor}
            placeholder="Enter tenure in months"
          />
          <CInput
            label="Penalty Rate (%)"
            required={true}
            name="penaltyRate"
            type="number"
            formik={formik}
            primaryColor={primaryColor}
            placeholder="Enter penalty rate"
            rightIcon={<span>%</span>}
          />
        </div>

        <div className="mt-6 flex gap-4">
        
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: primaryColor,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <FaSave className="mr-2 h-4 w-4" />
            {isLoading
              ? 'Saving...'
              : isEditing
              ? 'Update Saving Type'
              : 'Save Saving Type'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSavingTypes;