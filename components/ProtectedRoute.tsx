'use client';

import { useAuth } from "@/hooks/authHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string | string[];
  loadingComponent?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children,
  allowedRoles,
  loadingComponent = <LoadingSpinner />
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      if (allowedRoles) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!user?.role || !roles.includes(user.role)) {
          router.push('/unauthorized');
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading || !isAuthenticated || (allowedRoles && !(Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).includes(user?.role || ""))) {
    return loadingComponent;
  }

  return children;
}