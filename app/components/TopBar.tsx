"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  XMarkIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  PowerIcon
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface TopBarProps {
  isCollapsed: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export default function TopBar({ isCollapsed, isMobile, toggleSidebar }: TopBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMobileSearch]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const pathSegments = pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1] || "dashboard";

  return (
    <>
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setShowMobileSearch(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
              <button
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Top Bar */}
      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: 0,
          backdropFilter: isScrolled ? "blur(8px)" : "none",
          backgroundColor: isScrolled
            ? theme === "dark"
              ? "rgba(31, 41, 55, 0.8)"
              : "rgba(255, 255, 255, 0.8)"
            : theme === "dark"
            ? "rgba(31, 41, 55, 1)"
            : "rgba(255, 255, 255, 1)",
          boxShadow: isScrolled
            ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
            : "none"
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 h-16 z-40 flex items-center px-4 ${
          isMobile ? "w-full left-0" : isCollapsed ? "w-[calc(100%-5rem)] left-20" : "w-[calc(100%-16rem)] left-64"
        } transition-colors duration-300 border-b border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center space-x-2 text-sm">
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-800 dark:text-gray-200 capitalize">
                {currentPage}
              </span>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            {!isMobile && (
              <motion.div
                initial={{ width: 200 }}
                animate={{ width: isCollapsed ? 200 : 280 }}
                transition={{ duration: 0.3 }}
                className="hidden md:flex items-center relative"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </motion.div>
            )}

            {/* Mobile Search Button */}
            {isMobile && (
              <button
                onClick={() => setShowMobileSearch(true)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}

            {/* Notification Bell */}
            <button
              className="p-2 relative rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Toggle ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 focus:outline-none group"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium overflow-hidden border-2 border-transparent group-hover:border-blue-300 transition-colors">
                  <Image
                    src="/profile-placeholder.jpg"
                    alt="User profile"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                {!isMobile && !isCollapsed && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-1">
                      John Doe
                    </span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                        showProfileDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                )}
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        John Doe
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        admin@example.com
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Cog6ToothIcon className="w-5 h-5 mr-2" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => console.log("Logging out...")}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <PowerIcon className="w-5 h-5 mr-2" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}