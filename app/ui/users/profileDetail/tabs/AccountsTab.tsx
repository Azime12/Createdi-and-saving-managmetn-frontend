'use client';

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import GenerateAccountNumber from "../generateAccountForUser";
import { useParams } from "next/navigation";
import { useGetAccountsByUserIdQuery } from "@/redux/api/accountApiSlice";
import DepositModal from "@/app/ui/Accounts/DepositModal";
import WithdrawModal from "@/app/ui/Accounts/WithdrawModal";

interface Account {
  id: string;
  balance: string;
  status: string;
  accountNumberId: string;
  createdAt: string;
  SavingType?: {
    id: number;
    name: string;
    interestRate: string;
    description: string;
  };
  AccountNumber?: {
    id: string;
    accountNumber: string;
  };
}

interface AccountsTabProps {
  formatCurrency: (amount: number) => string;
  primaryColor: string;
}

const AccountsTab = ({ formatCurrency, primaryColor }: AccountsTabProps) => {
  const params = useParams();
  const id = params?.id as string;

  const [showModal, setShowModal] = useState(false);
  const { data: accounts = [], isLoading, isError } = useGetAccountsByUserIdQuery(id);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  const handleOpenDeposit = (accountId: string) => {
    setSelectedAccountId(accountId);
    setShowDepositModal(true);
  };

  const handleOpenWithdraw = (accountId: string) => {
    setSelectedAccountId(accountId);
    setShowWithdrawModal(true);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">My Accounts</h2>
          {accounts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 text-sm mb-4">No accounts found.</p>
            </div>
          )}

          {accounts.map((account: Account) => {
            const balance = parseFloat(account.balance) || 0;
            const lastFourDigits = account.AccountNumber?.accountNumber?.slice(-4) ?? '••••';

            return (
              <div
                key={account.id}
                className="border rounded-lg p-4 mb-4 hover:shadow-md hover:border-gray-300 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">{account.SavingType?.name || 'Savings Account'}</p>
                    <p className="text-sm text-gray-500">•••• {lastFourDigits}</p>
                  </div>
                  <p className={`text-xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`} >
                    {formatCurrency(balance)}
                  </p>
                </div>

                <div className="flex space-x-4 mt-3">
                  <button
                    onClick={() => handleOpenDeposit(account.id)}
                    className="px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-opacity-80 transition"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => handleOpenWithdraw(account.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-opacity-80 transition"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <p className="text-gray-500 text-sm">Loading accounts...</p>
            </div>
          )}

          {isError && (
            <div className="flex justify-center items-center py-4">
              <p className="text-red-500 text-sm">Failed to load accounts. Please try again later.</p>
            </div>
          )}

          <button
            onClick={handleOpenModal}
            className="w-full mt-6 py-3 flex items-center justify-center text-white font-medium rounded-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 4px 6px -1px rgba(${hexToRgb(primaryColor)}, 0.1), 0 2px 4px -1px rgba(${hexToRgb(primaryColor)}, 0.06)`
            }}
          >
            <FiPlus className="mr-2" />
            Open New Account
          </button>
        </div>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        handleClose={() => setShowWithdrawModal(false)}
        accountId={selectedAccountId}
        formatCurrency={formatCurrency}
        primaryColor={primaryColor}
      />

      {/* Deposit Modal */}
      {showDepositModal && selectedAccountId && (
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          accountId={selectedAccountId}
          primaryColor={primaryColor}
        />
      )}

      {/* Generate Account Number Modal */}
      <GenerateAccountNumber
        userId={id}
        handleCloseModal={handleCloseModal}
        primaryColor={primaryColor}
        isOpen={showModal}
      />
    </>
  );
};

// Helper function to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246'; // fallback color (blue-500)
}

export default AccountsTab;