
'use client';
import { useEffect } from 'react';
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
import { useGetAllLoanTypesQuery } from '@/redux/api/loanTypeApiSlice';
import { useGetAllBranchesQuery } from '@/redux/api/branchApiSlice';
import { useGetAccountsByUserIdQuery } from "@/redux/api/accountApiSlice";
import { toast } from 'react-toastify';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useParams } from 'next/navigation';

const loanApplicationSchema = Yup.object().shape({
  loanTypeId: Yup.string().required('Loan type is required'),
  principalAmount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(1000, 'Minimum amount is $1,000')
    .max(50000, 'Maximum amount is $50,000'),
  termMonths: Yup.number()
    .required('Term is required')
    .integer('Term must be a whole number')
    .min(3, 'Minimum term is 3 months')
    .max(36, 'Maximum term is 36 months'),
  purpose: Yup.string()
    .max(500, 'Purpose cannot exceed 500 characters'),
  branch_id: Yup.string().required('Branch selection is required'),
  saving_account_id: Yup.string(),
});

const LoanApplicationForm = ({  onSuccess, primaryColor }) => {
 const params = useParams();
  const userId = params?.id;  const { 
    data: loanTypesData, 
    isLoading: loanTypesLoading,
    error: loanTypesError
  } = useGetAllLoanTypesQuery();
 
  const { 
    data: branchesData, 
    isLoading: branchesLoading,
    error: branchesError
  } = useGetAllBranchesQuery();
  
  const { 
    data: accountsData,
    isLoading: accountsLoading,
    error: accountsError
  } = useGetAccountsByUserIdQuery(userId);
  
  const [createLoanApplication, { isLoading: isSubmitting }] = useCreateLoanApplicationMutation();

  // Handle API errors
  useEffect(() => {
    if (loanTypesError) {
      toast.error('Failed to load loan types');
    }
    if (branchesError) {
      toast.error('Failed to load branches');
    }
    if (accountsError) {
      toast.error('Failed to load savings accounts');
    }
  }, [loanTypesError, branchesError, accountsError]);

  // Extract data from API responses
  const loanTypes = loanTypesData?.data?.loanTypes || [];
  const branches = branchesData?.data?.data || [];
  const savingsAccounts = accountsData || []; // Adjusted to properly access the accounts data

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
    onSubmit: async (values, { resetForm }) => {
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

        const response = await createLoanApplication(payload).unwrap();
        
        toast.success('Loan application submitted successfully!');
        resetForm();
        if (onSuccess) onSuccess(response);
      } catch (error) {
        toast.error(error.data?.message || 'Failed to submit application');
      }
    },
  });

  // Get min/max values for the selected loan type
  const selectedLoanType = loanTypes.find(type => type.id === Number(formik.values.loanTypeId));
  const minAmount = selectedLoanType?.min_amount ? parseFloat(selectedLoanType.min_amount) : 1000;
  const maxAmount = selectedLoanType?.max_amount ? parseFloat(selectedLoanType.max_amount) : 50000;
  const minTerm = selectedLoanType?.min_term ? parseInt(selectedLoanType.min_term) : 3;
  const maxTerm = selectedLoanType?.max_term ? parseInt(selectedLoanType.max_term) : 36;

  if (loanTypesLoading || branchesLoading || accountsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Apply for a New Loan</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Loan Type (Required) */}
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

        {/* Principal Amount (Required) */}
        <div>
          <label htmlFor="principalAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount *
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
              className={`block w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                formik.touched.principalAmount && formik.errors.principalAmount
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder={`Between $${minAmount.toLocaleString()} and $${maxAmount.toLocaleString()}`}
              required
            />
          </div>
          {formik.touched.principalAmount && formik.errors.principalAmount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {formik.errors.principalAmount}
            </p>
          )}
        </div>

        {/* Term Months (Required) */}
        <div>
          <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Term (months) *
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
              placeholder={`Between ${minTerm} and ${maxTerm} months`}
              required
            />
          </div>
          {formik.touched.termMonths && formik.errors.termMonths && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {formik.errors.termMonths}
            </p>
          )}
        </div>

        {/* Purpose (Optional) */}
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

        {/* Branch Selection (Required) */}
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

        {/* Savings Account Selection (Optional) */}
        {savingsAccounts?.length > 0 && (
          <div>
            <label htmlFor="saving_account_id" className="block text-sm font-medium text-gray-700 mb-1">
              Link to Savings Account 
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
                  {account.AccountNumber?.accountNumber} - {account.SavingType?.name} (Balance: ${account.balance?.toLocaleString()})
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
            disabled={isSubmitting || !formik.isValid}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitting || !formik.isValid
                ? 'bg-gray-400 cursor-not-allowed'
                : `hover:bg-${primaryColor}-700 focus:ring-${primaryColor}-500`
            }`}
            style={{
              backgroundColor: isSubmitting || !formik.isValid 
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