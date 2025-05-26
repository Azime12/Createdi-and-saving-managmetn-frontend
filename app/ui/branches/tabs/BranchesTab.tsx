'use client';

import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Branch {
  branchCode: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  openingDate: string;
  status: string;
  managerId: string;
}

interface BranchesTabProps {
  branches: Branch[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  primaryColor: string;
}

export const BranchesTab = ({
  branches,
  searchTerm,
  setSearchTerm,
  primaryColor,
}: BranchesTabProps) => {
  const router = useRouter();

  const filteredBranches = branches.filter((branch) =>
    branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.branchCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBranch = () => {
    router.push('/dashboard/branch/add_branches');
  };

  const handleEditBranch = (branchId: string) => {
    router.push(`/dashboard/branches/${branchId}`);
  };

  return (
    <div className="space-y-6">
      {/* Search and Add Branch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
  onClick={handleAddBranch}
  style={{ backgroundColor: primaryColor || 'blue' }} // fallback if not passed
  className="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
>
  <FiPlus className="mr-2 h-4 w-4" />
  Add Branch
</button>


      </div>

      {/* Branches Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Branch Code', 'Branch Name', 'Location', 'City', 'State',
                  'Postal Code', 'Country', 'Phone', 'Email',
                  'Opening Date', 'Status', 'Manager ID', 'Actions'
                ].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBranches.map((branch) => (
                <tr key={branch.branchCode} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{branch.branchCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{branch.branchName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.postalCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.openingDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.status}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{branch.managerId}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditBranch(branch.branchCode)}
                      style={{ color: primaryColor }}
                      className="hover:underline"
                    >
                      <FiEdit2 className="h-4 w-4 inline" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
