import { type RouteObject } from "react-router";
import HomePage from '@/components/pages/_A/Home/HomePage';
import LoginPage from '@/components/pages/_A/Login/LoginPage';
import { AdminAuthGuard } from '@/components/guards/admin-auth.guard.tsx';

export const appRoutes: RouteObject[] = [
  {
    path: "/a/login",
    element: <LoginPage />,
  },
  {
    path: "/a",
    element: (
      <AdminAuthGuard requireRole="superadmin">
        <HomePage />
      </AdminAuthGuard>
    ),
  },
];
