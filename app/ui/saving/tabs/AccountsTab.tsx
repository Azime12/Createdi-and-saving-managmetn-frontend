'use client';
import { useState } from 'react';
import { 
  FiPlus, FiSearch, FiDownload, FiDollarSign, 
  FiTrendingUp, FiUser, FiFilter, FiRefreshCw 
} from 'react-icons/fi';
import { 
  useGetAllAccountsQuery,
  useDepositToAccountMutation,
  useWidthdrawFromAccountMutation,
  useTransferBetweenAccountsMutation,
  useUpdateAccountStatusMutation,
} from '@/redux/api/accountApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { formatCurrency, formatDate, getStatusBadge } from '../helpers';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllSavingTypeQuery } from '@/redux/api/settingApiSlice';

// Components
import DepositModal from "@/app/ui/Accounts/DepositModal";
import WithdrawModal from "@/app/ui/Accounts/WithdrawModal";
import TransferModal from "@/app/ui/Accounts/TransferModal";
import StatusUpdateModal from "@/app/ui/Accounts/StatusUpdateModal";

interface Account {
  id: string;
  userId: string;
  accountNumberId: string;
  savingTypeId: number;
  balance: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  SavingType?: {
    id: number;
    name: string;
    interestRate: string;
    minBalance: string;
    withdrawalLimit: number;
    penaltyRate: string;
  };
  AccountNumber?: {
    id: string;
    accountNumber: string;
  };
}

const AccountsTab = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  // RTK Query hooks
  const { data: accountsResponse, isLoading, isError, refetch } = useGetAllAccountsQuery();
  const { data: savingTypes = [] } = useGetAllSavingTypeQuery();
  const [deposit] = useDepositToAccountMutation();
  const [withdraw] = useWidthdrawFromAccountMutation();
  const [transfer] = useTransferBetweenAccountsMutation();
  const [updateStatus] = useUpdateAccountStatusMutation();

  const accounts = accountsResponse?.data || [];

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter((account: Account) => {
    const matchesSearch = 
      account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.AccountNumber?.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.SavingType?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' || account.status === statusFilter;

    const matchesType = 
      typeFilter === 'ALL' || account.SavingType?.id.toString() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Account actions
  const handleDeposit = async (amount: number) => {
    if (!selectedAccount) return;
    try {
      await deposit({ 
        accountId: selectedAccount.id, 
        amount,
        userId: selectedAccount.userId,
      }).unwrap();
      toast.success('Deposit successful!');
      refetch();
      setShowDepositModal(false);
    } catch (error: any) {
      toast.error(error.data?.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (amount: number) => {
    if (!selectedAccount) return;
    try {
      await withdraw({ 
        accountId: selectedAccount.id, 
        amount,
        userId: selectedAccount.userId,
      }).unwrap();
      toast.success('Withdrawal successful!');
      refetch();
      setShowWithdrawModal(false);
    } catch (error: any) {
      toast.error(error.data?.message || 'Withdrawal failed');
    }
  };



  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedAccount) return;
    try {
      await updateStatus({ 
        accountId: selectedAccount.id, 
        status: newStatus,
        userId: selectedAccount.userId,
      }).unwrap();
      toast.success('Status updated!');
      refetch();
      setShowStatusModal(false);
    } catch (error: any) {
      toast.error(error.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold">
{formatCurrency(
  accounts.reduce((sum: number, acc: Account) => sum + parseFloat(acc.balance), 0)
)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiTrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Accounts</p>
              <p className="text-2xl font-bold">
                {accounts.filter((a: Account) => a.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiUser className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Types</p>
              <p className="text-2xl font-bold">
                {new Set(accounts.map((a: Account) => a.SavingType?.id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <FiFilter className="mr-2 text-gray-500" />
              <select
                className="bg-transparent text-sm focus:outline-none focus:ring-0"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <select
                className="bg-transparent text-sm focus:outline-none focus:ring-0"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                {savingTypes.map((type: any) => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading accounts...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                    Failed to load accounts
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No accounts found
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account: Account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FiDollarSign className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {account.AccountNumber?.accountNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            Opened: {formatDate(account.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(parseFloat(account.balance))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.SavingType?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(account.status)}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDepositModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowWithdrawModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Withdraw
                      </button>
                     
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowStatusModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        selectedAccount={selectedAccount}
        onDeposit={handleDeposit}
        formatCurrency={formatCurrency}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        selectedAccount={selectedAccount}
        onWithdraw={handleWithdraw}
        formatCurrency={formatCurrency}
      />

      

      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={selectedAccount?.status || 'ACTIVE'}
        onUpdate={handleStatusUpdate}
      />
 </div>
  );
};

export default AccountsTab;