'use client';
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX, FiRefreshCw } from 'react-icons/fi';
import { 
  useGetAllLoanTypesQuery,
  useCreateLoanTypeMutation,
  useUpdateLoanTypeMutation,
  useDeleteLoanTypeMutation,
  useRestoreLoanTypeMutation
} from '@/redux/api/loanTypeApiSlice';
import { useState } from 'react';
import AddLoanType from '../addLoanType';
import { LoanType } from '@/types';
import Pagination from '../../pagination';

interface Props {
  formatCurrency: (amount: number) => string;
  primaryColor: string;
}

export default function LoanTypesTab({
  formatCurrency,
  primaryColor,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LoanType | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // API Query
  const { data: apiResponse, isLoading, isError, refetch } = useGetAllLoanTypesQuery();
  
  // Get loanTypes from response or default to empty array
  const loanTypes = apiResponse?.data?.loanTypes || [];

  // API Mutations
  const [createLoanType] = useCreateLoanTypeMutation();
  const [updateLoanType] = useUpdateLoanTypeMutation();
  const [deleteLoanType] = useDeleteLoanTypeMutation();
  const [restoreLoanType] = useRestoreLoanTypeMutation();

  // Filter and pagination logic
  const filteredLoanTypes = loanTypes.filter(loanType => 
    (includeInactive || loanType.is_active) &&
    (loanType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (loanType.description?.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLoanTypes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLoanTypes.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleEdit = (item: LoanType) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this loan type?')) {
      try {
        await deleteLoanType(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete loan type:', error);
      }
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreLoanType(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to restore loan type:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" 
           style={{ borderColor: primaryColor }} />
    </div>
  );

  if (isError) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <FiX className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            Failed to load loan types. Please try again later.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Loan Types</h2>
          <button 
            onClick={() => refetch()}
            className="p-1 rounded-md hover:bg-gray-100"
            title="Refresh data"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>
        </div>
        
        <button
          onClick={() => setIncludeInactive(!includeInactive)}
          className="px-3 py-1 rounded-md text-sm"
          style={{ 
            backgroundColor: includeInactive ? primaryColor : 'transparent',
            color: includeInactive ? 'white' : 'inherit',
            border: `1px solid ${primaryColor}`
          }}
        >
          {includeInactive ? 'Hide Inactive' : 'Show Inactive'}
        </button>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            placeholder="Search loan types..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ 
            backgroundColor: primaryColor,
            '--tw-ring-color': `${primaryColor}80`,
          } as React.CSSProperties}
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Loan Type
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No loan types found
                  </td>
                </tr>
              ) : (
                currentItems.map((loanType) => (
                  <tr key={loanType.id} className={!loanType.is_active ? "bg-gray-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {loanType.name}
                        </div>
                        {loanType.deletedAt && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Deleted
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{loanType.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(parseFloat(loanType.min_amount))} - {formatCurrency(parseFloat(loanType.max_amount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loanType.min_term} - {loanType.max_term} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 rounded-full bg-opacity-10" 
                            style={{ 
                              backgroundColor: `${primaryColor}20`, 
                              color: primaryColor 
                            }}>
                        {loanType.interest_rate}% ({loanType.payment_frequency})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        loanType.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {loanType.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {loanType.deletedAt ? (
                          <button
                            onClick={() => handleRestore(loanType.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Restore"
                          >
                            <FiRefreshCw className="h-4 w-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(loanType)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(loanType.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLoanTypes.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredLoanTypes.length)}</span> of{' '}
                  <span className="font-medium">{filteredLoanTypes.length}</span> results
                </p>
              </div>
              <div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  primaryColor={primaryColor}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <AddLoanType
                initialData={editingItem}
                onClose={handleCloseModal}
                primaryColor={primaryColor}
                createLoanType={createLoanType}
                updateLoanType={updateLoanType}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}