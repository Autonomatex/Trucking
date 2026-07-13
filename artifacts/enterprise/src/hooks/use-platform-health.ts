import { useQuery } from '@tanstack/react-query';

// The standalone FastAPI service is reached through the shared api-server's
// reverse proxy at /api/enterprise (see artifacts/api-server/src/routes/enterprise.ts),
// not directly -- it isn't a workspace artifact and has no proxied path of its own.
const API_BASE = '/api/enterprise';

export interface HealthResponse {
  status: string;
  environment: string;
}

export interface ReadyResponse {
  status: string;
  database: boolean;
  redis: boolean;
}

export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: ['health', 'base'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/health`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) {
        throw new Error('Health check failed');
      }
      return res.json();
    },
    retry: false,
    refetchInterval: 30000,
  });
}

export function useReady() {
  return useQuery<ReadyResponse>({
    queryKey: ['health', 'ready'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/health/ready`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) {
        // We still want to try to parse it if it returns a 503 with JSON format
        // which some health check endpoints do when degraded.
        try {
          const data = await res.json();
          if (data && typeof data.status === 'string') return data;
        } catch (e) {
          // ignore
        }
        throw new Error('Ready check failed');
      }
      return res.json();
    },
    retry: false,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}
