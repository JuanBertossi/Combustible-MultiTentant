// src/components/guards/tenant-auth.guard.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useTenantAuth } from "@/components/providers/auth/_S/TenantAuthProvider";
import { Box, CircularProgress } from "@mui/material";

interface TenantAuthGuardProps {
  children: ReactNode;
  requireRole?: "admin" | "supervisor" | "operator" | "auditor";
}

export function TenantAuthGuard({ children, requireRole }: TenantAuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useTenantAuth();

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
    return <Navigate to="/s/login" replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
