// src/components/pages/_S/Home/HomePage.tsx
import { useTenantContext } from "@/components/providers/tenants/use-tenant";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Home, 
  LayoutDashboard, 
  Car, 
  Users, 
  DollarSign, 
  Building2,
  Calendar,
  FileText,
  Fuel,
  Droplets,
  CheckCircle,
  Settings
} from "lucide-react";
import { Link } from "react-router";

const domain = import.meta.env.VITE_APP_DOMAIN;

const homePrincipalUrl = `http://${
  import.meta.env.VITE_APP_DOMAIN === "localhost"
    ? `${domain}:${import.meta.env.VITE_APP_PORT || "5177"}`
    : domain
}/a`;

interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

export default function HomePage() {
  const { name } = useTenantContext();

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/s/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: "Vista general del sistema",
    },
    {
      title: "Vehículos",
      href: "/s/vehiculos",
      icon: <Car className="w-5 h-5" />,
      description: "Gestión de vehículos",
    },
    {
      title: "Choferes",
      href: "/s/choferes",
      icon: <Users className="w-5 h-5" />,
      description: "Administrar conductores",
    },
    {
      title: "Centro de Costo",
      href: "/s/centro-costo",
      icon: <DollarSign className="w-5 h-5" />,
      description: "Centros de costos",
    },
    {
      title: "Configuración",
      href: "/s/configuracion",
      icon: <Settings className="w-5 h-5" />,
      description: "Ajustes del sistema",
    },
    {
      title: "Demo",
      href: "/s/demo",
      icon: <FileText className="w-5 h-5" />,
      description: "Página de demostración",
    },
    {
      title: "Empresas",
      href: "/s/empresas",
      icon: <Building2 className="w-5 h-5" />,
      description: "Gestión de empresas",
    },
    {
      title: "Eventos",
      href: "/s/eventos",
      icon: <Calendar className="w-5 h-5" />,
      description: "Registro de eventos",
    },
    {
      title: "Reportes",
      href: "/s/reportes",
      icon: <FileText className="w-5 h-5" />,
      description: "Informes y estadísticas",
    },
    {
      title: "Surtidores",
      href: "/s/surtidores",
      icon: <Fuel className="w-5 h-5" />,
      description: "Gestión de surtidores",
    },
    {
      title: "Tanques",
      href: "/s/tanques",
      icon: <Droplets className="w-5 h-5" />,
      description: "Control de tanques",
    },
    {
      title: "Usuarios",
      href: "/s/usuarios",
      icon: <Users className="w-5 h-5" />,
      description: "Administrar usuarios",
    },
    {
      title: "Validación",
      href: "/s/validacion",
      icon: <CheckCircle className="w-5 h-5" />,
      description: "Validaciones del sistema",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-t-4 border-t-blue-600">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-slate-800">
              Bienvenido a {name}
            </CardTitle>
            <CardDescription className="text-lg">
              Sistema de Gestión de Combustible - Panel de Control
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-l-blue-600">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer con botón de logout */}
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Tenant activo: <span className="font-semibold">{name}</span>
            </p>
            <Button asChild variant="outline">
              <Link to={homePrincipalUrl} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Volver al login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
