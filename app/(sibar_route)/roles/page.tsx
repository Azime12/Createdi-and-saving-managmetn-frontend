'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import {
  useGetAllRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation
} from '@/redux/api/rolePermissionApiSlice';
import { FiEdit2, FiPlus, FiSave, FiX, FiKey, FiSearch, FiUsers } from 'react-icons/fi';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'react-tooltip';
import Pagination from '@/app/ui/pagination';
import { usePageAccess } from '@/hooks/usePageAccess';

const RolesPage = () => {
  const [primaryColor, setPrimaryColor] = useState('#06685b');
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editingRoleName, setEditingRoleName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { canAccess, loading } = usePageAccess('view', 'roles')

  const itemsPerPage = 5; // You can adjust this number as needed

  const { data: rolesResponse, isLoading, isError, error, refetch } = useGetAllRoleQuery(undefined);
  const roles = rolesResponse?.roles || [];

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();


  useEffect(() => {
    const storedColor = localStorage.getItem('primaryColor');
    if (storedColor) setPrimaryColor(storedColor);
  }, []);

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.id.toString().includes(searchTerm)
  );

  // Pagination calculations
  const totalItems = filteredRoles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 dark:text-gray-300 text-lg">Checking access...</p>
        </div>
      )
    }
  
    if (!canAccess) return null // Redirect handled inside hook
  
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.warning('Please enter a role name');
      return;
    }

    try {
      await createRole({ name: newRoleName }).unwrap();
      toast.success('Role created successfully');
      setNewRoleName('');
      setIsModalOpen(false);
      refetch();
      setCurrentPage(1); // Reset to first page after creation
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to create role');
    }
  };

  const startEdit = (role: { id: number; name: string }) => {
    setEditingRoleId(role.id);
    setEditingRoleName(role.name);
  };

  const cancelEdit = () => {
    setEditingRoleId(null);
    setEditingRoleName('');
  };

  const saveEdit = async () => {
    if (!editingRoleId || !editingRoleName.trim()) {
      toast.warning('Please enter a valid role name');
      return;
    }

    try {
      await updateRole({ id: editingRoleId, name: editingRoleName }).unwrap();
      toast.success('Role updated successfully');
      cancelEdit();
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id).unwrap();
        toast.success('Role deleted successfully');
        refetch();
        // Adjust current page if we deleted the last item on the current page
        if (paginatedRoles.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err: any) {
        toast.error(err.data?.message || 'Failed to delete role');
      }
    }
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
      <div className="text-center p-8 text-red-500">
        {error?.data?.message || 'Failed to load roles'}
        <button 
          onClick={() => refetch()} 
          className="ml-4 px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
          style={{ backgroundColor: primaryColor }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
            <FiUsers className="w-6 h-6" style={{ color: primaryColor }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalItems} {totalItems === 1 ? 'role' : 'roles'} found • Manage access and permissions
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              style={{ '--tw-ring-color': primaryColor }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
              style={{ backgroundColor: primaryColor }}
            >
              <FiPlus className="w-4 h-4" />
              <span>New Role</span>
            </button>
            <Link
              href="/roles/permissions"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm border border-gray-200 whitespace-nowrap"
              data-tooltip-id="permissions-tooltip"
              data-tooltip-content="Manage role permissions"
            >
              <FiKey className="w-4 h-4" />
              <span>Permissions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative border border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            <form onSubmit={handleCreateRole}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiPlus className="w-5 h-5" style={{ color: primaryColor }} />
                <span>Create New Role</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name
                  </label>
                  <input
                    id="roleName"
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g., Administrator"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                    style={{ '--tw-ring-color': primaryColor }}
                    required
                    minLength={3}
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
                    <FiPlus className="w-4 h-4" />
                    <span>Create Role</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Roles Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> */}
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRoles.length > 0 ? (
                paginatedRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRoleId === role.id ? (
                        <input
                          type="text"
                          value={editingRoleName}
                          onChange={(e) => setEditingRoleName(e.target.value)}
                          className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none w-full max-w-xs"
                          style={{ 
                            '--tw-ring-color': primaryColor,
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium px-7 text-gray-900">{role.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {editingRoleId === role.id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                              style={{ backgroundColor: primaryColor }}
                              data-tooltip-id="save-tooltip"
                              data-tooltip-content="Save changes"
                            >
                              <FiSave className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEdit}
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
                              onClick={() => startEdit(role)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                              data-tooltip-id="edit-tooltip"
                              data-tooltip-content="Edit role"
                            >
                              <FiEdit2 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <Link
                              href={`/roles/${role.id}/permissions`}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                              data-tooltip-id="perms-tooltip"
                              data-tooltip-content="Manage permissions"
                            >
                              <FiKey className="w-4 h-4" />
                              <span>Permissions</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
                              data-tooltip-id="delete-tooltip"
                              data-tooltip-content="Delete role"
                            >
                              <TrashIcon className="w-4 h-4" />
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
                      <FiUsers className="w-12 h-12 opacity-40" />
                      <p className="text-lg font-medium">No roles found</p>
                      <p className="text-sm max-w-md">
                        {searchTerm 
                          ? "No roles match your search criteria. Try a different search term."
                          : "You haven't created any roles yet. Get started by adding a new role."}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-3 flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <FiPlus className="w-4 h-4" />
                          <span>Create New Role</span>
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
      Showing{' '}
      <span className="font-medium">
        {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
      </span>{' '}
      to{' '}
      <span className="font-medium">
        {Math.min(currentPage * itemsPerPage, totalItems)}
      </span>{' '}
      of <span className="font-medium">{totalItems}</span> roles
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
      <Tooltip id="perms-tooltip" />
      <Tooltip id="save-tooltip" />
      <Tooltip id="cancel-tooltip" />
      <Tooltip id="permissions-tooltip" />
    </div>
  );
};

export default RolesPage;