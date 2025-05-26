'use client';
import { useState } from 'react';
import { 
  FiPlus, 
  FiClock, 
  FiCheck, 
  FiX, 
  FiHome,
  FiUser,
  FiDollarSign,
  FiInfo,
  FiFileText
} from 'react-icons/fi';
import { useGetLoanApplicationByUserIdQuery } from '@/redux/api/loanApplicationApiSlice';
import LoanApplicationForm from './LoanApplicationForm';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Car } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetLoansByCustomerIdQuery } from '@/redux/api/loanApiSlice';
import LoanDetails from '@/app/ui/loan/tabs/LoanDetails';
import PaymentForm from '@/app/ui/loan/tabs/PaymentForm';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogActions,
  Button
} from '@mui/material';

const LoansTab = ({ userData, formatCurrency, formatDate, primaryColor }) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const params = useParams();
  const id = params?.id as string;
  const userId = id;

  // Fetch loan applications
  const { 
    data: applicationsData, 
    isLoading: applicationsLoading,
    refetch: refetchApplications
  } = useGetLoanApplicationByUserIdQuery(userId);
  
  // Fetch loans
  const { data: loans, isLoading: loanLoading, refetch: refetchLoans } = useGetLoansByCustomerIdQuery(userId);
  
  const applications = applicationsData?.data || [];
  const loanList = loans?.data || [];

  const handleApplicationSuccess = () => {
    refetchApplications();
    refetchLoans();
    setShowApplicationForm(false);
  };

  const handlePaymentSuccess = () => {
    refetchLoans();
    setShowPaymentForm(false);
  };

  const handleViewLoanDetails = (loan) => {
    setSelectedLoan(loan);
    setShowLoanDetails(true);
  };

  const handleMakePayment = (loan) => {
    setSelectedLoan(loan);
    setShowPaymentForm(true);
  };

  if (applicationsLoading || loanLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Loans</h2>
          <button
            onClick={() => setShowApplicationForm(!showApplicationForm)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              showApplicationForm
                ? 'bg-gray-100 text-gray-700'
                : `text-white hover:bg-${primaryColor}-700`
            }`}
            style={{
              backgroundColor: showApplicationForm 
                ? '#F3F4F6' 
                : primaryColor
            }}
          >
            <FiPlus />
            {showApplicationForm ? 'Cancel' : 'Apply for New Loan'}
          </button>
        </div>

        {showApplicationForm && (
          <LoanApplicationForm 
            userId={userData.id} 
            onSuccess={handleApplicationSuccess}
            primaryColor={primaryColor}
          />
        )}

        {/* Loan Applications Section */}
        {applications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3">Your Loan Applications</h3>
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        {app.LoanType?.name === 'Mortgage' && <FiHome className="text-blue-500" />}
                        {app.LoanType?.name === 'Auto' && <Car className="text-green-500" size={16} />}
                        {app.LoanType?.name === 'Personal' && <FiUser className="text-purple-500" />}
                        <p className="font-medium">{app.LoanType?.name || 'Loan'}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Application #{app.id}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {app.status === 'pending' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FiClock className="mr-1" />
                          Pending
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheck className="mr-1" />
                          Approved
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiX className="mr-1" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Amount</p>
                      <p className="font-medium">{formatCurrency(app.principalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Term</p>
                      <p className="font-medium">{app.termMonths} months</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Interest Rate</p>
                      <p className="font-medium">{app.LoanType?.interest_rate || 'N/A'}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Applied On</p>
                      <p className="font-medium">{formatDate(app.createdAt)}</p>
                    </div>
                  </div>
                  {app.purpose && (
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">Purpose</p>
                      <p className="font-medium">{app.purpose}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Loans Section */}
        <div className="space-y-4">
          <h3 className="text-md font-medium mb-3">Your Active Loans</h3>
          {loanLoading && <p>Loading loans...</p>}
          {loanList && loanList.length > 0 ? (
            loanList.map((loan) => (
              <div
                key={loan.id}
                className="border rounded-lg p-4 hover:border-orange-500 transition hover:shadow-md"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">{loan.loanType?.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">Loan #{loan.loanNumber}</p>
                    <p className="text-sm text-gray-400">
                      Customer: {loan.customer?.firstName} {loan.customer?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-600 font-bold">
                      {formatCurrency(loan.balance)}
                    </p>
                    <p className="text-sm text-gray-500">
                      of {formatCurrency(loan.principalAmount)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Interest Rate</p>
                    <p className="font-medium">{(parseFloat(loan.interestRate) * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Due Date</p>
                    <p className="font-medium">
                      {formatDate(loan.dueDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Term</p>
                    <p className="font-medium">{loan.termMonths} months</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <button 
                      onClick={() => handleViewLoanDetails(loan)}
                      className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border hover:bg-gray-100 transition"
                    >
                      <FiInfo size={14} />
                      Details
                    </button>
                    {loan.status === 'active' && (
                      <button 
                        onClick={() => handleMakePayment(loan)}
                        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg hover:bg-orange-700 transition"
                        style={{ backgroundColor: primaryColor, color: 'white' }}
                      >
                        <FiDollarSign size={14} />
                        Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have any active loans</p>
            </div>
          )}
        </div>
      </div>

      {/* Loan Details Dialog */}
      <Dialog
        open={showLoanDetails}
        onClose={() => setShowLoanDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2">
          <FiFileText className="text-blue-500" />
          Loan Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedLoan && (
            <LoanDetails 
              loan={selectedLoan} 
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              primaryColor={primaryColor}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoanDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Form Dialog */}
      <Dialog
        open={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2">
          <FiDollarSign className="text-green-500" />
          Make Payment
        </DialogTitle>
        <DialogContent dividers>
          {selectedLoan && (
            <PaymentForm 
              loanNumber={selectedLoan?.loanNumber}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentForm(false)}
              primaryColor={primaryColor}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoansTab;