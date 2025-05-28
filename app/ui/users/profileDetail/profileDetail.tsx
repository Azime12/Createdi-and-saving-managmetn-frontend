'use client';
import { useState, useEffect } from 'react';
import {
  FiUser,
  FiCreditCard,
  FiDollarSign,
  FiHeart,
  FiHome,
  FiPieChart,
  FiActivity,
  FiShield,
} from 'react-icons/fi';
import TransactionsTab from './tabs/TransactionsTab';
import LoansTab from './tabs/LoansTab';
import SavingsTab from './tabs/SavingsTab';
import CardsTab from './tabs/CardsTab';
import WishlistTab from './tabs/WishlistTab';
import SecurityTab from './tabs/SecurityTab';
import OverviewTab from './tabs/OverviewTab';
import AccountsTab from './tabs/AccountsTab';
import { useGetUserByIdQuery } from '@/redux/api/adminApiSlice';
import { useGetProfileByIdQuery } from '@/redux/api/userProfileApiSlice';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useParams } from 'next/navigation';



const UserProfileDashboard = () => {
  // const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const params = useParams();
  const id = params?.id as string;
  const { data:userProfileData, isLoading:userProfileDataIsLoading } = useGetUserByIdQuery(id);
  const { data:profileInfo, isLoading:profileInfoIsLoading } = useGetProfileByIdQuery(id); 


   
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
 

  const tabs = [
    { id: 'overview', icon: <FiUser />, label: 'Overview' },
    { id: 'accounts', icon: <FiDollarSign />, label: 'Accounts' },
    // { id: 'transactions', icon: <FiActivity />, label: 'Transactions' },
    { id: 'loans', icon: <FiHome />, label: 'Loans' },
 
 ]

  useEffect(() => {
    const storedColor = localStorage.getItem('primaryColor');
    if (storedColor) setPrimaryColor(storedColor);

    setTimeout(() => {
      setUserData({
        id: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'Felecia',
        lastName: 'Burke',
        email: 'felecia.burke@example.com',
        phoneNumber: '+1234567890',
        isVerified: true,
        isActive: true,
        profile: {
          dateOfBirth: '1990-06-10',
          gender: 'Female',
          address: {
            street: '898 Joanne Lane Street',
            city: 'Boston',
            state: 'Massachusetts',
            country: 'United States',
            zipCode: '02110',
          },
          profilePhoto: '/profile-photo.jpg',
          idType: 'Passport',
          idNumber: 'A12345678',
          kycVerified: true,
          identityVerified: true,
        },
        accounts: [],
        cards: [],
        loans: [],
        // transactions: [],
        wishlist: [],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Error loading user data</p>
      </div>
    );
  }

  return (
    <div className="min-w-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account, transactions, and personal information
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg border-b shadow-sm">
          <nav className="flex overflow-x-auto space-x-1 px-2 py-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap
                    ${isActive ? 'text-white shadow-md' : 'text-gray-700 hover:text-black hover:bg-gray-100'}
                  `}
                  style={{
                    backgroundColor: isActive ? primaryColor : 'transparent',
                    border: isActive ? `1px solid ${primaryColor}` : '1px solid transparent',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-white rounded-b-lg shadow-sm p-6">
        {activeTab === 'overview' && (
  (userProfileDataIsLoading || profileInfoIsLoading) ? (
    <div className="text-gray-500 text-center"><LoadingSpinner/></div>
  ) : (
    <OverviewTab
      userId={id}
      userData={userProfileData}
      profileinfo={profileInfo || null}
      isLoading={false}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
      setActiveTab={setActiveTab}
      primaryColor={primaryColor}
    />
  )
)}

          
          {activeTab === 'accounts' && (
            <AccountsTab                   formatCurrency={formatCurrency} primaryColor={primaryColor} />
          )}
         
        
          {activeTab === 'loans' && (
            <LoansTab userData={userData} formatCurrency={formatCurrency} formatDate={formatDate} primaryColor={primaryColor} />
          )}
        
          
         
        </div>
      </div>
    </div>
  );
};

export default UserProfileDashboard;
