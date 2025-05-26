'use client';
import { useGetAccountsByUserIdQuery } from '@/redux/api/accountApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { formatCurrency } from '../helpers';

const GoalsTab = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { data: accounts, isLoading } = useGetAccountsByUserIdQuery(userInfo?.id || '');

  // Filter accounts with goals
  const accountsWithGoals = accounts?.filter((account: any) => account.goal) || [];

  // Calculate overall progress
  const totalGoals = accountsWithGoals.reduce((sum: number, acc: any) => sum + (acc.goal || 0), 0);
  const totalSaved = accountsWithGoals.reduce((sum: number, acc: any) => sum + acc.balance, 0);
  const overallProgress = totalGoals > 0 ? (totalSaved / totalGoals) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Goals Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Accounts with Goals</p>
            <p className="text-xl font-bold">
              {accountsWithGoals.length} of {accounts?.length || 0} ({Math.round((accountsWithGoals.length / (accounts?.length || 1)) * 100)}%)
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Goal Amount</p>
            <p className="text-xl font-bold">{formatCurrency(totalGoals)}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Overall Progress</p>
            <p className="text-xl font-bold">{Math.round(overallProgress)}%</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-2">All Savings Goals</h4>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatCurrency(totalSaved)} saved</span>
            <span>{formatCurrency(totalGoals)} goal</span>
          </div>
        </div>

        {/* Individual Goals */}
        <div className="space-y-4">
          {accountsWithGoals.map((account: any) => {
            const progress = (account.balance / account.goal) * 100;
            return (
              <div key={account.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{account.savingType?.name}</h4>
                    <p className="text-sm text-gray-500">{account.accountNumber?.accountNumber}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatCurrency(account.balance)} saved</span>
                  <span>{formatCurrency(account.goal)} goal</span>
                </div>
                {progress >= 100 && (
                  <div className="mt-2 text-sm text-green-600 font-medium">
                    Goal achieved! 🎉
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GoalsTab;