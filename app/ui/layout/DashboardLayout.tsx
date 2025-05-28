'use client';
import { SidebarProvider } from '@/context/SidebarContext';
import { TopBar } from '@/app/ui/topbar/TopBar';
import SideBarMain from '@/app/ui/sidebar/SideBarMain';
import { useAuth } from '@/hooks/authHooks';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  console.log("iaAtutheticaed",isAuthenticated,user,loading)
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <SideBarMain userRole={user?.role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar user={user} />
          <main className="flex-1 overflow-y-auto pt-8 pb-4 px-4 bg-gray-100 dark:bg-gray-800">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}