"use client";

import { useContext, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/app/lib/utils";

interface SubItem {
  icon: React.ReactNode;
  text: string;
  alert?: boolean;
  href: string;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  subItems?: SubItem[];
  href?: string;
  className?: string;
}

export function SidebarItem({
  icon,
  text,
  active = false,
  alert = false,
  subItems = [],
  href,
  className,
}: SidebarItemProps) {
  const { expanded, isMobile } = useSidebar();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  const hasSubItems = Array.isArray(subItems) && subItems.length > 0;

  const isActive =
    (href && (pathname === href || pathname.startsWith(`${href}/`))) ||
    (hasSubItems &&
      subItems.some(
        (item) =>
          item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`))
      ));

  useEffect(() => {
    if (subItems?.some((item) => item.href === pathname)) {
      setIsExpanded(true);
    }
  }, [pathname, subItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <li ref={itemRef} className={cn("relative group", className)}>
      {href && !hasSubItems ? (
        <Link href={href}>
          <div
            className={cn(
              "flex items-center py-3 px-3 my-1 rounded-md transition-colors",
              "group-hover:bg-black/10 dark:group-hover:bg-white/10",
              isActive || active
                ? "bg-black/20 dark:bg-white/20 text-white"
                : "text-white/90 hover:text-white"
            )}
          >
            <span className="flex items-center justify-center w-6 h-6">
              {icon}
              {alert && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
              )}
            </span>
            {expanded && (
              <span className="ml-3 font-medium transition-opacity duration-200">
                {text}
              </span>
            )}
          </div>
        </Link>
      ) : (
        <>
          <div
            className={cn(
              "flex items-center py-3 px-3 my-1 rounded-md transition-colors cursor-pointer",
              "group-hover:bg-black/10 dark:group-hover:bg-white/10",
              isActive || active
                ? "bg-black/20 dark:bg-white/20 text-white"
                : "text-white/90 hover:text-white",
              hasSubItems ? "justify-between" : ""
            )}
            onClick={handleClick}
          >
            <div className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6">
                {icon}
                {alert && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
                )}
              </span>
              {expanded && (
                <span className="ml-3 font-medium transition-opacity duration-200">
                  {text}
                </span>
              )}
            </div>

            {hasSubItems && (
              <span className={expanded ? "" : "ml-2"}>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 text-white/70 transition-transform duration-200",
                    isExpanded && expanded && "rotate-90"
                  )}
                />
              </span>
            )}
          </div>

          {/* Submenu Items - Expanded State */}
          {expanded && isExpanded && hasSubItems && (
            <ul className="ml-4 pl-3 border-l border-white/20">
              {subItems.map((subItem, index) => (
                <li key={index} className="mt-1">
                  <Link href={subItem.href}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-2 rounded-md text-sm transition-colors",
                        "hover:bg-black/10 dark:hover:bg-white/10",
                        pathname === subItem.href ||
                          pathname.startsWith(`${subItem.href}/`)
                          ? "bg-black/20 dark:bg-white/20 text-white"
                          : "text-white/80 hover:text-white"
                      )}
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        {subItem.icon}
                      </span>
                      <span className="ml-3">{subItem.text}</span>
                      {subItem.alert && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Submenu Items - Collapsed State */}
          {!expanded && isExpanded && hasSubItems && (
            <div className="ml-2 border-l-2 border-white/20">
              <ul className="py-1">
                {subItems.map((subItem, index) => (
                  <li key={index}>
                    <Link href={subItem.href}>
                      <div
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                          "hover:bg-black/10 dark:hover:bg-white/10",
                          pathname === subItem.href ||
                            pathname.startsWith(`${subItem.href}/`)
                            ? "bg-black/20 dark:bg-white/20 text-white"
                            : "text-white/80 hover:text-white"
                        )}
                      >
                        <span className="w-5 h-5 flex items-center justify-center mr-2">
                          {subItem.icon}
                        </span>
                        <span>{subItem.text}</span>
                        {subItem.alert && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </li>
  );
}