'use client';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  FiDollarSign, 
  FiCalendar, 
  FiAlertCircle 
} from 'react-icons/fi';
import { 
  useCreateLoanApplicationMutation,
} from '@/redux/api/loanApplicationApiSlice';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useParams } from 'next/navigation';
import { useGetAllBranchesQuery } from '@/redux/api/branchApiSlice';
import { useGetAccountsByUserIdQuery } from '@/redux/api/accountApiSlice';
import { useGetAllLoanTypesQuery } from '@/redux/api/loanTypeApiSlice';

const loanApplicationSchema = Yup.object().shape({
  loanTypeId: Yup.string().required('Loan type is required'),
  principalAmount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  termMonths: Yup.number()
    .required('Term is required')
    .integer('Term must be a whole number'),
  purpose: Yup.string()
    .max(500, 'Purpose cannot exceed 500 characters'),
  branch_id: Yup.string().required('Branch selection is required'),
  saving_account_id: Yup.string(),
});

const LoanApplicationForm = ({ onSuccess, primaryColor = '#3B82F6' }) => {
  const params = useParams();
  const userId = params?.id;
  const [formReady, setFormReady] = useState(false);

  // API Queries
  const { 
    data: loanTypesData, 
    isLoading: loanTypesLoading,
    error: loanTypesError,
    isSuccess: loanTypesSuccess
  } = useGetAllLoanTypesQuery();
 
  const { 
    data: branchesData, 
    isLoading: branchesLoading,
    error: branchesError,
    isSuccess: branchesSuccess
  } = useGetAllBranchesQuery();
  
  const { 
    data: accountsData,
    isLoading: accountsLoading,
    error: accountsError,
    isSuccess: accountsSuccess
  } = useGetAccountsByUserIdQuery(userId);
  
  const [createLoanApplication, { isLoading: isSubmitting }] = useCreateLoanApplicationMutation();

  // Check if all data is loaded
  useEffect(() => {
    if (loanTypesSuccess && branchesSuccess && accountsSuccess) {
      setFormReady(true);
    }
  }, [loanTypesSuccess, branchesSuccess, accountsSuccess]);

  // Handle API errors
  useEffect(() => {
    if (loanTypesError) {
      toast.error('Failed to load loan types. Please try again later.');
      console.error('Loan types error:', loanTypesError);
    }
    if (branchesError) {
      toast.error('Failed to load branches. Please try again later.');
      console.error('Branches error:', branchesError);
    }
    if (accountsError) {
      toast.error('Failed to load accounts. You can still proceed without linking an account.');
      console.error('Accounts error:', accountsError);
    }
  }, [loanTypesError, branchesError, accountsError]);

  // Extract data from API responses
  const loanTypes = loanTypesData?.data?.loanTypes || [];
  const branches = branchesData?.data?.data || []; // Adjusted based on your branch API structure
  const savingsAccounts = accountsData?.data || []; // Adjusted based on your accounts API
// console.log("branches",branches)
  // Formik setup
  const formik = useFormik({
    initialValues: {
      loanTypeId: '',
      principalAmount: '',
      termMonths: '',
      purpose: '',
      branch_id: '',
      saving_account_id: '',
      customerId: userId
    },
    validationSchema: loanApplicationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          customerId: userId,
          loanTypeId: Number(values.loanTypeId),
          principalAmount: Number(values.principalAmount),
          termMonths: Number(values.termMonths),
          purpose: values.purpose || null,
          branch_id: values.branch_id,
          saving_account_id: values.saving_account_id || null,
        };

        console.log('Submitting payload:', payload); // Debug log

        const response = await createLoanApplication(payload).unwrap();
        
        toast.success('Loan application submitted successfully!');
        resetForm();
        if (onSuccess) onSuccess(response);
      } catch (error) {
        console.error('Submission error:', error);
        toast.error(error.data?.message || 'Failed to submit application. Please check your details and try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Get min/max values for the selected loan type
  const selectedLoanType = loanTypes.find(type => type.id === Number(formik.values.loanTypeId));
  const minAmount = selectedLoanType?.min_amount ? parseFloat(selectedLoanType.min_amount) : 0;
  const maxAmount = selectedLoanType?.max_amount ? parseFloat(selectedLoanType.max_amount) : Infinity;
  const minTerm = selectedLoanType?.min_term ? parseInt(selectedLoanType.min_term) : 0;
  const maxTerm = selectedLoanType?.max_term ? parseInt(selectedLoanType.max_term) : Infinity;

  // Update validation based on selected loan type
  useEffect(() => {
    if (selectedLoanType) {
      formik.setFieldValue('principalAmount', '');
      formik.setFieldValue('termMonths', '');
    }
  }, [formik.values.loanTypeId]);

  if (loanTypesLoading && branchesLoading && accountsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
        <span className="ml-2">Loading form data...</span>
      </div>
    );
  }

  if (!formReady) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="text-center py-8">
          <FiAlertCircle className="mx-auto text-4xl text-yellow-500" />
          <h3 className="mt-4 text-lg font-medium">Loading Form Data</h3>
          <p className="mt-2 text-sm text-gray-600">
            We're preparing your loan application form. Please wait...
          </p>
          {(loanTypesError || branchesError || accountsError) && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry Loading
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Apply for a New Loan</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Loan Type */}
        <div>
          <label htmlFor="loanTypeId" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Type *
          </label>
          <select
            id="loanTypeId"
            name="loanTypeId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.loanTypeId}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
              formik.touched.loanTypeId && formik.errors.loanTypeId
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required
          >
            <option value="">Select a loan type</option>
            {loanTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} ({type.interest_rate}% interest)
              </option>
            ))}
          </select>
          {formik.touched.loanTypeId && formik.errors.loanTypeId && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {formik.errors.loanTypeId}
            </p>
          )}
        </div>

        {/* Principal Amount */}
        <div>
          <label htmlFor="principalAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount * (Range: ${minAmount} - ${maxAmount})
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-gray-400" />
            </div>
            <input
              type="number"
              id="principalAmount"
              name="principalAmount"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.principalAmount}
              min={minAmount}
              max={maxAmount}
              step="0.01"
              className={`block w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                formik.touched.principalAmount && formik.errors.principalAmount
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder={`Enter amount between $${minAmount} and $${maxAmount}`}
              required
            />
          </div>
          {formik.touched.principalAmount && formik.errors.principalAmount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {formik.errors.principalAmount}
            </p>
          )}
        </div>

        {/* Term Months */}
        <div>
          <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Term (months) * (Range: {minTerm} - {maxTerm} months)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="number"
              id="termMonths"
              name="termMonths"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.termMonths}
              min={minTerm}
              max={maxTerm}
              className={`block w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                formik.touched.termMonths && formik.errors.termMonths
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder={`Enter term between ${minTerm} and ${maxTerm} months`}
              required
            />
          </div>
          {formik.touched.termMonths && formik.errors.termMonths && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {formik.errors.termMonths}
            </p>
          )}
        </div>

        {/* Purpose */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
            Purpose of Loan
          </label>
          <textarea
            id="purpose"
            name="purpose"
            rows={3}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.purpose}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
              formik.touched.purpose && formik.errors.purpose
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Describe what you'll use the loan for (optional)"
          />
          {formik.touched.purpose && formik.errors.purpose && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {formik.errors.purpose}
            </p>
          )}
        </div>

        {/* Branch Selection */}
        {branchesLoading ? (
  <p>Loading branches...</p>
) : branchesError ? (
  <p className="text-red-600">Failed to load branches</p>
) : (
  <div>
    <label htmlFor="branch_id" className="block text-sm font-medium text-gray-700 mb-1">
      Preferred Branch *
    </label>
    <select
      id="branch_id"
      name="branch_id"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.branch_id}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
        formik.touched.branch_id && formik.errors.branch_id
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      }`}
      required
    >
      <option value="">Select a branch</option>
      {branches.map((branch) => (
        <option key={branch.id} value={branch.id}>
          {branch.branchName} - {branch.city}, {branch.state}
        </option>
      ))}
    </select>
    {formik.touched.branch_id && formik.errors.branch_id && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <FiAlertCircle className="mr-1" /> {formik.errors.branch_id}
      </p>
    )}
  </div>
)}


        {savingsAccounts.length > 0 && (
          <div>
            <label htmlFor="saving_account_id" className="block text-sm font-medium text-gray-700 mb-1">
              Link to Savings Account (Optional)
            </label>
            <select
              id="saving_account_id"
              name="saving_account_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.saving_account_id}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                formik.touched.saving_account_id && formik.errors.saving_account_id
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="">Select a savings account (optional)</option>
              {savingsAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.AccountNumber?.accountNumber} - {account.SavingType?.name} (Balance: ${account.balance})
                </option>
              ))}
            </select>
            {formik.touched.saving_account_id && formik.errors.saving_account_id && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" /> {formik.errors.saving_account_id}
              </p>
            )}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting || !formik.isValid || !formik.dirty}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitting || !formik.isValid || !formik.dirty
                ? 'bg-gray-400 cursor-not-allowed'
                : `bg-${primaryColor}-600 hover:bg-${primaryColor}-700 focus:ring-${primaryColor}-500`
            }`}
            style={{
              backgroundColor: isSubmitting || !formik.isValid || !formik.dirty 
                ? '#9CA3AF' 
                : primaryColor
            }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm;