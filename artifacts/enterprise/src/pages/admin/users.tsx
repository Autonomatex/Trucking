import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import type { RoleListResponse, UserListResponse, UserResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShieldCheck, UserPlus } from 'lucide-react';

export default function AdminUsers() {
  const { user: currentUser, hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const canManageUsers = hasPermission('user:manage');
  const canManageRoles = hasPermission('role:manage');

  const usersQuery = useQuery({
    queryKey: ['enterprise', 'users'],
    queryFn: () => apiFetch<UserListResponse>('/users'),
  });
  const rolesQuery = useQuery({
    queryKey: ['enterprise', 'roles'],
    queryFn: () => apiFetch<RoleListResponse>('/roles'),
  });

  const roleOptions = rolesQuery.data?.roles.map((r) => r.name) ?? [];

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiFetch<UserResponse>(`/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise', 'users'] });
      toast({ title: 'Role updated' });
    },
    onError: (err) => {
      toast({
        title: 'Could not update role',
        description: err instanceof ApiError ? err.message : 'Unexpected error.',
        variant: 'destructive',
      });
    },
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ email: '', full_name: '', password: '', role: 'viewer' });
  const [createError, setCreateError] = useState<string | null>(null);

  const createUserMutation = useMutation({
    mutationFn: () =>
      apiFetch<UserResponse>('/users', {
        method: 'POST',
        body: JSON.stringify(createForm),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise', 'users'] });
      setIsCreateOpen(false);
      setCreateForm({ email: '', full_name: '', password: '', role: 'viewer' });
      setCreateError(null);
      toast({ title: 'Staff account created' });
    },
    onError: (err) => {
      setCreateError(err instanceof ApiError ? err.message : 'Unexpected error creating user.');
    },
  });

  const isLoading = usersQuery.isLoading || rolesQuery.isLoading;

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck size={18} />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Access Control
            </span>
          </div>
          <h1 className="font-mono text-xl font-semibold">Staff &amp; Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage who can sign in and what they're allowed to do.
          </p>
        </div>

        {canManageUsers && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="font-mono"
            data-testid="button-add-user"
          >
            <UserPlus size={16} />
            Add staff
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
            Team members
          </CardTitle>
          <CardDescription>
            {usersQuery.data ? `${usersQuery.data.users.length} accounts in your organization` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-muted-foreground" size={20} />
            </div>
          ) : usersQuery.isError ? (
            <p className="text-sm text-destructive" data-testid="text-users-error">
              Failed to load staff accounts.
            </p>
          ) : (
            <Table data-testid="table-users">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQuery.data?.users.map((u) => (
                  <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                    <TableCell className="font-medium">{u.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      {canManageRoles ? (
                        <Select
                          value={u.roles[0] ?? ''}
                          onValueChange={(role) => updateRoleMutation.mutate({ userId: u.id, role })}
                          disabled={u.id === currentUser?.id || updateRoleMutation.isPending}
                        >
                          <SelectTrigger className="w-40 font-mono text-xs" data-testid={`select-role-${u.id}`}>
                            <SelectValue placeholder="No role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map((role) => (
                              <SelectItem key={role} value={role} className="font-mono text-xs capitalize">
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="font-mono text-xs uppercase text-muted-foreground">
                          {u.roles.join(', ') || 'none'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          u.is_active
                            ? 'text-healthy font-mono text-xs uppercase'
                            : 'text-muted-foreground font-mono text-xs uppercase'
                        }
                      >
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent data-testid="dialog-create-user">
          <DialogHeader>
            <DialogTitle className="font-mono">Add staff member</DialogTitle>
            <DialogDescription>
              They'll be able to sign in immediately with the role you choose.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setCreateError(null);
              createUserMutation.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="new-full-name">Full name</Label>
              <Input
                id="new-full-name"
                required
                value={createForm.full_name}
                onChange={(e) => setCreateForm((f) => ({ ...f, full_name: e.target.value }))}
                data-testid="input-new-full-name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                data-testid="input-new-email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">Temporary password</Label>
              <Input
                id="new-password"
                type="password"
                required
                minLength={8}
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-role">Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(role) => setCreateForm((f) => ({ ...f, role }))}
              >
                <SelectTrigger id="new-role" data-testid="select-new-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {createError && (
              <p className="text-xs text-destructive font-mono" data-testid="text-create-user-error">
                {createError}
              </p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={createUserMutation.isPending} data-testid="button-submit-new-user">
                {createUserMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Create account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
