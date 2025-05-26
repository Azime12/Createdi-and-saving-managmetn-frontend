// utils/helpers.ts

/**
 * Formats a number as Ethiopian Birr currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat('am-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback in case 'am-ET' is not supported
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
};

/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  try {
    return new Date(dateString).toLocaleDateString('am-ET', options);
  } catch (error) {
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
};

/**
 * Returns Tailwind CSS classes for status badges
 * @param status - The status to get classes for
 * @returns Tailwind CSS classes string
 */
export const getStatusBadge = (status: string): string => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'INACTIVE':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'CLOSED':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'DORMANT':
      return `${baseClasses} bg-purple-100 text-purple-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};