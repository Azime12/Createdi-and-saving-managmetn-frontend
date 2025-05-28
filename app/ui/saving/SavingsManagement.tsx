'use client';
import { useState } from 'react';
import AccountsTab from './tabs/AccountsTab';
import TransactionsTab from './tabs/TransactionsTab';
import GoalsTab from './tabs/GoalsTab';
import InterestTab from './tabs/InterestTab';
import ReportsTab from './tabs/ReportsTab';
import {
  FiPieChart, FiDollarSign, FiTrendingUp, FiPercent, FiDownload
} from 'react-icons/fi';

const SavingsManagement = () => {
  const [activeTab, setActiveTab] = useState('accounts');

  const tabs = [
    { id: 'accounts', icon: FiPieChart, label: 'Accounts' },
    // { id: 'transactions', icon: FiDollarSign, label: 'Transactions' },
    // { id: 'goals', icon: FiTrendingUp, label: 'Savings Goals' },
    // { id: 'interest', icon: FiPercent, label: 'Interest' },
    // { id: 'reports', icon: FiDownload, label: 'Reports' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Savings Account Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your savings accounts, transactions, and interest
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'accounts' && <AccountsTab />}
        {/* {activeTab === 'transactions' && <TransactionsTab />} */}
        {/* {activeTab === 'goals' && <GoalsTab />} */}
        {/* {activeTab === 'interest' && <InterestTab />} */}
        {/* {activeTab === 'reports' && <ReportsTab />} */}
      </div>
    </div>
  );
};

export default SavingsManagement;