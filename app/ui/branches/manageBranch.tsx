'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  FiUser,
  FiCreditCard,
  FiDollarSign,
  FiHeart,
  FiHome,
  FiCalendar,
  FiPieChart,
  FiActivity,
  FiSettings,
  FiLock,
  FiShield,
  FiDownload,
  FiUpload,
  FiPlus,
} from 'react-icons/fi';

interface Tab {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const UserProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6'); // Default blue color

  const tabs: Tab[] = [
    { id: 'overview', icon: <FiUser />, label: 'Overview' },
    { id: 'accounts', icon: <FiDollarSign />, label: 'Accounts' },
    { id: 'transactions', icon: <FiActivity />, label: 'Transactions' },
    { id: 'cards', icon: <FiCreditCard />, label: 'Cards' },
    { id: 'loans', icon: <FiHome />, label: 'Loans' },
    { id: 'savings', icon: <FiPieChart />, label: 'Savings' },
    { id: 'wishlist', icon: <FiHeart />, label: 'Wishlist' },
    { id: 'security', icon: <FiShield />, label: 'Security' },
  ];

  useEffect(() => {
    // Load primary color from localStorage or theme
    const storedColor = localStorage.getItem('primaryColor');
    if (storedColor) setPrimaryColor(storedColor);

    // Fetch user data
    const fetchUserData = async () => {
      try {
        setTimeout(() => {
          setUserData({
            id: "550e8400-e29b-41d4-a716-446655440000",
            firstName: "Felecia",
            lastName: "Burke",
            email: "felecia.burke@example.com",
            phoneNumber: "+1234567890",
            isVerified: true,
            isActive: true,
            profile: {
              dateOfBirth: "1990-06-10",
              gender: "Female",
              address: {
                street: "898 Joanne Lane Street",
                city: "Boston",
                state: "Massachusetts",
                country: "United States",
                zipCode: "02110",
              },
              profilePhoto: "/profile-photo.jpg",
              idType: "Passport",
              idNumber: "A12345678",
              kycVerified: true,
              identityVerified: true,
            },
            accounts: [
              {
                id: "acc-001",
                type: "checking",
                accountNumber: "1234567890",
                balance: 5000.0,
                currency: "USD",
              },
              {
                id: "acc-002",
                type: "savings",
                accountNumber: "9876543210",
                balance: 12500.0,
                currency: "USD",
                apy: 2.5,
              },
            ],
            cards: [
              {
                id: "card-001",
                type: "VISA",
                lastFour: "1112",
                balance: 1000000.0,
                cardHolder: "Mark Anderson",
                expiry: "12/31",
              },
            ],
            loans: [
              {
                id: "loan-001",
                type: "mortgage",
                amount: 245000.0,
                remaining: 195000.0,
                interestRate: 3.2,
                nextPaymentDate: "2023-10-15",
                nextPaymentAmount: 1200.0,
              },
              {
                id: "loan-002",
                type: "auto",
                amount: 18750.0,
                remaining: 12500.0,
                interestRate: 4.5,
                nextPaymentDate: "2023-10-05",
                nextPaymentAmount: 350.0,
              },
            ],
            transactions: [
              {
                id: "txn-001",
                date: "2023-09-20",
                amount: -150.0,
                description: "Grocery Store",
                category: "food",
                account: "1234567890",
              },
              {
                id: "txn-002",
                date: "2023-09-18",
                amount: 2500.0,
                description: "Salary Deposit",
                category: "income",
                account: "1234567890",
              },
              {
                id: "txn-003",
                date: "2023-09-15",
                amount: -1200.0,
                description: "Mortgage Payment",
                category: "housing",
                account: "1234567890",
              },
            ],
            wishlist: [
              {
                id: "wl-001",
                name: "Apple Watch Series 4",
                productId: "790841",
                price: 599.0,
                color: "Gold",
                size: "44mm",
              },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    // fetchUserData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
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
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Profile Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account, transactions, and personal information
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b bg-white rounded-t-lg">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-md transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? primaryColor : 'transparent',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <OverviewTab 
              userData={userData} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate} 
              primaryColor={primaryColor}
            />
          )}
          {activeTab === 'accounts' && (
            <AccountsTab 
              userData={userData} 
              formatCurrency={formatCurrency} 
              primaryColor={primaryColor}
            />
          )}
          {activeTab === 'transactions' && (
            <TransactionsTab 
              userData={userData} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate}
            />
          )}
          {activeTab === 'cards' && (
            <CardsTab 
              userData={userData} 
              formatCurrency={formatCurrency} 
              primaryColor={primaryColor}
            />
          )}
          {activeTab === 'loans' && (
            <LoansTab 
              userData={userData} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate}
              primaryColor={primaryColor}
            />
          )}
          {activeTab === 'savings' && (
            <SavingsTab 
              userData={userData} 
              formatCurrency={formatCurrency} 
              primaryColor={primaryColor}
            />
          )}
          {activeTab === 'wishlist' && (
            <WishlistTab 
              userData={userData} 
              formatCurrency={formatCurrency} 
              primaryColor={primaryColor}
            />
          )}
          {activeTab === 'security' && (
            <SecurityTab 
              userData={userData} 
              primaryColor={primaryColor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Tab Components (these would be in separate files)
const OverviewTab = ({ userData, formatCurrency, formatDate, primaryColor }) => {
  return (
    <div className="space-y-6">
      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {userData.profile.profilePhoto ? (
              <img
                src={userData.profile.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="text-gray-400 text-3xl" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {userData.firstName} {userData.lastName}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2" />
                <span>Joined {formatDate(userData.createdAt)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiUser className="mr-2" />
                <span>{userData.profile.gender}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiShield className="mr-2" />
                <span className="text-green-600 font-medium">
                  {userData.profile.identityVerified
                    ? "Verified"
                    : "Not Verified"}
                </span>
              </div>
            </div>
          </div>
          <button 
            className="px-4 py-2 border rounded-lg hover:opacity-90 transition"
            style={{ 
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: `${primaryColor}10`
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Rest of the overview content... */}
    </div>
  );
};

const AccountsTab = ({ userData, formatCurrency, primaryColor }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">My Accounts</h2>
        <div className="space-y-4">
          {userData.accounts.map((account) => (
            <div
              key={account.id}
              className="border rounded-lg p-4 hover:border-blue-500 transition"
              style={{ borderColor: primaryColor }}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {account.type === "checking"
                      ? "Checking Account"
                      : "Savings Account"}
                  </p>
                  <p className="text-sm text-gray-500">
                    •••• {account.accountNumber.slice(-4)}
                  </p>
                </div>
                <p
                  className={`text-xl font-bold ${
                    account.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(account.balance)}
                </p>
              </div>
              {account.type === "savings" && (
                <div className="mt-2 flex justify-between text-sm">
                  <p className="text-gray-500">APY: {account.apy}%</p>
                  <button 
                    className="hover:underline"
                    style={{ color: primaryColor }}
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button 
          className="w-full mt-4 py-3 text-white rounded-lg hover:opacity-90 transition"
          style={{ backgroundColor: primaryColor }}
        >
          Open New Account
        </button>
      </div>
    </div>
  );
};

// Other tab components (TransactionsTab, CardsTab, LoansTab, SavingsTab, WishlistTab, SecurityTab)
// would follow the same pattern with primaryColor integration

export default UserProfileDashboard;