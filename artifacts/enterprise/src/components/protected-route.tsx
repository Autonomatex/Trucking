import type { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  /** If set, the signed-in user must hold this permission or they're bounced to "/". */
  requirePermission?: string;
}

export function ProtectedRoute({ children, requirePermission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requirePermission && !hasPermission(requirePermission)) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
