// routes/routes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { appRoutes } from "../components/pages/_A/routes";
import { tenantRoutes } from "../components/pages/_S/routes";

export function Routing() {
  console.log("🔄 Routing cargando...");
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de Admin (localhost/a) */}
        {appRoutes.map((route, i) => (
          <Route key={`app-${i}`} path={route.path} element={route.element}>
            {route.children?.map((child, j) => (
              <Route key={`app-child-${j}`} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}

        {/* Rutas de Tenant (empresa.local/s) */}
        {tenantRoutes.map((route, i) => (
          <Route key={`tenant-${i}`} path={route.path} element={route.element}>
            {route.children?.map((child, j) => (
              <Route key={`tenant-child-${j}`} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/a" replace />} />
        <Route path="*" element={<Navigate to="/a" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
