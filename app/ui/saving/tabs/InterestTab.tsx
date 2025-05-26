'use client';
import { useGetAccountsByUserIdQuery } from '@/redux/api/accountApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { formatCurrency } from '../helpers';

const InterestTab = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { data: accounts, isLoading } = useGetAccountsByUserIdQuery(userInfo?.id || '');

  // Calculate interest data
  const interestData = accounts?.map((account: any) => {
    const monthlyInterest = account.balance * (account.savingType?.interestRate / 100) / 12;
    const yearlyInterest = account.balance * (account.savingType?.interestRate / 100);
    
    // Find last interest payment
    const lastInterestPayment = account.transactions?.find((t: any) => t.type === 'INTEREST');
    
    return {
      ...account,
      monthlyInterest,
      yearlyInterest,
      lastInterestDate: lastInterestPayment?.createdAt,
      lastInterestAmount: lastInterestPayment?.amount
    };
  }) || [];

  // Calculate totals
  const totalMonthlyInterest = interestData.reduce((sum: number, acc: any) => sum + acc.monthlyInterest, 0);
  const totalYearlyInterest = interestData.reduce((sum: number, acc: any) => sum + acc.yearlyInterest, 0);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Interest Calculations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Estimated Monthly Interest</p>
            <p className="text-xl font-bold">{formatCurrency(totalMonthlyInterest)}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Estimated Yearly Interest</p>
            <p className="text-xl font-bold">{formatCurrency(totalYearlyInterest)}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Average Interest Rate</p>
            <p className="text-xl font-bold">
  {accounts?.length 
    ? (accounts.reduce((sum: number, acc: any) => sum + (acc.savingType?.interestRate || 0), 0) / accounts.length).toFixed(2)
    : 0}% {/* <-- Add closing parenthesis and use toFixed(2) */}
</p>

          </div>
        </div>

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
                  APY
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Interest
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yearly Interest
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interestData.map((account: any) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{account.savingType?.name}</div>
                    <div className="text-sm text-gray-500">{account.accountNumber?.accountNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(account.balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.savingType?.interestRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(account.monthlyInterest)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(account.yearlyInterest)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.lastInterestDate 
                      ? `${formatCurrency(account.lastInterestAmount)} on ${new Date(account.lastInterestDate).toLocaleDateString()}`
                      : 'No payments yet'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterestTab;