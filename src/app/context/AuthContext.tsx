import { createContext, useContext, useState, ReactNode } from "react";

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchTenant: (tenantId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants] = useState<Tenant[]>([
    { id: "1", name: "Acme Corp", plan: "enterprise" },
    { id: "2", name: "Startup Inc", plan: "pro" },
  ]);

  const login = async (email: string, password: string) => {
    // Mock login
    setUser({
      id: "user-1",
      email,
      name: "John Doe",
      role: "owner",
      tenantId: "1",
    });
    setTenant(tenants[0]);
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
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
        login,
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
