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

  if (isLoading) {
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
    return <Navigate to="/a/login" replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
