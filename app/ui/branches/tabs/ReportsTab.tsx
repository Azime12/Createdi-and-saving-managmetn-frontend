'use client';

export const ReportsTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Branch Performance Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Savings Growth</h4>
            <p className="text-sm text-gray-500 mb-3">Quarterly savings account growth</p>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400">Chart Placeholder</span>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Loan Portfolio</h4>
            <p className="text-sm text-gray-500 mb-3">Loan types distribution</p>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400">Chart Placeholder</span>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Credit Performance</h4>
            <p className="text-sm text-gray-500 mb-3">Delinquency rates by branch</p>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400">Chart Placeholder</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Custom Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="report-type"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option>Savings Performance</option>
              <option>Loan Portfolio</option>
              <option>Credit Activity</option>
              <option>Branch Comparison</option>
            </select>
          </div>
          <div>
            <label htmlFor="time-period" className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              id="time-period"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};