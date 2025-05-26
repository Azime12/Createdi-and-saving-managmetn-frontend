    "use client";

import React from "react";
import { FiSettings, FiToggleLeft, FiRepeat, FiClock } from "react-icons/fi";

const ParametersTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Parameters</h3>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-medium flex items-center">
              <FiSettings className="mr-2 text-blue-500" />
              General Settings
            </h4>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default Currency
                </label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>ETB</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>English</option>
                  <option>Amharic</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h4 className="font-medium flex items-center">
              <FiToggleLeft className="mr-2 text-green-500" />
              Feature Toggles
            </h4>
            <div className="mt-3 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Enable Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Enable Audit Logs
                </label>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h4 className="font-medium flex items-center">
              <FiRepeat className="mr-2 text-purple-500" />
              Auto Backup
            </h4>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Retention Period (Days)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value="30"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium flex items-center">
              <FiClock className="mr-2 text-red-500" />
              System Timezone
            </h4>
            <div className="mt-3">
              <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Africa/Addis_Ababa (GMT+3)</option>
                <option>UTC</option>
                <option>America/New_York (GMT-4)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Parameters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParametersTab;