// routes/_AppRoutes/app-routes.tsx
import { type RouteObject } from "react-router";
import HomePage from '@/components/pages/_A/Home/HomePage';

export const appRoutes: RouteObject[] = [
  {
    path: "/a",
    element: <HomePage />,
  },
];
