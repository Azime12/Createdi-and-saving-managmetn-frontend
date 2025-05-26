'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  
];

export default function NavLinks({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <div key={link.href} className="relative group">
            <Link
              href={link.href}
              className={clsx(
                'flex items-center gap-2 p-3 rounded-md hover:bg-blue-100 text-gray-700 transition',
                {
                  'bg-blue-100 text-blue-600': pathname === link.href,
                  'justify-center': isCollapsed,
                  'justify-start': !isCollapsed,
                }
              )}
            >
              <LinkIcon className="w-6" />
              {!isCollapsed && <span>{link.name}</span>}
            </Link>

            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
              <span className="absolute left-16 top-2 px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition">
                {link.name}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}

