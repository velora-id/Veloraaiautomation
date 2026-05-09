const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TokenPayload {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

const ACCESS_TOKEN_KEY = "velora_access_token";
const REFRESH_TOKEN_KEY = "velora_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, init);
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = body?.message ?? body?.errors?.[0] ?? response.statusText;
    const error = new Error(message || "Network response was not ok") as Error & {
      status?: number;
      body?: unknown;
    };
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body as T;
}

export async function refreshAccessToken(refreshToken: string): Promise<void> {
  const url = `${API_BASE_URL}${API_PREFIX}/auth/refresh`;
  const response = await fetchJson<APIResponse<TokenPayload>>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.data) {
    throw new Error(response.message || "Failed to refresh token");
  }

  setTokens(response.data.access_token, response.data.refresh_token);
}

export async function request<T>(path: string, init: RequestInit = {}, requireAuth = true): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${API_PREFIX}${path}`;
  const headers = new Headers(init.headers ?? {});

  if (requireAuth) {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
    init.body = JSON.stringify(init.body);
  }

  try {
    return await fetchJson<T>(url, {
      ...init,
      headers,
    });
  } catch (error) {
    const status = (error as Error & { status?: number }).status;

    if (requireAuth && status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await refreshAccessToken(refreshToken);
        const newToken = getAccessToken();
        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`);
        }
        return await fetchJson<T>(url, {
          ...init,
          headers,
        });
      }
    }

    throw error;
  }
}

export function get<T>(path: string, requireAuth = true) {
  return request<T>(path, { method: "GET" }, requireAuth);
}

export function post<T>(path: string, body: unknown, requireAuth = true) {
  return request<T>(path, { method: "POST", body }, requireAuth);
}

export function put<T>(path: string, body: unknown, requireAuth = true) {
  return request<T>(path, { method: "PUT", body }, requireAuth);
}

export function del<T>(path: string, requireAuth = true) {
  return request<T>(path, { method: "DELETE" }, requireAuth);
}

export function postForm<T>(path: string, formData: URLSearchParams, requireAuth = false) {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  }, requireAuth);
}
