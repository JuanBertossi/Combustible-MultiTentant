// routes/_TenantRoutes/tenant-routes.tsx
import SubdomainGuard from "@/components/guards/subdomain.guard";
import { AuthGuard } from "@/components/guards/auth.guard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HomePage from "@/components/pages/_S/Home/HomePage";
import DashboardPage from "@/components/pages/_S/Dashboard/DashboardPage";
import { type RouteObject } from "react-router";

// Importar las páginas existentes
import ChoferesPage from "@/components/pages/_S/Choferes/ChoferesPage";
import CentroCostoPage from "@/components/pages/_S/CentroCosto/CentrosCostoPage"; // Ensure the correct filename
import ConfiguracionPage from "@/components/pages/_S/Configuracion/ConfiguracionPage";
import DemoPage from "@/components/pages/_S/Demo/DemoPage";
import EmpresasPage from "@/components/pages/_S/Empresas/EmpresasPage";
import EventosPage from "@/components/pages/_S/Eventos/EventosPage";
import ReportesPage from "@/components/pages/_S/Reportes/ReportesPage";
import SurtidoresPage from "@/components/pages/_S/Surtidores/SurtidoresPage";
import TanquesPage from "@/components/pages/_S/Tanques/TanquesPage";
import UsuariosPage from "@/components/pages/_S/Usuarios/UsuariosPage";
import ValidacionPage from "@/components/pages/_S/Validacion/ValidacionEventosPage";
import VehiculosPage from "@/components/pages/_S/Vehiculos/VehiculosPage";

export const tenantRoutes: RouteObject[] = [
  {
    path: "/s",
    element: (
      <AuthGuard>
        <SubdomainGuard type="subdomain">
          <DashboardLayout />
        </SubdomainGuard>
      </AuthGuard>
    ),
    children: [
      { path: "", element: <HomePage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "vehiculos", element: <VehiculosPage /> },
      { path: "choferes", element: <ChoferesPage /> },
      { path: "centro-costo", element: <CentroCostoPage /> },
      { path: "configuracion", element: <ConfiguracionPage /> },
      { path: "demo", element: <DemoPage /> },
      { path: "empresas", element: <EmpresasPage /> },
      { path: "eventos", element: <EventosPage /> },
      { path: "reportes", element: <ReportesPage /> },
      { path: "surtidores", element: <SurtidoresPage /> },
      { path: "tanques", element: <TanquesPage /> },
      { path: "usuarios", element: <UsuariosPage /> },
      { path: "validacion", element: <ValidacionPage /> },
    ],
  },
];
