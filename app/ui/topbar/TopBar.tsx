"use client";

import { Menu, Bell, User, Power, Settings, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/app/lib/utils";

export function TopBar() {
  const { toggleExpanded, isMobile } = useSidebar();
  const { data: session, status } = useSession();
  const { theme, resolvedTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [isScrolled, setIsScrolled] = useState(false);

  // Load primary color from localStorage
  useEffect(() => {
    const storedColor = localStorage.getItem('primaryColor') || '#4f46e5';
    setPrimaryColor(storedColor);
  }, []);

  // Scroll detection for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearNotifications = () => {
    setHasUnreadNotifications(false);
    setNotificationCount(0);
  };

  // Generate initials from name
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  // Calculate text color based on background color
  const getTextColor = (bgColor: string) => {
    const hex = bgColor.replace('#', '');
  
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };
  

  const textColor = getTextColor(primaryColor);

  return (
<header 
  className={cn(
    "sticky top-0 z-40 flex justify-between items-center px-4 sm:px-6 py-3 transition-all duration-300",
    "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
    isScrolled ? "shadow-lg" : "shadow-md"
  )}
  style={{ 
    background: resolvedTheme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    // Subtle colored shadow instead of border
    boxShadow: `0 1px 3px 0 ${primaryColor}20, 0 1px 2px -1px ${primaryColor}20`,
    ...(isScrolled && {
      boxShadow: `0 4px 6px -1px ${primaryColor}20, 0 2px 4px -2px ${primaryColor}20`
    })
  }}
>
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleExpanded}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          aria-label="Toggle menu"
          style={{ color: primaryColor }}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs or Page title */}
        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate max-w-[180px] sm:max-w-none">
            Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications with badge */}
        <div className="relative">
          <button 
            className={cn(
              "p-2 rounded-full transition-all relative",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              resolvedTheme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'
            )}
            onClick={clearNotifications}
            aria-label="Notifications"
            style={{ 
              color: primaryColor,
              '--tw-ring-color': primaryColor
            } as React.CSSProperties}
          >
            <Bell className="w-5 h-5" />
            {hasUnreadNotifications && (
              <>
                <span 
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: primaryColor }}
                />
                {notificationCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ 
                      backgroundColor: primaryColor,
                      color: textColor
                    }}
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </>
            )}
          </button>
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <div
            ref={avatarRef}
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="User menu"
            aria-expanded={showMenu}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full border-2 transition-all group-hover:ring-2 group-hover:ring-offset-2"
                style={{ 
                  borderColor: primaryColor,
                  '--tw-ring-color': primaryColor,
                  '--tw-ring-offset-color': resolvedTheme === 'dark' ? '#111827' : '#fff'
                } as React.CSSProperties}
              />
            ) : (
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all group-hover:ring-2 group-hover:ring-offset-2"
                style={{ 
                  backgroundColor: primaryColor,
                  color: textColor,
                  '--tw-ring-color': primaryColor,
                  '--tw-ring-offset-color': resolvedTheme === 'dark' ? '#111827' : '#fff'
                } as React.CSSProperties}
              >
                {getInitials(session?.user?.firstName)}
              </div>
            )}
            <div className="hidden md:flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {session?.user?.firstName || "User"}
              </span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${showMenu ? "rotate-180" : ""}`}
                style={{ color: primaryColor }}
              />
            </div>
          </div>

          {/* Dropdown menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {session?.user?.firstName + " " + session?.user?.lastName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
                
                <div className="py-1">
                  <Link
                    href={`/users/${session?.user?.id}/profile-detail`}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm w-full text-left",
                      "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                      "transition-colors duration-150"
                    )}
                    onClick={() => setShowMenu(false)}
                    style={{ color: primaryColor }}
                  >
                    <User className="mr-3 h-4 w-4 flex-shrink-0" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className={cn(
                      "flex items-center px-4 py-2 text-sm w-full text-left",
                      "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                      "transition-colors duration-150"
                    )}
                    onClick={() => setShowMenu(false)}
                    style={{ color: primaryColor }}
                  >
                    <Settings className="mr-3 h-4 w-4 flex-shrink-0" />
                    Settings
                  </Link>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm w-full text-left",
                      "text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                      "transition-colors duration-150",
                      loading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    <Power className="mr-3 h-4 w-4 flex-shrink-0" />
                    {loading ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}