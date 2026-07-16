import { useState, type FormEvent } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Network, Loader2, AlertTriangle } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-sm scanline">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Network size={20} />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Autonomatex Enterprise
            </span>
          </div>
          <CardTitle className="font-mono text-lg">Sign in</CardTitle>
          <CardDescription>Access your company's operations console.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-login">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wide">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wide">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                data-testid="input-password"
              />
            </div>

            {error && (
              <div
                className="flex items-start gap-2 text-xs text-destructive font-mono bg-destructive/10 border border-destructive/30 rounded-md p-2.5"
                data-testid="text-login-error"
              >
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-mono"
              disabled={isSubmitting}
              data-testid="button-submit-login"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
