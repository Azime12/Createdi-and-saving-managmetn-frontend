'use client';
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { useGetAllSavingTypeQuery } from '@/redux/api/settingApiSlice';
import { useEffect, useState } from 'react';
import AddSavingTypes from '../addSavingTypes';
import { SavingType } from '@/types';
import Pagination from '../../pagination';

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  formatCurrency: (amount: number) => string;
}

export default function SavingsTypesTab({
  searchTerm,
  setSearchTerm,
  formatCurrency,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this configurable
  const { data: savingsTypes = [], isLoading, isError, refetch } = useGetAllSavingTypeQuery();
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SavingType | null>(null);

  useEffect(() => {
    const storedColor = localStorage.getItem('primaryColor');
    if (storedColor) setPrimaryColor(storedColor);
  }, []);

  // Filter savings types based on search term
  const filteredSavingsTypes = savingsTypes.filter((savingsType) =>
    savingsType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (savingsType.description && savingsType.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSavingsTypes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSavingsTypes.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (item: SavingType) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: primaryColor }}
        ></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load savings types. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Add */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            placeholder="Search savings types..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
          style={{ 
            backgroundColor: primaryColor,
            '--tw-ring-color': `${primaryColor}80`,
          } as React.CSSProperties}
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Savings Type
        </button>
      </div>

      {/* Table Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full max-h-[calc(100vh-300px)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saving Type</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Balance</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawal</th>
                  <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
                  <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty</th>
                  <th className="hidden 2xl:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-500">
                      No savings types found. Try a different search or add a new one.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((savingsType) => (
                    <tr key={savingsType.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{savingsType.name}</div>
                        <div className="md:hidden text-xs text-gray-500 mt-1">
                          {savingsType.description || 'Not provided'}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {savingsType.description || 'Not provided'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(savingsType.minBalance)}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 rounded-full bg-opacity-10" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                          {savingsType.interestRate}%
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {savingsType.withdrawalLimit}
                      </td>
                      <td className="hidden xl:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {savingsType.tenureInMonths} mo
                      </td>
                      <td className="hidden xl:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {savingsType.penaltyRate}%
                      </td>
                      <td className="hidden 2xl:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(savingsType.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(savingsType)} 
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            style={{ color: primaryColor }}
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredSavingsTypes.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredSavingsTypes.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredSavingsTypes.length}</span> results
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

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60"
              aria-hidden="true"
              onClick={handleCloseModal}
            />
            <div
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
             <button
  onClick={handleCloseModal}
  className="absolute top-4 right-4 p-1 rounded-md hover:bg-red-50 transition-colors duration-200 focus:outline-none"
  aria-label="Close modal"
>
  <FiX className="h-5 w-5 text-red-500 hover:text-red-700" />
</button>
              <AddSavingTypes 
                initialData={editingItem}
                onClose={handleCloseModal}
                primaryColor={primaryColor}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}