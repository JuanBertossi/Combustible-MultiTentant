// src/components/pages/_A/routes.tsx
import { type RouteObject } from "react-router";
import HomePage from "@/components/pages/_A/Home/HomePage";
import LoginPage from "@/components/pages/_A/Login/LoginPage";
import EmpresasPage from "@/components/pages/_A/Empresas/EmpresasPage";
import AdminLayout from "@/components/pages/_A/Layout/AdminLayout";
import { AdminAuthGuard } from "@/components/guards/admin-auth.guard.tsx";

export const appRoutes: RouteObject[] = [
  // Login route (sin layout)
  {
    path: "/a/login",
    element: <LoginPage />,
  },
  // Protected routes con layout
  {
    path: "/a",
    element: (
      <AdminAuthGuard requireRole="superadmin">
        <AdminLayout />
      </AdminAuthGuard>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "empresas",
        element: <EmpresasPage />,
      },
    ],
  },
];
