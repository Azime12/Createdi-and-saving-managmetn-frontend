'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useGetRolePermissionsQuery,
  useAssignPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
  useGetAllPermissionsQuery,
} from '@/redux/api/rolePermissionApiSlice';
import { FiArrowLeft, FiSearch, FiKey } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { usePageAccess } from '@/hooks/usePageAccess';

const RolePermissionsPage = () => {
  const { roleId } = useParams();
  const router = useRouter();

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#06685b');
  const [isProcessing, setIsProcessing] = useState(false);
  // const { canAccess, loading } = usePageAccess('detail', 'roles')
  // Redirect handled inside hoo
  // Fetch role permissions for the given role
  const {
    data: rolePermissionsData,
    isLoading: loadingRolePerms,
    isError: rolePermsError,
    refetch: refetchRolePermissions,
  } = useGetRolePermissionsQuery(Number(roleId));

  // Fetch all available permissions
  const {
    data: allPermissionsData,
    isLoading: loadingAllPerms,
    isError: allPermsError,
    refetch: refetchAllPermissions,
  } = useGetAllPermissionsQuery();

  // Mutations for assigning and removing permissions
  const [assignPermission] = useAssignPermissionToRoleMutation();
  const [removePermission] = useRemovePermissionFromRoleMutation();

  // Effect to handle color and selected permissions
  useEffect(() => {
    const storedColor = localStorage.getItem('primaryColor');
    if (storedColor) setPrimaryColor(storedColor);

    // Extract selected permissions from rolePermissionsData
    if (rolePermissionsData?.permissions) {
      setSelectedPermissions(rolePermissionsData.permissions.map((perm) => perm.id));
    }
  }, [rolePermissionsData]);

  // Handle retry for failed requests
  const handleRetry = async () => {
    await Promise.all([refetchRolePermissions(), refetchAllPermissions()]);
  };

  // Toggle function for assigning/removing permissions via checkbox
  const handleCheckboxChange = async (permissionId: number) => {
    const isSelected = selectedPermissions.includes(permissionId);
    setIsProcessing(true);

    try {
      if (isSelected) {
        await removePermission({ roleId: Number(roleId), permissionId }).unwrap();
        toast.success('Permission removed successfully');
      } else {
        await assignPermission({ roleId: Number(roleId), permissionId }).unwrap();
        toast.success('Permission assigned successfully');
      }

      // Optimistically update the UI
      setSelectedPermissions((prev) =>
        isSelected
          ? prev.filter((id) => id !== permissionId)
          : [...prev, permissionId]
      );

      // Refresh data from server
      await refetchRolePermissions();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Operation failed. Please try again.');
      // Revert optimistic update if failed
      setSelectedPermissions((prev) =>
        isSelected
          ? [...prev, permissionId]
          : prev.filter((id) => id !== permissionId)
      );
    } finally {
      setIsProcessing(false);
    }
  };
 
  // Filter the permissions based on the search term
  const filteredPermissions = allPermissionsData?.permissions?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p className="text-gray-600 dark:text-gray-300 text-lg">Checking access...</p>
  //     </div>
  //   )
  // }

  // if (!canAccess) return null // Redirect handled inside hook

  if (loadingRolePerms || loadingAllPerms) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner color={primaryColor} />
      </div>
    );
  }

  // Error state
  if (rolePermsError || allPermsError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.push('/dashboard/roles')}
          className="flex items-center gap-2 mb-6 text-sm hover:underline"
          style={{ color: primaryColor }}
        >
          <FiArrowLeft />
          Back to Roles
        </button>

        <div className="text-center p-8 bg-white rounded-lg shadow">
          <div className="text-red-500 mb-4">
            Failed to load permissions: {rolePermsError?.data?.message || allPermsError?.data?.message || 'Unknown error'}
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.push('/dashboard/roles')}
        className="flex items-center gap-2 mb-6 text-sm hover:underline"
        style={{ color: primaryColor }}
        data-tooltip-id="back-tooltip"
        data-tooltip-content="Return to roles list"
      >
        <FiArrowLeft />
        Back to Roles
      </button>
      <Tooltip id="back-tooltip" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
            Manage Role Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {rolePermissionsData?.role?.name || 'Role'} permissions
          </p>
        </div>
      </div>

      <div className="mb-6 relative">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-md w-full focus:ring-2 focus:outline-none"
            style={{ 
              '--tw-ring-color': primaryColor,
              focusRingColor: primaryColor 
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiKey style={{ color: primaryColor }} />
            <span>Available Permissions</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-auto">
              {filteredPermissions.length} permissions
            </span>
          </h2>
        </div>

        {filteredPermissions.length > 0 ? (
          <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
            {filteredPermissions.map((perm) => {
              const isSelected = selectedPermissions.includes(perm.id);
              return (
                <li 
                  key={perm.id} 
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(perm.id)}
                        disabled={isProcessing}
                        className="form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-offset-2 transition-colors"
                        style={{
                          borderColor: isSelected ? primaryColor : '#d1d5db',
                          backgroundColor: isSelected ? primaryColor : 'white',
                          '--tw-ring-color': primaryColor,
                        }}
                      />
                    </label>
                    <div>
                      <p className="font-medium capitalize">{perm.name}</p>
                      {/* <p className="text-xs text-gray-500">ID: {perm.id}</p> */}
                    </div>
                  </div>
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${
                      isSelected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {isSelected ? 'Assigned' : 'Not assigned'}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">No permissions found</div>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm hover:underline"
                style={{ color: primaryColor }}
              >
                Clear search
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                There are no permissions available to assign to this role
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePermissionsPage;