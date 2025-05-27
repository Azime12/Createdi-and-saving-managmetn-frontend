// src/app/ui/layout/DashboardLayout.tsx
'use client';
import { SidebarProvider } from '@/context/SidebarContext';
import { TopBar } from '@/app/ui/topbar/TopBar';
import SideBarMain from '@/app/ui/sidebar/SideBarMain';
import { AbilityProvider } from '@/context/AbilityContext';
import { useAuthRedirect, usePermissions } from '@/hooks/authHooks';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuthRedirect();
  const { permissions } = usePermissions();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AbilityProvider permissions={permissions}>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <SideBarMain />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-y-auto pt-8 pb-4 px-4 bg-gray-100 dark:bg-gray-800">
              {children}
            </main>
          </div>
        </div>
      </AbilityProvider>
    </SidebarProvider>
  );
}