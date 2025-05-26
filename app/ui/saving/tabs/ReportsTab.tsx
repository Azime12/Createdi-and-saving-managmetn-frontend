'use client';
import { useState } from 'react';
import { FiDownload, FiInfo } from 'react-icons/fi';
import { useGetAllAccountsQuery } from '@/redux/api/accountApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { formatCurrency } from '../helpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LabelList
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C', '#D0ED57'];

const ReportsTab = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { data: accounts, isLoading } = useGetAllAccountsQuery();
  const [reportType, setReportType] = useState('balance-growth');
  const [timeRange, setTimeRange] = useState('1year');

  // Calculate total balance
  const totalBalance = accounts?.reduce((sum: number, account: any) => 
    sum + parseFloat(account.balance), 0) || 0;

  // Prepare data for charts
  const balanceData = accounts?.map((account: any) => ({
    name: account.savingType?.name.substring(0, 12) + (account.savingType?.name.length > 12 ? '...' : ''),
    fullName: account.savingType?.name,
    balance: parseFloat(account.balance),
    goal: parseFloat(account.goal) || 0,
    interestRate: account.savingType?.interestRate
  })) || [];

  const typeDistribution = accounts?.reduce((acc: any, account: any) => {
    const type = account.savingType?.name || 'Other';
    acc[type] = (acc[type] || 0) + parseFloat(account.balance);
    return acc;
  }, {});

  const pieData = Object.entries(typeDistribution || {})
    .map(([name, value]) => ({
      name: name.substring(0, 12) + (name.length > 12 ? '...' : ''),
      fullName: name,
      value,
      percentage: ((value as number) / totalBalance * 100).toFixed(1) + '%'
    }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm">Balance: {formatCurrency(data.balance)}</p>
          {data.goal > 0 && <p className="text-sm">Goal: {formatCurrency(data.goal)}</p>}
          <p className="text-sm">APY: {data.interestRate}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm">Amount: {formatCurrency(data.value)}</p>
          <p className="text-sm">Percentage: {data.percentage}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Savings Reports</h3>
            <p className="text-sm text-gray-500">
              Total Balance: <span className="font-semibold">{formatCurrency(totalBalance)}</span>
            </p>
          </div>
          <div className="flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
            <FiInfo className="mr-1" />
            {accounts?.length} accounts
          </div>
        </div>
        
        {/* Report Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="balance-growth">Balance Growth</option>
              <option value="account-types">Account Types</option>
              <option value="interest-earnings">Interest Earnings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FiDownload className="mr-2 h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Charts */}
        {reportType === 'balance-growth' && (
          <div className="border rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">Balance Growth</h4>
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#8884d8] rounded-full mr-1"></div>
                  <span className="text-xs">Balance</span>
                </div>
                {balanceData.some((d: any) => d.goal > 0) && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#82ca9d] rounded-full mr-1"></div>
                    <span className="text-xs">Goal</span>
                  </div>
                )}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={balanceData}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value).replace('₦', '')} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend />
                  <Bar dataKey="balance" name="Current Balance" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  {balanceData.some((d: any) => d.goal > 0) && (
                    <Bar dataKey="goal" name="Goal" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportType === 'account-types' && (
          <div className="border rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">Account Types Distribution</h4>
              <div className="text-sm text-gray-500">
                Total: {formatCurrency(totalBalance)}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ percentage }) => percentage}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    formatter={(value, entry, index) => (
                      <span className="text-xs">
                        {pieData[index]?.fullName}: {formatCurrency(pieData[index]?.value)}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportType === 'interest-earnings' && (
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Projected Interest Earnings</h4>
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
                      1 Month
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      1 Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      5 Years
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts?.map((account: any) => {
                    const monthly = account.balance * (account.savingType?.interestRate / 100) / 12;
                    const yearly = account.balance * (account.savingType?.interestRate / 100);
                    const fiveYear = yearly * 5;
                    
                    return (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{account.savingType?.name}</div>
                          <div className="text-sm text-gray-500">{account.accountNumber?.accountNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(account.balance)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          account.savingType?.interestRate > 0 ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {account.savingType?.interestRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(monthly)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(yearly)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(fiveYear)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;