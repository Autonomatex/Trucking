import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login';
import AdminUsers from '@/pages/admin/users';
import { AuthProvider } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { AppHeader } from '@/components/app-header';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 0, // Ensure dashboard always fetches fresh data when polled
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/">
                <ProtectedRoute>
                  <AppHeader />
                  <Dashboard />
                </ProtectedRoute>
              </Route>
              <Route path="/admin/users">
                <ProtectedRoute requirePermission="user:read">
                  <AppHeader />
                  <AdminUsers />
                </ProtectedRoute>
              </Route>
              <Route>
                <div className="min-h-screen w-full flex items-center justify-center font-mono text-muted-foreground text-sm">
                  404 - ROUTE NOT FOUND
                </div>
              </Route>
            </Switch>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
