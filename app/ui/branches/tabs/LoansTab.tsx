'use client';

interface Branch {
  id: string;
  name: string;
  loansIssued: number;
  assets: number;
}


interface LoansTabProps {
  branches: Branch[];
  formatCurrency: (amount: number) => string;
}

export const LoansTab: React.FC<LoansTabProps> = ({ branches, formatCurrency }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loans Summary Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loans Overview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Active Loans</p>
              <p className="text-2xl font-bold">464</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Loan Portfolio</p>
              <p className="text-2xl font-bold">{formatCurrency(32500000)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Loan Size</p>
              <p className="text-2xl font-bold">{formatCurrency(70043)}</p>
            </div>
          </div>
        </div>

        {/* Loan Performance */}
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Performance by Branch</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loans Issued
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Portfolio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delinquency Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {branches.map((branch) => (
                  <tr key={branch.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {branch.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {branch.loansIssued}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(branch.assets * 0.2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">1.8%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">0.7%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Loan Products */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Mortgage Loans</h4>
            <p className="text-sm text-gray-500 mb-3">Home purchase and refinance</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Loans</span>
                <span className="font-medium">185</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Portfolio</span>
                <span className="font-medium">{formatCurrency(22500000)}</span>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Auto Loans</h4>
            <p className="text-sm text-gray-500 mb-3">Vehicle financing</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Loans</span>
                <span className="font-medium">167</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Portfolio</span>
                <span className="font-medium">{formatCurrency(6250000)}</span>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium text-gray-900">Personal Loans</h4>
            <p className="text-sm text-gray-500 mb-3">Unsecured personal loans</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Loans</span>
                <span className="font-medium">112</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Portfolio</span>
                <span className="font-medium">{formatCurrency(3750000)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
