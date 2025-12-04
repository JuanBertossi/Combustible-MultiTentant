// src/types/auth.ts

/**
 * Roles del sistema
 * - superadmin: Administrador de GoodApps (acceso a /a)
 * - admin: Administrador de empresa/tenant
 * - supervisor: Puede validar eventos
 * - operador: Solo puede registrar cargas
 * - auditor: Solo lectura para auditorías
 */
export type UserRole = 
  | "superadmin" 
  | "admin" 
  | "supervisor" 
  | "operador" 
  | "auditor";

/**
 * Permisos granulares del sistema
 */
export type Permission =
  | "eventos:crear"
  | "eventos:editar"
  | "eventos:eliminar"
  | "eventos:validar"
  | "eventos:ver"
  | "vehiculos:gestionar"
  | "usuarios:gestionar"
  | "reportes:ver"
  | "reportes:exportar"
  | "configuracion:editar"
  | "empresas:gestionar";

/**
 * Mapeo de roles a permisos
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    "empresas:gestionar",
    "eventos:ver",
    "reportes:ver",
    "reportes:exportar",
  ],
  admin: [
    "eventos:crear",
    "eventos:editar",
    "eventos:eliminar",
    "eventos:validar",
    "eventos:ver",
    "vehiculos:gestionar",
    "usuarios:gestionar",
    "reportes:ver",
    "reportes:exportar",
    "configuracion:editar",
  ],
  supervisor: [
    "eventos:crear",
    "eventos:editar",
    "eventos:validar",
    "eventos:ver",
    "reportes:ver",
    "reportes:exportar",
  ],
  operador: [
    "eventos:crear",
    "eventos:ver",
  ],
  auditor: [
    "eventos:ver",
    "reportes:ver",
    "reportes:exportar",
  ],
};

/**
 * Usuario autenticado
 */
export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  empresaId: number | null;
  empresaSubdomain?: string | null;
  avatar?: string;
  permissions?: Permission[];
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Respuesta del login
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: string;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * Helper para verificar permisos
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  // Superadmin tiene acceso a todo
  if (user.role === "superadmin") return true;
  
  // Si el usuario tiene permisos personalizados, usarlos
  if (user.permissions) {
    return user.permissions.includes(permission);
  }
  
  // De lo contrario, usar los permisos del rol
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
}

/**
 * Helper para verificar si tiene alguno de los roles
 */
export function hasRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
