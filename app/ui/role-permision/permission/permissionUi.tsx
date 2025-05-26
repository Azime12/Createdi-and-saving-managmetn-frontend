'use client';

import { useEffect, useState } from 'react';
import {
  useGetAllPermissionQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
} from '@/redux/api/rolePermissionApiSlice';
import { toast } from 'react-toastify';
import { FiSave, FiX, FiEdit2, FiPlus, FiKey, FiTrash2, FiSearch } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { FileKey } from 'lucide-react';
import Pagination from '@/app/ui/pagination';

const PermissionsPage = () => {
  const [newPermissionName, setNewPermissionName] = useState('');
  const [editingPermission, setEditingPermission] = useState<string | null>(null);
  const [editPermissionName, setEditPermissionName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#06685b');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, error, isLoading, refetch } = useGetAllPermissionQuery();
  const [createPermission] = useCreatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  useEffect(() => {
    const color = localStorage.getItem('primaryColor');
    if (color) setPrimaryColor(color);
  }, []);

  const permissions = Array.isArray(data?.permissions) ? data.permissions : [];

  // Filter permissions based on search term
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredPermissions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPermissionName.trim().length < 3) {
      toast.error('Permission name must be at least 3 characters');
      return;
    }

    try {
      await createPermission({ name: newPermissionName }).unwrap();
      toast.success('Permission created successfully');
      setNewPermissionName('');
      // setIsModalOpen(false);
      refetch();
      setCurrentPage(1); // Reset to first page after creation
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create permission');
    }
  };

  const handleUpdatePermission = async (id: string) => {
    if (editPermissionName.trim().length < 3) {
      toast.error('Permission name must be at least 3 characters');
      return;
    }
    try {
      // await updatePermission({ id, name: editPermissionName }).unwrap();
      toast.success('Permission updated (mock)');
      setEditingPermission(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update permission');
    }
  };

  const handleDeletePermission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission? This action cannot be undone.')) return;
    try {
      await deletePermission(id).unwrap();
      toast.info('Permission deleted successfully');
      refetch();
      // Adjust current page if we deleted the last item on the current page
      if (paginatedPermissions.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete permission');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner color={primaryColor} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          Failed to load permissions: {error?.data?.message || 'Unknown error'}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: primaryColor }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
            <FiKey className="w-6 h-6" style={{ color: primaryColor }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Permission Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalItems} {totalItems === 1 ? 'permission' : 'permissions'} found • Manage access controls
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              style={{ '--tw-ring-color': primaryColor }}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
            style={{ backgroundColor: primaryColor }}
            data-tooltip-id="create-permission-tooltip"
            data-tooltip-content="Create new permission"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Permission</span>
          </button>
        </div>
      </div>
      <Tooltip id="create-permission-tooltip" />

      {/* Create Permission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative border border-gray-100 animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              data-tooltip-id="close-modal-tooltip"
              data-tooltip-content="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
            <Tooltip id="close-modal-tooltip" />
            
            <form onSubmit={handleCreatePermission} className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiKey className="w-5 h-5" style={{ color: primaryColor }} />
                <span>Create New Permission</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="permissionName" className="block text-sm font-medium text-gray-700 mb-1">
                    Permission Name
                  </label>
                  <input
                    id="permissionName"
                    type="text"
                    value={newPermissionName}
                    onChange={(e) => setNewPermissionName(e.target.value)}
                    placeholder="e.g., user.create"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ '--tw-ring-color': primaryColor }}
                    required
                    minLength={3}
                    maxLength={50}
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <FileKey className="w-4 h-4" />
                    <span>Create</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th> */}
                <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPermissions.length > 0 ? (
                paginatedPermissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {permission.id}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingPermission === permission.id ? (
                        <input
                          type="text"
                          value={editPermissionName}
                          onChange={(e) => setEditPermissionName(e.target.value)}
                          className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none w-full max-w-xs"
                          style={{ '--tw-ring-color': primaryColor }}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium px-7 text-gray-900">{permission.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {editingPermission === permission.id ? (
                          <>
                            <button
                              onClick={() => handleUpdatePermission(permission.id)}
                              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                              style={{ backgroundColor: primaryColor }}
                              data-tooltip-id="save-tooltip"
                              data-tooltip-content="Save changes"
                            >
                              <FiSave className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingPermission(null)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                              data-tooltip-id="cancel-tooltip"
                              data-tooltip-content="Cancel editing"
                            >
                              <FiX className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingPermission(permission.id);
                                setEditPermissionName(permission.name);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                              data-tooltip-id="edit-tooltip"
                              data-tooltip-content="Edit permission"
                            >
                              <FiEdit2 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeletePermission(permission.id)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
                              data-tooltip-id="delete-tooltip"
                              data-tooltip-content="Delete permission"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <FiKey className="w-12 h-12 opacity-40" />
                      <p className="text-lg font-medium">No permissions found</p>
                      <p className="text-sm max-w-md">
                        {searchTerm 
                          ? "No permissions match your search criteria. Try a different search term."
                          : "You haven't created any permissions yet. Get started by adding a new permission."}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-3 flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <FiPlus className="w-4 h-4" />
                          <span>Create New Permission</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> permissions
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              primaryColor={primaryColor}
            />
          </div>
        )}
      </div>

      {/* Tooltips */}
      <Tooltip id="edit-tooltip" />
      <Tooltip id="delete-tooltip" />
      <Tooltip id="save-tooltip" />
      <Tooltip id="cancel-tooltip" />
    </div>
  );
};

export default PermissionsPage;