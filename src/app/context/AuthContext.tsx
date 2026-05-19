import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAccessToken, getRefreshToken, setTokens, clearTokens, get, postForm, post, APIResponse } from "../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "member";
  tenantId: string;
}

interface Tenant {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  logo?: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, company: string) => Promise<void>;
  logout: () => void;
  switchTenant: (tenantId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface BackendUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization_id: string;
}

interface TokenPayload {
  access_token: string;
  refresh_token: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    const refreshToken = getRefreshToken();
    if (token && refreshToken) {
      fetchCurrentUser().finally(() => setIsLoading(false));
      return;
    }

    setIsLoading(false);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await get<APIResponse<BackendUser>>("/users/me");
      const data = response.data;

      if (!data) {
        throw new Error("Unable to load current user");
      }

      setUser({
        id: data.id,
        email: data.email,
        name: data.full_name,
        role: data.role as "owner" | "admin" | "member",
        tenantId: data.organization_id,
      });

      const currentOrganization = {
        id: data.organization_id,
        name: "My Organization",
        plan: "free" as const,
      };

      setTenants([currentOrganization]);
      setTenant(currentOrganization);
    } catch (error) {
      clearSession();
    }
  };

  const clearSession = () => {
    setUser(null);
    setTenant(null);
    clearTokens();
  };

  const login = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await postForm<APIResponse<TokenPayload>>("/auth/login", formData);
    const data = response.data;

    if (!data) {
      throw new Error(response.message || "Login failed");
    }

    setTokens(data.access_token, data.refresh_token);
    await fetchCurrentUser();
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    company: string
  ) => {
    const response = await post<APIResponse<TokenPayload>>("/auth/register", {
      email,
      full_name: name,
      password,
      organization_name: company,
    }, false);

    const data = response.data;

    if (!data) {
      throw new Error(response.message || "Registration failed");
    }

    setTokens(data.access_token, data.refresh_token);
    await fetchCurrentUser();
  };

  const logout = () => {
    clearSession();
  };

  const switchTenant = (tenantId: string) => {
    const newTenant = tenants.find((t) => t.id === tenantId);
    if (newTenant) {
      setTenant(newTenant);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        tenants,
        isLoading,
        login,
        register,
        logout,
        switchTenant,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
