'use client'
import { useState } from 'react';
import {
  FiBell, FiMail, FiAlertCircle, FiCheckCircle,
  FiFilter, FiSearch, FiTrash2, FiArchive,
  FiEye, FiEyeOff, FiClock, FiSettings,
  FiDollarSign,
  FiShield
} from 'react-icons/fi';

const NotificationManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample notification data
  const notifications = [
    {
      id: 'NT-1001',
      type: 'transaction',
      title: 'Deposit Received',
      message: 'A deposit of $1,250.00 has been credited to your account',
      date: '2023-10-15T09:30:00Z',
      read: false,
      priority: 'high',
      category: 'account'
    },
    {
      id: 'NT-1002',
      type: 'alert',
      title: 'Low Balance Alert',
      message: 'Your account balance is below the minimum threshold',
      date: '2023-10-14T14:15:00Z',
      read: true,
      priority: 'medium',
      category: 'account'
    },
    {
      id: 'NT-1003',
      type: 'system',
      title: 'Scheduled Maintenance',
      message: 'System maintenance scheduled for October 16, 2:00 AM - 4:00 AM',
      date: '2023-10-13T11:00:00Z',
      read: true,
      priority: 'low',
      category: 'system'
    },
    {
      id: 'NT-1004',
      type: 'security',
      title: 'New Login Detected',
      message: 'Your account was accessed from a new device in New York, NY',
      date: '2023-10-12T18:45:00Z',
      read: false,
      priority: 'high',
      category: 'security'
    },
    {
      id: 'NT-1005',
      type: 'loan',
      title: 'Loan Payment Due',
      message: 'Your loan payment of $350.00 is due in 3 days',
      date: '2023-10-11T08:00:00Z',
      read: false,
      priority: 'medium',
      category: 'loan'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return !notification.read && matchesSearch;
    if (activeTab === 'account') return notification.category === 'account' && matchesSearch;
    if (activeTab === 'security') return notification.category === 'security' && matchesSearch;
    if (activeTab === 'system') return notification.category === 'system' && matchesSearch;
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const markAsRead = (ids) => {
    // In a real app, you would update the backend here
    console.log(`Marked as read: ${ids.join(', ')}`);
    setSelectedNotifications([]);
  };

  const deleteNotifications = (ids) => {
    // In a real app, you would update the backend here
    console.log(`Deleted notifications: ${ids.join(', ')}`);
    setSelectedNotifications([]);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FiAlertCircle className="text-red-500" />;
      case 'medium':
        return <FiAlertCircle className="text-yellow-500" />;
      default:
        return <FiAlertCircle className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <FiBell className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account alerts and system notifications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'all', icon: FiBell, label: 'All' },
              { id: 'unread', icon: FiMail, label: 'Unread' },
              { id: 'account', icon: FiDollarSign, label: 'Account' },
              { id: 'security', icon: FiShield, label: 'Security' },
              { id: 'system', icon: FiSettings, label: 'System' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
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
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={() => markAsRead(selectedNotifications)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiCheckCircle className="mr-2 h-4 w-4" />
                  Mark as Read
                </button>
                <button
                  onClick={() => deleteNotifications(selectedNotifications)}
                  className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  Delete
                </button>
              </>
            )}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSettings className="mr-2 h-4 w-4" />
              Notification Settings
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <FiBell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'unread' 
                  ? "You don't have any unread notifications" 
                  : "You don't have any notifications in this category"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => toggleSelectNotification(notification.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                        />
                        <div className="flex items-center mr-3">
                          {getPriorityIcon(notification.priority)}
                        </div>
                        <p className={`text-sm font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.date)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 ml-7">
                          {notification.message}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 space-x-3">
                        {!notification.read && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {notification.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Notification Settings Modal */}
      {showSettingsModal && (
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
                    Notification Settings
                  </h3>
                  <div className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <FiMail className="mr-2 text-blue-500" />
                          Email Notifications
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Account Activity</p>
                              <p className="text-sm text-gray-500">
                                Deposits, withdrawals, and transfers
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Security Alerts</p>
                              <p className="text-sm text-gray-500">
                                Login attempts and password changes
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Payment Reminders</p>
                              <p className="text-sm text-gray-500">
                                Loan payments and credit card due dates
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">System Updates</p>
                              <p className="text-sm text-gray-500">
                                Maintenance and service announcements
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-medium mb-3 flex items-center">
                          <FiBell className="mr-2 text-green-500" />
                          In-App Notifications
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Account Activity</p>
                              <p className="text-sm text-gray-500">
                                Deposits, withdrawals, and transfers
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Security Alerts</p>
                              <p className="text-sm text-gray-500">
                                Login attempts and password changes
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-medium mb-3 flex items-center">
                          <FiAlertCircle className="mr-2 text-yellow-500" />
                          Push Notifications
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">High Priority Alerts</p>
                              <p className="text-sm text-gray-500">
                                Critical account and security notifications
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Payment Reminders</p>
                              <p className="text-sm text-gray-500">
                                Loan payments and credit card due dates
                              </p>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  onClick={() => setShowSettingsModal(false)}
                >
                  Save Settings
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowSettingsModal(false)}
                >
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

export default NotificationManagement;