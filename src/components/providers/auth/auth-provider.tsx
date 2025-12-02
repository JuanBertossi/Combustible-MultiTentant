// components/providers/auth/auth-provider.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, LoginCredentials } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión inicial
  useEffect(() => {
    console.log("🔍 AuthProvider: Verificando sesión...");
    
    // 1. Verificar si hay token en URL
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get('auth');
    
    if (authToken) {
      try {
        // Decodificar usuario desde URL
        const userData = JSON.parse(atob(authToken));
        console.log("🔑 Usuario desde URL:", userData);
        authService.setUser(userData);
        setUser(userData);
        
        // Limpiar URL sin hacer reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        setIsLoading(false);
        return;
      } catch (e) {
        console.error("❌ Error decodificando token:", e);
      }
    }
    
    // 2. Si no hay token en URL, buscar en storage
    const currentUser = authService.getCurrentUser();
    console.log("👤 Usuario encontrado:", currentUser);
    
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info("Sesión cerrada correctamente.");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
