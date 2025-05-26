'use client'

import React from 'react'
import { Sidebar } from '@/app/ui/sidebar/sidenav'
import { SidebarItem } from '@/app/ui/sidebar/sideNavItem'
import {
  Home,
  User2Icon,
  GitBranchPlusIcon,
  DollarSign,
  Settings2,
  Bell,
  Lock,
  Lock as LockIcon,
  Key,
  User2,
  SettingsIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAbility } from '@/context/AbilityContext'
import { FaMoneyBill } from 'react-icons/fa'

interface SidebarItemType {
  icon: React.JSX.Element
  text: string
  href: string
  subject: string
  subItems?: SidebarItemType[]
  alert?: boolean
}

function SideBarMain() {
  const { theme } = useTheme()
  const ability = useAbility()

  const sidebarItems: SidebarItemType[] = [
    {
      icon: <Home />,
      text: 'Dashboard',
      href: '/dashboard',
      subject: 'dashboard',
      subItems: [
        { icon: <LockIcon size={15} />, text: 'Invoices', href: '/dashboard/invoices', subject: 'invoices' },
        { icon: <Key size={15} />, text: 'Customers', href: '/dashboard/customers', subject: 'customers' },
      ],
    },
    {
      icon: <User2Icon />,
      text: 'User Management',
      href: '/users',
      subject: 'user',
    },
    {
      icon: <GitBranchPlusIcon />,
      text: 'Branches',
      href: '/branch',
      subject: 'branches',
    },
    {
      icon: <DollarSign />,
      text: 'Saving',
      href: '/saving',
      subject: 'saving',
    },
    {
      icon: <FaMoneyBill size={20} />,
      text: 'Loans',
      href: '/loan',
      subject: 'loans',
    },
    {
      icon: <SettingsIcon />,
      text: 'Settings',
      subject: 'settings',
      subItems: [
        { icon: <User2 size={15} />, text: 'Roles', href: '/roles', subject: 'roles' },
        { icon: <Key size={15} />, text: 'Permissions', href: '/permissions', subject: 'permissions' },
      ],
      href: ''
    },
    {
      icon: <Lock />,
      text: 'Security',
      subject: 'security',
      subItems: [
        { icon: <LockIcon size={15} />, text: 'Password', href: '/security/password', subject: 'password' },
        { icon: <Key size={15} />, text: '2FA', href: '/security/2fa', subject: '2fa' },
      ],
      href: ''
    },
    {
      icon: <Bell />,
      text: 'Notifications',
      href: '/notifications',
      subject: 'notifications',
      alert: true,
    },
  ]

  const filteredItems = sidebarItems.filter((item) => {
    const canViewMain = item.subject ? ability.can('view', item.subject) : true
    const visibleSubItems = item.subItems?.filter((sub) =>
      sub.subject ? ability.can('view', sub.subject) : true
    ) || []

    // Update the subItems to be the filtered subItems array or empty
    item.subItems = visibleSubItems

    return canViewMain || (item.subItems.length > 0)
  })

  return (
    <Sidebar>
      {filteredItems.map((item, index) => (
        <SidebarItem
          key={index}
          icon={item.icon}
          text={item.text}
          href={item.href}
          alert={item.alert}
          subItems={item.subItems}
        />
      ))}
    </Sidebar>
  )
}

export default SideBarMain
