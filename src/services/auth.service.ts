// src/services/api/auth.service.ts
import type { LoginCredentials, User } from "@/types/auth";

const MOCK_USERS: Record<string, User> = {
  // 🔵 Super Admin (_A)
  "admin@goodapps.com": {
    id: 1,
    email: "admin@goodapps.com",
    name: "Super Admin GoodApps",
    role: "superadmin",
    empresaId: null,
    empresaSubdomain: null,
  },

  // 🟢 Tenants (_S)
  "admin@empresaA.com": {
    id: 2,
    email: "admin@empresaA.com",
    name: "Admin Empresa A",
    role: "admin",
    empresaId: 1,
    empresaSubdomain: "empresaa",
  },
  "admin@empresaB.com": {
    id: 3,
    email: "admin@empresaB.com",
    name: "Admin Empresa B",
    role: "admin",
    empresaId: 2,
    empresaSubdomain: "empresaB",
  },
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS[credentials.email];

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // 🔒 Validaciones de seguridad
    const isAdminRoute = window.location.pathname.startsWith("/a");

    // Si estás en /a (SuperAdmin), solo permite @goodapps.com
    if (isAdminRoute && user.role !== "superadmin") {
      throw new Error("Solo usuarios de GoodApps pueden acceder");
    }

    // Si estás en /s (Tenant), NO permitir superadmin
    if (!isAdminRoute && user.role === "superadmin") {
      throw new Error("Usa el panel de administración");
    }

    // Validar que el tenant coincida con el subdomain
    if (!isAdminRoute && user.empresaSubdomain) {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");

      let currentSubdomain: string | null = null;

      if (hostname.includes("localhost")) {
        // empresaA.localhost -> ["empresaA","localhost"]
        if (parts.length > 1 && parts[0] !== "localhost") {
          currentSubdomain = parts[0];
        }
      } else {
        // empresaA.midominio.com -> ["empresaA","midominio","com"]
        if (parts.length > 2) {
          currentSubdomain = parts[0];
        }
      }

      console.log("🌐 Subdominio actual:", currentSubdomain);
      console.log("👤 Subdominio del usuario:", user.empresaSubdomain);

      if (
        currentSubdomain &&
        currentSubdomain.toLowerCase() !== user.empresaSubdomain.toLowerCase()
      ) {
        throw new Error("Usuario no pertenece a esta empresa");
      }
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

  // 🔥 NUEVO: Verificar si el usuario actual es válido para la ruta
  isValidForCurrentRoute(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const isAdminRoute = window.location.pathname.startsWith("/a");

    if (isAdminRoute) {
      return user.role === "superadmin";
    }

    return user.role !== "superadmin";
  }
}

export const authService = new AuthService();
