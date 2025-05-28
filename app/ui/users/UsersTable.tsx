'use client';
import { useEffect, useState, useRef } from "react";
import { 
  FiPlus, FiEdit2, FiMail, FiPhone, FiCheck, FiX, 
  FiClock, FiChevronUp, FiChevronDown, FiUserPlus, 
  FiSearch, FiFilter, FiDollarSign 
} from "react-icons/fi";
import NewUserRegistrationForm from "./addUserForm";
import { useGetAllUsersQuery } from "@/redux/api/adminApiSlice";
import { User } from "@/app/types/user";
import Link from "next/link";
import Modal from "./newUserModel";
import Pagination from "../pagination";
import { MdDetails, MdMore } from "react-icons/md";
import GenerateAccountNumber from "../Accounts/GenerateAccountNumber";
import CreateSavingAccount from "../Accounts/CreateSavingAccount";
import { useGetAllSavingTypeQuery } from "@/redux/api/settingApiSlice";
import { useAssignRoleTouserMutation } from "@/redux/api/userApiSlice";
import { toast } from "react-toastify";
import { format } from "date-fns";

type UserRole = "Customer" | "Admin" | "LoanOfficer" | "Accountant";

interface RoleOption {
  name: UserRole;
}

export default function UsersTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    verification: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [primaryColor, setPrimaryColor] = useState('#06685b');
  const [showRoleDropdown, setShowRoleDropdown] = useState<string | null>(null);
  const [assignRole] = useAssignRoleTouserMutation();
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  // Account generation states
  const [showGenerateAccountModal, setShowGenerateAccountModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [generatedAccountNumber, setGeneratedAccountNumber] = useState<any>(null);

  const { 
    data: usersData = [], 
    isLoading, 
    isError, 
    isFetching, 
    refetch 
  } = useGetAllUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: savingTypes = [] } = useGetAllSavingTypeQuery();

  const allRoles: RoleOption[] = [
    { name: 'Customer' },
    { name: 'Admin' },
    { name: 'LoanOfficer' },
    { name: 'Accountant' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showRoleDropdown && 
          dropdownRefs.current[showRoleDropdown] && 
          !dropdownRefs.current[showRoleDropdown]?.contains(event.target as Node)) {
        setShowRoleDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRoleDropdown]);

  // Sorting configuration
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof User; 
    direction: 'asc' | 'desc' 
  }>({
    key: 'firstName',
    direction: 'asc'
  });

  useEffect(() => {
    const storedColor = localStorage.getItem('primaryColor');
    if (storedColor) setPrimaryColor(storedColor);
  }, []);

  const handleRowClick = (userId: string) => {
    setSelectedRow(selectedRow === userId ? null : userId);
  };

  const handleAccountNumberGenerated = (accountNumber: any) => {
    setGeneratedAccountNumber(accountNumber);
    setShowGenerateAccountModal(false);
    setShowCreateAccountModal(true);
  };

  const handleAccountCreated = () => {
    setShowCreateAccountModal(false);
    setGeneratedAccountNumber(null);
    toast.success('Account created successfully!');
  };

  const handleUserCreated = () => {
    setIsModalOpen(false);
    setIsProcessing(false);
    refetch();
    setCurrentPage(1);
  };

  const handleStartProcessing = () => {
    setIsProcessing(true);
  };

  const requestSort = (key: keyof User) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      role: "",
      status: "",
      verification: ""
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const toggleRoleDropdown = (userId: string) => {
    setShowRoleDropdown(showRoleDropdown === userId ? null : userId);
  };

  const handleRoleChange = async (userId: string, roleName: UserRole) => {
    try {
      const response = await assignRole({
        userId,
        roleName
      }).unwrap();
      
      toast.success(response.message || "Role updated successfully!");
      refetch();
    } catch (error: any) {
      toast.error(
        error.data?.message || 
        error.message || 
        "Failed to update role"
      );
      console.error("Role update error:", error);
    } finally {
      setShowRoleDropdown(null);
    }
  };

  // Filter and search logic
  const filteredUsers = usersData.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filters.role ? user.role === filters.role : true;
    const matchesStatus = filters.status ? 
      (filters.status === 'active' ? user.isActive : !user.isActive) : true;
    const matchesVerification = filters.verification ? 
      (filters.verification === 'verified' ? user.isVerified : !user.isVerified) : true;

    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  // Sorting logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = String(a[sortConfig.key] || '');
    const bValue = String(b[sortConfig.key] || '');
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        Active
      </span>
    ) : (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        Inactive
      </span>
    );
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        Verified
      </span>
    ) : (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
        Unverified
      </span>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const roleColors = {
      Admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Customer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      LoanOfficer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Accountant: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[role]}`}>
        {role}
      </span>
    );
  };

  if (isLoading || isFetching) return (
    <div className="p-4 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2">Loading users...</p>
    </div>
  );

  if (isError) return (
    <div className="p-4 text-center text-red-500">
      <FiX className="inline-block mr-2" size={20} />
      Failed to load users. Please try again later.
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header, Search and Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
            style={{ 
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            <FiUserPlus className="text-lg" />
            <span>Add New User</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 w-full rounded-md border shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="pl-10 w-full rounded-md border shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Roles</option>
              {allRoles.map((role) => (
                <option key={role.name} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="pl-10 w-full rounded-md border shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              name="verification"
              value={filters.verification}
              onChange={handleFilterChange}
              className="pl-10 w-full rounded-md border shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Verifications</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-md transition-all hover:opacity-90"
            style={{ 
              backgroundColor: `${primaryColor}20`,
              color: primaryColor,
              border: `1px solid ${primaryColor}`
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => requestSort('firstName')}
                >
                  <div className="flex items-center">
                    User
                    {sortConfig.key === 'firstName' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Verification
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => requestSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created
                    {sortConfig.key === 'createdAt' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedRow === user.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => handleRowClick(user.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiMail className="text-gray-400 mr-2" size={14} />
                        <span className="text-sm text-gray-900 dark:text-white truncate max-w-[160px]">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiPhone className="text-gray-400 mr-2" size={14} />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.phoneNumber || 'Not provided'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getVerificationBadge(user.isVerified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative" ref={el => dropdownRefs.current[user.id] = el}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRoleDropdown(user.id);
                          }}
                          className="h-8 w-full flex items-center justify-between px-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        >
                          {getRoleBadge(user.role as UserRole)}
                          <FiChevronDown className="ml-1 h-4 w-4" />
                        </button>
                        
                        {showRoleDropdown === user.id && (
                          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-700 dark:border dark:border-gray-600">
                            <div className="py-1">
                              {allRoles
                                .filter(role => role.name !== user.role)
                                .map((role) => (
                                  <button
                                    key={role.name}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRoleChange(user.id, role.name);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                                  >
                                    {role.name}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
  href={{
    pathname: `/users/${user.id}/profile-detail`,
    query: { 
      userId: user.id,
      userData: JSON.stringify(user) 
    }
    
  }}
  style={{color:primaryColor,diplay:'flex'}}
>
                        {/* <MdMore className="mr-1" size={14} /> */}
                        More
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setShowGenerateAccountModal(true);
                        }}
                        className="inline-flex items-center transition-colors hover:opacity-80 text-blue-600 dark:text-blue-400"
                      >
                        <FiDollarSign className="mr-1" size={14} />
                        Create Account
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
              Rows per page:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              style={{
                borderColor: primaryColor
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedUsers.length)} of {sortedUsers.length} users
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              primaryColor={primaryColor}
            />
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={!isProcessing ? () => setIsModalOpen(false) : undefined}
        size="xl"
        disableClose={isProcessing}
        title={
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <FiUserPlus className="text-blue-600 dark:text-blue-300 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Add New User
            </h2>
          </div>
        }
      >
        <NewUserRegistrationForm 
          onCloseModal={handleUserCreated}
          onStartProcessing={handleStartProcessing}
        />
      </Modal>

      {/* Account Creation Modals */}
      <GenerateAccountNumber
        isOpen={showGenerateAccountModal}
        handleCloseModal={() => setShowGenerateAccountModal(false)}
        userId={selectedUserId}
        primaryColor={primaryColor}
        onAccountNumberGenerated={handleAccountNumberGenerated}
      />

      <CreateSavingAccount
        isOpen={showCreateAccountModal}
        handleCloseModal={handleAccountCreated}
        userId={selectedUserId}
        createdAccountNumber={generatedAccountNumber}
        savingTypes={savingTypes}
        primaryColor={primaryColor}
      />
    </div>
  );
}