// components/layout/Sidebar.tsx
import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
  Typography,
  Divider,
  Collapse,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PropaneTankIcon from "@mui/icons-material/PropaneTank";
import { useAuth } from "@/components/providers/auth/auth-provider";
import { useTenantContext } from "@/components/providers/tenants/use-tenant";

const DRAWER_WIDTH = 260;

type UserRole = "admin" | "superadmin";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  roles: UserRole[];
  submenu?: MenuItem[];
}

const menuStructure: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/s/dashboard",
    roles: ["superadmin", "admin"],
  },
  {
    label: "Administración",
    icon: <AdminPanelSettingsIcon />,
    roles: ["superadmin", "admin"],
    submenu: [
      {
        label: "Empresas",
        icon: <BusinessIcon />,
        path: "/s/empresas",
        roles: ["superadmin"],
      },
      {
        label: "Usuarios",
        icon: <PeopleIcon />,
        path: "/s/usuarios",
        roles: ["superadmin", "admin"],
      },
      {
        label: "Centros de Costo",
        icon: <AccountTreeIcon />,
        path: "/s/centro-costo",
        roles: ["superadmin", "admin"],
      },
    ],
  },
  {
    label: "Flota",
    icon: <LocalShippingIcon />,
    roles: ["superadmin", "admin"],
    submenu: [
      {
        label: "Vehículos",
        icon: <DirectionsCarIcon />,
        path: "/s/vehiculos",
        roles: ["superadmin", "admin"],
      },
      {
        label: "Choferes",
        icon: <PersonIcon />,
        path: "/s/choferes",
        roles: ["superadmin", "admin"],
      },
    ],
  },
  {
    label: "Combustible",
    icon: <LocalGasStationIcon />,
    roles: ["superadmin", "admin"],
    submenu: [
      {
        label: "Eventos",
        icon: <LocalGasStationIcon />,
        path: "/s/eventos",
        roles: ["superadmin", "admin"],
      },
      {
        label: "Validación",
        icon: <CheckCircleIcon />,
        path: "/s/validacion",
        roles: ["superadmin", "admin"],
      },
      {
        label: "Surtidores",
        icon: <LocalGasStationIcon />,
        path: "/s/surtidores",
        roles: ["superadmin", "admin"],
      },
      {
        label: "Tanques",
        icon: <PropaneTankIcon />,
        path: "/s/tanques",
        roles: ["superadmin", "admin"],
      },
    ],
  },
  {
    label: "Reportes",
    icon: <AssessmentIcon />,
    path: "/s/reportes",
    roles: ["superadmin", "admin"],
  },
  {
    label: "Configuración",
    icon: <SettingsIcon />,
    path: "/s/configuracion",
    roles: ["superadmin", "admin"],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { name } = useTenantContext();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleMenuClick = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path: string | undefined) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const hasAccess = (roles: UserRole[]) => {
    if (!roles) return true;
    return roles.includes(user?.role as UserRole);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "#1E2C56",
          color: "#fff",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <LocalGasStationIcon sx={{ fontSize: 40, color: "#4A90E2", mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Fuel Manager
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          {name || "Sistema"}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

      <List sx={{ px: 2, py: 1 }}>
        {menuStructure.map((item) => {
          if (!hasAccess(item.roles)) return null;

          if (item.submenu) {
            const filteredSubmenu = item.submenu.filter((subItem) =>
              hasAccess(subItem.roles)
            );

            if (filteredSubmenu.length === 0) return null;

            return (
              <Box key={item.label}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleMenuClick(item.label)}
                    sx={{
                      borderRadius: 2,
                      bgcolor: "transparent",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 40 }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                    />
                    {openMenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>

                <Collapse
                  in={openMenus[item.label]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {filteredSubmenu.map((subItem) => (
                      <ListItem
                        key={subItem.path}
                        disablePadding
                        sx={{ pl: 2, mb: 0.5 }}
                      >
                        <ListItemButton
                          onClick={() => subItem.path && navigate(subItem.path)}
                          sx={{
                            borderRadius: 2,
                            bgcolor: isActive(subItem.path)
                              ? "#4A90E2"
                              : "transparent",
                            "&:hover": {
                              bgcolor: isActive(subItem.path)
                                ? "#5a9eeb"
                                : "rgba(255, 255, 255, 0.08)",
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: isActive(subItem.path)
                                ? "#fff"
                                : "rgba(255, 255, 255, 0.7)",
                              minWidth: 36,
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.label}
                            primaryTypographyProps={{
                              fontSize: 13,
                              fontWeight: isActive(subItem.path) ? 600 : 400,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => item.path && navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive(item.path) ? "#4A90E2" : "transparent",
                  "&:hover": {
                    bgcolor: isActive(item.path)
                      ? "#5a9eeb"
                      : "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? "#fff"
                      : "rgba(255, 255, 255, 0.7)",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
