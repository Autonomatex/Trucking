import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const { user, logout, hasPermission } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { href: '/admin/users', label: 'Staff & Roles', icon: ShieldCheck, show: hasPermission('user:read') },
  ];

  return (
    <div className="w-full border-b border-border/80 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 flex items-center justify-between h-14">
        <nav className="flex items-center gap-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wider uppercase transition-colors',
                    location === item.href
                      ? 'text-primary bg-primary/10 border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground border border-transparent',
                  )}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon size={14} />
                  {item.label}
                </a>
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-mono text-foreground/90 leading-tight">{user.full_name}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-tight">
              {user.roles.join(', ') || 'no role'}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut size={14} />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
