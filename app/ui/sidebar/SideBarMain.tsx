// app/ui/sidebar/SideBarMain.tsx
'use client';

import { Sidebar } from "@/app/ui/sidebar/sidenav";
import { SidebarItem } from "@/app/ui/sidebar/sideNavItem";
import {
  Home,
  User2Icon,
  DollarSign,
  Settings,
  GitBranch,
} from "lucide-react";
import { useAuth } from "@/hooks/authHooks";
import { FaMoneyBill } from "react-icons/fa";

export default function SideBarMain({ userRole }: { userRole?: string }) {
  const sidebarItems = [
    {
      icon: <Home />,
      text: "Dashboard",
      href: "/dashboard",
      allowedRoles: ["Admin", "LoanOfficer", "Accountant", "Customer"],
    },
    // {
    //   icon: <GitBranch />,
    //   text: "Branch management",
    //   href: "/branch",
    //   allowedRoles: ["Admin"],
    // },
    {
      icon: <User2Icon />,
      text: "User Management",
      href: "/users",
      allowedRoles: ["Admin"],
    },
    {
      icon: <FaMoneyBill size={20} />,
      text: "Loans",
      href: "/loans",
      allowedRoles: ["Admin", "LoanOfficer"],
    },
    {
      icon: <DollarSign />,
      text: "Accounting",
      href: "/accounting",
      allowedRoles: ["Admin", "Accountant"],
    },
    {
      icon: <Settings />,
      text: "Settings",
      href: "/settings",
      allowedRoles: ["Admin"],
    }
  ];

  const filteredItems = sidebarItems.filter(item => 
    !item.allowedRoles || item.allowedRoles.includes(userRole || "")
  );

  return (
    <Sidebar>
      {filteredItems.map((item, index) => (
        <SidebarItem
          key={index}
          icon={item.icon}
          text={item.text}
          href={item.href}
        />
      ))}
    </Sidebar>
  );
}