// components/guards/auth.guard.tsx
import { useAuth } from "@/components/providers/auth/auth-provider";
import { Navigate } from "react-router";
import { type PropsWithChildren } from "react";

export function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("🔒 AuthGuard:", { isAuthenticated, isLoading, url: window.location.href });

  // Mostrar loading mientras verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log("❌ No autenticado, redirigiendo a /a");
    return <Navigate to="/a" replace />;
  }

  console.log("✅ Autenticado, permitir acceso");
  return <>{children}</>;
}
