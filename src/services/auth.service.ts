// src/services/auth.service.ts
import type { LoginCredentials, User, LoginResponse, ApiResponse } from "@/types";
import { apiClient } from "./api.client";

/**
 * Mock users para desarrollo
 * TODO: Eliminar cuando la API esté lista
 */
const MOCK_USERS: Record<string, User> = {
  "admin@goodapps.com": {
    id: 1,
    email: "admin@goodapps.com",
    name: "Super Admin GoodApps",
    role: "superadmin",
    empresaId: null,
    empresaSubdomain: null,
  },
  "admin@empresaA.com": {
    id: 2,
    email: "admin@empresaA.com",
    name: "Admin Empresa A",
    role: "admin",
    empresaId: 1,
    empresaSubdomain: "empresaa",
  },
  "supervisor@empresaA.com": {
    id: 3,
    email: "supervisor@empresaA.com",
    name: "Supervisor Empresa A",
    role: "supervisor",
    empresaId: 1,
    empresaSubdomain: "empresaa",
  },
  "operador@empresaA.com": {
    id: 4,
    email: "operador@empresaA.com",
    name: "Operador Empresa A",
    role: "operador",
    empresaId: 1,
    empresaSubdomain: "empresaa",
  },
};

/**
 * Flag para usar mock o API real
 */
const USE_MOCK = true; // TODO: Cambiar a false cuando la API esté lista

class AuthService {
  /**
   * Login de usuario
   */
  async login(credentials: LoginCredentials): Promise<User> {
    if (USE_MOCK) {
      return this.mockLogin(credentials);
    }

    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );

    if (response.success && response.data) {
      const { user, token } = response.data;
      this.saveSession(user, token);
      return user;
    }

    throw new Error("Error al iniciar sesión");
  }

  /**
   * Login mock para desarrollo
   */
  private async mockLogin(credentials: LoginCredentials): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS[credentials.email];

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Validaciones de seguridad
    const isAdminRoute = window.location.pathname.startsWith("/a");

    if (isAdminRoute && user.role !== "superadmin") {
      throw new Error("Solo usuarios de GoodApps pueden acceder");
    }

    if (!isAdminRoute && user.role === "superadmin") {
      throw new Error("Usa el panel de administración");
    }

    // Validar subdomain para tenants
    if (!isAdminRoute && user.empresaSubdomain) {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let currentSubdomain: string | null = null;

      if (hostname.includes("localhost")) {
        if (parts.length > 1 && parts[0] !== "localhost") {
          currentSubdomain = parts[0];
        }
      } else {
        if (parts.length > 2) {
          currentSubdomain = parts[0];
        }
      }

      if (
        currentSubdomain &&
        currentSubdomain.toLowerCase() !== user.empresaSubdomain.toLowerCase()
      ) {
        throw new Error("Usuario no pertenece a esta empresa");
      }
    }

    this.saveSession(user);
    return user;
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      try {
        return JSON.parse(sessionUser);
      } catch {
        return null;
      }
    }

    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        return JSON.parse(localUser);
      } catch {
        return null;
      }
    }

    return null;
  }

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Guardar sesión
   */
  private saveSession(user: User, token?: string): void {
    sessionStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    
    if (token) {
      sessionStorage.setItem("token", token);
      localStorage.setItem("token", token);
    }
  }

  /**
   * Actualizar usuario en sesión
   */
  updateUser(user: User): void {
    this.saveSession(user);
  }

  /**
   * Verificar si el usuario es válido para la ruta actual
   */
  isValidForCurrentRoute(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const isAdminRoute = window.location.pathname.startsWith("/a");

    if (isAdminRoute) {
      return user.role === "superadmin";
    }

    return user.role !== "superadmin";
  }

  /**
   * Refrescar token
   */
  async refreshToken(): Promise<string | null> {
    if (USE_MOCK) {
      return null;
    }

    try {
      const response = await apiClient.post<ApiResponse<{ token: string }>>(
        "/auth/refresh"
      );
      
      if (response.success && response.data) {
        sessionStorage.setItem("token", response.data.token);
        localStorage.setItem("token", response.data.token);
        return response.data.token;
      }
    } catch {
      this.logout();
    }

    return null;
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  /**
   * Solicitar recuperación de contraseña
   */
  async requestPasswordReset(email: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    await apiClient.post("/auth/forgot-password", { email });
  }

  /**
   * Resetear contraseña con token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    await apiClient.post("/auth/reset-password", { token, newPassword });
  }
}

export const authService = new AuthService();
export default authService;
