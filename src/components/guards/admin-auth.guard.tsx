// src/components/guards/admin-auth.guard.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/components/providers/auth/_A/AdminAuthProvider";
import { Box, CircularProgress } from "@mui/material";

interface AdminAuthGuardProps {
  children: ReactNode;
  requireRole?: "superadmin";
}

export function AdminAuthGuard({ children, requireRole }: AdminAuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAdminAuth();

  console.log("🛡️ AdminAuthGuard:", {
    isLoading,
    isAuthenticated,
    user,
    requireRole,
  });

  if (isLoading) {
    console.log("🛡️ AdminAuthGuard: Loading...");
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log("🛡️ AdminAuthGuard: No autenticado, redirigiendo a login");
    return <Navigate to="/a/login" replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    console.log(
      "🛡️ AdminAuthGuard: Rol incorrecto, redirigiendo a unauthorized"
    );
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("🛡️ AdminAuthGuard: ✅ Acceso permitido");
  return <>{children}</>;
}
