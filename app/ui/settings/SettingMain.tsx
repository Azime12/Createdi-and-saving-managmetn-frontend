'use client'
import LoanTypesTab from '@/app/ui/settings/tabs/LoanTypesTab';
import ParametersTab from '@/app/ui/settings/tabs/ParametersTab';
import SavingsTypesTab from '@/app/ui/settings/tabs/SavingsTypesTab';
import SecurityTab from '@/app/ui/settings/tabs/SecurityTab';
import { UsersTab } from '@/app/ui/settings/tabs/UsersTab';
import { useGetAllSavingTypeQuery } from '@/redux/api/settingApiSlice';
import { useState, useEffect } from 'react';
import {
  FiSettings, FiDollarSign, FiPieChart, FiCreditCard,
  FiUser, FiHome, FiLock, FiShield, FiCalendar,
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX,
  FiSearch
} from 'react-icons/fi';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('savingsTypes');
  const [showLoanTypeModal, setShowLoanTypeModal] = useState(false);
  const [showSavingsTypeModal, setShowSavingsTypeModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6'); // Default blue color

  useEffect(() => {
    // Load primary color from localStorage or theme
    const storedColor = localStorage.getItem('primaryColor');
    if (storedColor) setPrimaryColor(storedColor);
  }, []);

  // Sample data
  const loanTypes = [
    {
      id: 'LT-001',
      name: 'Personal Loan',
      description: 'Unsecured personal loan',
      minAmount: 1000,
      maxAmount: 50000,
      minTerm: 12,
      maxTerm: 60,
      interestRate: 7.5,
      interestType: 'Fixed',
      active: true
    },
    {
      id: 'LT-002',
      name: 'Mortgage',
      description: 'Home mortgage loan',
      minAmount: 50000,
      maxAmount: 2000000,
      minTerm: 60,
      maxTerm: 360,
      interestRate: 3.75,
      interestType: 'Fixed',
      active: true
    },
    {
      id: 'LT-003',
      name: 'Auto Loan',
      description: 'Vehicle financing',
      minAmount: 5000,
      maxAmount: 100000,
      minTerm: 12,
      maxTerm: 84,
      interestRate: 5.25,
      interestType: 'Variable',
      active: true
    }
  ];

  const systemParameters = [
    { id: 'SP-001', name: 'Max Loan Amount', value: '5000000', category: 'Loans' },
    { id: 'SP-002', name: 'Daily Withdrawal Limit', value: '2000', category: 'Transactions' },
    { id: 'SP-003', name: 'Interest Calculation Method', value: 'Daily', category: 'Interest' },
    { id: 'SP-004', name: 'Auto Loan Down Payment %', value: '20', category: 'Loans' },
    { id: 'SP-005', name: 'Dormant Account Period', value: '365', category: 'Accounts' }
  ];

  const filteredLoanTypes = loanTypes.filter(loanType =>
    loanType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loanType.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: string | number | bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'loanTypes') {
      setShowLoanTypeModal(true);
    } else if (activeTab === 'savingsTypes') {
      setShowSavingsTypeModal(true);
    }
  };

  const handleSave = () => {
    // In a real app, you would save to your backend here
    setShowLoanTypeModal(false);
    setShowSavingsTypeModal(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <FiSettings 
              className="h-8 w-8 mr-3" 
              style={{ color: primaryColor }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Configure loan types, savings accounts, and system parameters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 overflow-x-auto py-2 sm:space-x-8 sm:py-0">
            {[
              { id: 'loanTypes', icon: FiHome, label: 'Loan Types' },
              { id: 'savingsTypes', icon: FiPieChart, label: 'Savings Types' },
              { id: 'parameters', icon: FiSettings, label: 'Parameters' },
              { id: 'security', icon: FiShield, label: 'Security' },
              { id: 'users', icon: FiUser, label: 'Users' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 
                  `border-[${primaryColor}] text-[${primaryColor}]` : 
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                style={{
                  borderBottomColor: activeTab === tab.id ? primaryColor : 'transparent',
                  color: activeTab === tab.id ? primaryColor : ''
                }}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'loanTypes' && (
          <LoanTypesTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setEditingItem={setEditingItem}
            setShowLoanTypeModal={setShowLoanTypeModal}
            filteredLoanTypes={filteredLoanTypes}
            handleEdit={handleEdit}
            formatCurrency={formatCurrency}
            primaryColor={primaryColor}
          />
        )}

        {activeTab === 'savingsTypes' && (
          <SavingsTypesTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            formatCurrency={formatCurrency}
            primaryColor={primaryColor}
          />
        )}

        {activeTab === 'parameters' && (
          <ParametersTab 
            systemParameters={systemParameters} 
            primaryColor={primaryColor}
          />
        )}

        {activeTab === 'security' && (
          <SecurityTab primaryColor={primaryColor} />
        )}

        {activeTab === 'users' && (
          <UsersTab primaryColor={primaryColor} />
        )}
      </div>

      {/* Loan Type Modal */}
      {showLoanTypeModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingItem ? 'Edit Loan Type' : 'Add New Loan Type'}
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Modal content remains the same */}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                  style={{ 
                    backgroundColor: primaryColor,
                    '--tw-ring-color': `${primaryColor}80`,
                    hoverBackgroundColor: `${primaryColor}E6`,
                  }}
                  onClick={handleSave}
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  Save Loan Type
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowLoanTypeModal(false)}
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSavingsTypeModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingItem ? 'Edit Savings Type' : 'Add New Savings Type'}
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Modal content remains the same */}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                  style={{ 
                    backgroundColor: primaryColor,
                    '--tw-ring-color': `${primaryColor}80`,
                    hoverBackgroundColor: `${primaryColor}E6`,
                  }}
                  onClick={handleSave}
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  Save Savings Type
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowSavingsTypeModal(false)}
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;