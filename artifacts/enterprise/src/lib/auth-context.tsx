import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch, clearTokens, getAccessToken, setTokens } from '@/lib/api';
import type { MeResponse, TokenResponse } from '@/lib/types';

interface AuthContextValue {
  user: MeResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return;
    }
    try {
      const me = await apiFetch<MeResponse>('/auth/me');
      setUser(me);
    } catch {
      // Access token missing/expired/invalid -- treat as signed out.
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUser().finally(() => setIsLoading(false));
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await apiFetch<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
    await loadUser();
  }, [loadUser]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => user?.permissions.includes(permission) ?? false,
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      logout,
      hasPermission,
      refreshUser: loadUser,
    }),
    [user, isLoading, login, logout, hasPermission, loadUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
