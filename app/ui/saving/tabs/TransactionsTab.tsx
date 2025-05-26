'use client';
import { useState } from 'react';
import { FiArrowUp, FiDownload } from 'react-icons/fi';
import { useGetAccountsByUserIdQuery } from '@/redux/api/accountApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
// import TransferModal from '../modals/TransferModal';
import { formatCurrency, formatDate } from '../helpers';

const TransactionsTab = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30days');

  const { data: accounts, isLoading } = useGetAccountsByUserIdQuery(userInfo?.id || '');

  // Combine all transactions from all accounts
  const allTransactions = accounts?.flatMap((account: any) => 
    account.transactions?.map((txn: any) => ({
      ...txn,
      accountNumber: account.accountNumber?.accountNumber,
      accountType: account.savingType?.name
    }))
  ) || [];

  // Filter transactions by time range
  const filteredTransactions = allTransactions.filter((txn: any) => {
    const txnDate = new Date(txn.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (timeRange === '30days') return diffDays <= 30;
    if (timeRange === '90days') return diffDays <= 90;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-xl font-bold">{filteredTransactions.length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Deposits</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(
                filteredTransactions
                  .filter((t: any) => t.type === 'DEPOSIT')
                  .reduce((sum: number, t: any) => sum + t.amount, 0)
              )}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Withdrawals</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(
                filteredTransactions
                  .filter((t: any) => t.type === 'WITHDRAWAL')
                  .reduce((sum: number, t: any) => sum + t.amount, 0)
              )}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Avg. Monthly Activity</p>
            <p className="text-xl font-bold">
              {Math.round(filteredTransactions.length / (timeRange === '30days' ? 1 : timeRange === '90days' ? 3 : 12))}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="time-range" className="sr-only">Time Range</label>
              <select
                id="time-range"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTransferModal(true)}
              className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowUp className="mr-2 h-4 w-4" />
              New Transfer
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FiDownload className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((txn: any) => (
                <tr key={txn.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(txn.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {txn.description || 
                      (txn.type === 'INTEREST' ? 'Interest Payment' : 
                       txn.type === 'DEPOSIT' ? 'Deposit' : 
                       txn.type === 'WITHDRAWAL' ? 'Withdrawal' : 
                       txn.type === 'TRANSFER' ? 'Transfer' : 'Transaction')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {txn.accountNumber} ({txn.accountType})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="capitalize">{txn.type.toLowerCase()}</span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                    txn.type === 'DEPOSIT' || txn.type === 'INTEREST' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formatCurrency(txn.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Modal */}
      {/* <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        accounts={accounts || []}
      /> */}
    </div>
  );
};

export default TransactionsTab;