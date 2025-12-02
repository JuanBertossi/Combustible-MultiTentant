// services/auth.service.ts
import type { LoginCredentials, User } from "@/types/auth";

const MOCK_USERS: Record<string, User> = {
  "admin@empresaA.com": {
    id: 1,
    email: "admin@empresaA.com",
    name: "Admin Empresa A",
    role: "admin",
    empresaId: 1,
    empresaSubdomain: "empresaA",
  },
  "admin@empresaB.com": {
    id: 2,
    email: "admin@empresaB.com",
    name: "Admin Empresa B",
    role: "admin",
    empresaId: 2,
    empresaSubdomain: "empresaB",
  },
  "superadmin@fuel.com": {
    id: 99,
    email: "superadmin@fuel.com",
    name: "Super Admin",
    role: "superadmin",
    empresaId: null,
    empresaSubdomain: null,
  },
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS[credentials.email];

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    console.log("💾 Guardando usuario:", user);
    
    // Guardar en sessionStorage y localStorage
    sessionStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    
    return user;
  }

  logout(): void {
    console.log("🚪 Cerrando sesión...");
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
  }

  getCurrentUser(): User | null {
    console.log("🔍 Buscando usuario...");
    
    // Intentar desde sessionStorage primero
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      console.log("✅ Usuario desde sessionStorage:", sessionUser);
      return JSON.parse(sessionUser);
    }

    // Fallback a localStorage
    const localUser = localStorage.getItem("user");
    if (localUser) {
      console.log("✅ Usuario desde localStorage:", localUser);
      return JSON.parse(localUser);
    }

    console.log("❌ No se encontró usuario");
    return null;
  }

  setUser(user: User): void {
    sessionStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export const authService = new AuthService();
