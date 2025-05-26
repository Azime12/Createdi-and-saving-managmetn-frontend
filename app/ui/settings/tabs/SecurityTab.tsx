'use client';
import { FiLock, FiShield, FiCalendar } from 'react-icons/fi';
export default function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-medium flex items-center">
              <FiLock className="mr-2 text-blue-500" />
              Password Policies
            </h4>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Length</label>
                <input
                  type="number"
                  defaultValue={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Complexity Requirements</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>Medium (Letters + Numbers)</option>
                  <option>High (Letters + Numbers + Special Characters)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="border-b pb-4">
            <h4 className="font-medium flex items-center">
              <FiShield className="mr-2 text-green-500" />
              Two-Factor Authentication
            </h4>
            <div className="mt-3 space-y-2">
              {[
                { id: 'enable-2fa', label: 'Require 2FA for all admin users' },
                { id: 'sms-2fa', label: 'Allow SMS verification' },
                { id: 'app-2fa', label: 'Allow Authenticator App' },
              ].map(({ id, label }) => (
                <div className="flex items-center" key={id}>
                  <input
                    id={id}
                    name={id}
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={id} className="ml-2 text-sm text-gray-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Session Management */}
          <div>
            <h4 className="font-medium flex items-center">
              <FiCalendar className="mr-2 text-purple-500" />
              Session Management
            </h4>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Session Timeout</label>
                <select defaultValue="30 minutes" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Failed Attempts</label>
                <input
                  type="number"
                  defaultValue={5}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );
}
