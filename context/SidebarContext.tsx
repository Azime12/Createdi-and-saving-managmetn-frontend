"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  expanded: boolean;
  isMobile: boolean;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  expanded: false,
  isMobile: false,
  toggleExpanded: () => {},
  setExpanded: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setExpanded(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{ expanded, isMobile, toggleExpanded, setExpanded }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);