"use client";

import {
  ChevronFirst,
  ChevronLast,
  MoreVertical,
  Power,
  Settings,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { expanded, toggleExpanded, isMobile } = useSidebar();
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [primaryColor, setPrimaryColor] = useState('#4f46e5'); // Default indigo-600

  useEffect(() => {
    const storedColor = localStorage.getItem('primaryColor') || '#4f46e5';
    setPrimaryColor(storedColor);
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

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

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleExpanded}
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "h-full flex flex-col border-r border-white/10 shadow-sm",
          "transition-all duration-300 ease-in-out fixed lg:relative z-50",
          expanded ? "w-64" : "w-20",
          isMobile && !expanded ? "-translate-x-full lg:translate-x-0" : ""
        )}
        style={{
          background: primaryColor,
        }}
      >
        {/* Header */}
        <div className="py-3 px-3 flex items-center justify-between border-b border-white/10 relative">
          {expanded ? (
            <Link href="/" className="flex items-center gap-3 w-full">
              <div className="h-10 w-10 min-w-[2.5rem] rounded-md bg-white/20 flex items-center justify-center text-white font-bold">
                Logo
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-md whitespace-nowrap overflow-hidden text-ellipsis text-white">
                  Credit Saving & Loan
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/" className="flex justify-center w-full">
              <div className="h-10 w-10 rounded-md bg-white/20 flex items-center justify-center text-white font-bold">
                S
              </div>
            </Link>
          )}

          <button
            onClick={toggleExpanded}
            className={cn(
              "absolute p-1.5 rounded-lg bg-white/10 hover:bg-white/20",
              "transition-colors z-50 text-white",
              expanded ? "right-0 -mr-3" : "-right-4"
            )}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <ChevronFirst className="w-5 h-5" />
            ) : (
              <ChevronLast className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">{children}</ul>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-white/10 flex p-3 relative">
          <div className="flex items-center w-full gap-3">
            <div ref={avatarRef} className="relative flex-shrink-0">
              {session?.user?.image ? (
                <Image
                  onClick={() => setShowMenu((prev) => !prev)}
                  src={session.user.image}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white/30 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                />
              ) : (
                <div
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                >
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {expanded && session?.user && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <h4 className="font-semibold whitespace-nowrap truncate text-white">
                  {session.user?.firstName +" "+session?.user?.lastName +"(" +"("+ session?.user?.role|| "User"}
                </h4>
                <span className="text-xs text-white/80 truncate block">
                  {session.user.email}
                </span>
              </div>
            )}

            {expanded && (
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
                aria-label="Account options"
              >
                <MoreVertical />
              </button>
            )}

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "absolute bg-white dark:bg-gray-800 rounded-md shadow-lg",
                    "border border-gray-200 dark:border-gray-700 z-50 py-1",
                    expanded
                      ? "right-0 bottom-12 w-48"
                      : "left-full ml-2 bottom-12 w-48"
                  )}
                >
                  <Link
                    href={`/users/${session?.user?.id}/profile-detail`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  {/* <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link> */}
                  <button
                    onClick={() => {
                      setShowConfirmDialog(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Sign Out Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full border dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2 dark:text-white">
                Confirm Sign Out
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to sign out?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}