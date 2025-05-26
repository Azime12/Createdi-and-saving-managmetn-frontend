'use client';

import React from 'react';

type Branch = {
  id: string;
  name: string;
  type: string;
  loansIssued: number;
  assets: number;
};

type CreditTabProps = {
  branches: Branch[];
  formatCurrency: (amount: number) => string;
};

export const CreditTab: React.FC<CreditTabProps> = ({ branches, formatCurrency }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credit Summary Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Overview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Active Credit Accounts</p>
              <p className="text-2xl font-bold">1,245</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Credit Issued</p>
              <p className="text-2xl font-bold">{formatCurrency(18750000)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Credit Line</p>
              <p className="text-2xl font-bold">{formatCurrency(15060)}</p>
            </div>
          </div>
        </div>

        {/* Credit Performance by Branch */}
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Performance by Branch</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Accounts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Issued</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delinquency Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {branches.map((branch) => (
                  <tr key={branch.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(branch.loansIssued * 0.8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency((branch.assets ?? 0) * 0.15)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">2.3%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">78%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Credit Products */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Personal Credit Lines</h4>
            <p className="text-sm text-gray-500 mb-3">Unsecured personal credit</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Accounts</span>
                <span className="font-medium">845</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Issued</span>
                <span className="font-medium">{formatCurrency(8750000)}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Business Credit</h4>
            <p className="text-sm text-gray-500 mb-3">Small business credit lines</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Accounts</span>
                <span className="font-medium">275</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Issued</span>
                <span className="font-medium">{formatCurrency(6250000)}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Credit Cards</h4>
            <p className="text-sm text-gray-500 mb-3">Consumer credit cards</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Accounts</span>
                <span className="font-medium">1,125</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Issued</span>
                <span className="font-medium">{formatCurrency(3750000)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
