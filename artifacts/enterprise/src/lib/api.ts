// Thin fetch wrapper around the standalone FastAPI "autonomatex-api" service,
// reached through the shared api-server's reverse proxy at /api/enterprise
// (see artifacts/api-server/src/routes/enterprise.ts) -- not a workspace
// artifact of its own, so there is no generated OpenAPI client for it yet.
const API_BASE = '/api/enterprise';

const ACCESS_TOKEN_KEY = 'autonomatex.accessToken';
const REFRESH_TOKEN_KEY = 'autonomatex.refreshToken';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function parseErrorMessage(res: Response): Promise<ApiError> {
  try {
    const data = await res.json();
    const message = data?.error?.message ?? `Request failed with status ${res.status}`;
    const code = data?.error?.code ?? 'unknown_error';
    return new ApiError(res.status, code, message);
  } catch {
    return new ApiError(res.status, 'unknown_error', `Request failed with status ${res.status}`);
  }
}

/** Authenticated JSON request against the enterprise API. Throws `ApiError` on non-2xx. */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    throw await parseErrorMessage(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
