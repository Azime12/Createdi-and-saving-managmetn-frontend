'use client';

import React from 'react';

type Branch = {
  id: string;
  name: string;
  type: string;
  savingsAccounts: number;
  assets: number;
};

type SavingsTabProps = {
  branches: Branch[];
  formatCurrency: (amount: number) => string;
};

export const SavingsTab: React.FC<SavingsTabProps> = ({ branches, formatCurrency }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Savings Summary Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Overview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Savings Accounts</p>
              <p className="text-2xl font-bold">4,882</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Savings Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(245000000)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Balance per Account</p>
              <p className="text-2xl font-bold">{formatCurrency(50184)}</p>
            </div>
          </div>
        </div>

        {/* Top Performing Branches */}
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Branches (Savings)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accounts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth (6mo)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {branches
                  .sort((a, b) => b.savingsAccounts - a.savingsAccounts)
                  .map((branch) => (
                    <tr key={branch.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.savingsAccounts}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency((branch.assets ?? 0) * 0.65)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">+12.5%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Savings Products */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Products by Branch</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div key={branch.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <h4 className="font-medium text-gray-900">{branch.name}</h4>
              <p className="text-sm text-gray-500 mb-3">{branch.type}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Regular Savings</span>
                  <span className="font-medium">1,250 accounts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Premium Savings</span>
                  <span className="font-medium">622 accounts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Youth Accounts</span>
                  <span className="font-medium">198 accounts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
