import { Revenue } from './definitions';
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
import { Permission, Action, AppSubject } from '../lib/ability';

// Helper to convert hex to RGB
export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Helper to check if color is light
export function isLightColor(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

// app/utils/permissionsUtil.ts

export const DEFAULT_PERMISSIONS: Permission[] = [
  { action: 'view', subject: 'dashboard' },
  { action: 'view', subject: 'profile' },
];

export function convertBackendPermission(permissionString: string): Permission {
  const actionMap: Record<string, Action> = {
    add: 'create',
    create: 'create',
    edit: 'update',
    update: 'update',
    delete: 'delete',
    remove: 'delete',
    view: 'view',
    assign: 'manage',
    detail: 'view',
  };

  const subjectMap: Record<string, AppSubject> = {
    user: 'user',
    role: 'roles',
    permission: 'permissions',
    notification: 'notifications',
    saving: 'saving',
    loan: 'loans',
    branch: 'branches',
    dashboard: 'dashboard',
    setting: 'settings',
    invoice: 'invoices',
  };

  const conditionalPermissions: Record<string, any> = {
    assign_roles_to_users: { canAssignRoles: true },
    assign_permission_to_roles: { canManagePermissions: true },
  };

  const parts = permissionString.split('_');
  let actionPart = parts[0];
  let subjectPart = parts[parts.length - 1];

  if (permissionString === 'remove_permission') {
    actionPart = 'delete';
    subjectPart = 'permissions';
  }

  const action = actionMap[actionPart] || 'view';
  const subject = subjectMap[subjectPart] || subjectPart;
  const conditions = conditionalPermissions[permissionString];

  return conditions
    ? { action, subject, conditions }
    : { action, subject };
}
