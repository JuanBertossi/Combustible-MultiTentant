// types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "superadmin"; 
  empresaId: number | null;
  empresaSubdomain?: string | null;
}
