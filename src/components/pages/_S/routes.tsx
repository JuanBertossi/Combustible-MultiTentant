import { type RouteObject } from "react-router";
import { TenantAuthGuard } from "@/components/guards/tenant-auth.guard";
import DashboardLayout from "@/components/pages/_S/Layout/DashboardLayout";
import LoginPage from "@/components/pages/_S/Login/LoginPage";
import Dashboard from "@/components/pages/_S/Dashboard/Dashboard";
import { Navigate } from "react-router-dom";
import ChoferesPage from "@/components/pages/_S/Choferes/ChoferesPage";
import CentroCostoPage from "@/components/pages/_S/CentroCosto/CentrosCostoPage";
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
import UnidadesNegocioPage from "@/components/pages/_S/UnidadesNegocio/UnidadesNegocioPage";

export const tenantRoutes: RouteObject[] = [
  {
    path: "/s/login",
    element: <LoginPage />,
  },
  {
    path: "/s",
    element: (
      <TenantAuthGuard>
        <DashboardLayout />
      </TenantAuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/s/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      // Administración (solo admin)
      { path: "unidades", element: <UnidadesNegocioPage /> },
      { path: "usuarios", element: <UsuariosPage /> },
      { path: "centro-costo", element: <CentroCostoPage /> },
      { path: "configuracion", element: <ConfiguracionPage /> },
      // Flota
      { path: "vehiculos", element: <VehiculosPage /> },
      { path: "choferes", element: <ChoferesPage /> },
      // Combustible
      { path: "eventos", element: <EventosPage /> },
      { path: "validacion", element: <ValidacionPage /> },
      { path: "surtidores", element: <SurtidoresPage /> },
      { path: "tanques", element: <TanquesPage /> },
      // Reportes
      { path: "reportes", element: <ReportesPage /> },
      // Legacy/Demo
      { path: "empresas", element: <EmpresasPage /> },
      { path: "demo", element: <DemoPage /> },
    ],
  },
];
