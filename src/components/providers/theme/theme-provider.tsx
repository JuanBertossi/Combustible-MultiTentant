// providers/theme/ThemeProvider.tsx
import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./theme-context";
import type { Theme, ThemeProviderProps, TenantThemeConfig } from "./types";
import { useTenantContext } from "../tenants/use-tenant";

// Temas por tenant ID
const TENANT_THEMES: Record<number, TenantThemeConfig> = {
  1: {
    primaryColor: '#1E2C56',
    secondaryColor: '#3b82f6',
    sidebarBg: '#1E2C56',
    sidebarText: '#ffffff',
    accentColor: '#10b981',
  },
  2: {
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    sidebarBg: '#064e3b',
    sidebarText: '#d1fae5',
    accentColor: '#f59e0b',
  },
  3: {
    primaryColor: '#ef4444',
    secondaryColor: '#dc2626',
    sidebarBg: '#7f1d1d',
    sidebarText: '#fee2e2',
    accentColor: '#f59e0b',
  },
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const tenant = useTenantContext();
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Estado del tema del tenant
  const [tenantTheme, setTenantTheme] = useState<TenantThemeConfig>(() => {
    // Intenta cargar desde localStorage primero (tema personalizado)
    const savedTheme = localStorage.getItem(`tenant-theme-${tenant?.id}`);
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (e) {
        console.error('Error parsing saved theme:', e);
      }
    }
    // Si no hay tema guardado, usa el default del tenant
    return TENANT_THEMES[tenant?.id || 1] || TENANT_THEMES[1];
  });

  // Aplicar CSS variables cuando cambia el tema del tenant
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar variables CSS
    root.style.setProperty('--primary-color', tenantTheme.primaryColor);
    root.style.setProperty('--secondary-color', tenantTheme.secondaryColor);
    root.style.setProperty('--sidebar-bg', tenantTheme.sidebarBg);
    root.style.setProperty('--sidebar-text', tenantTheme.sidebarText);
    root.style.setProperty('--accent-color', tenantTheme.accentColor);

    // Guardar en localStorage
    localStorage.setItem(`tenant-theme-${tenant?.id}`, JSON.stringify(tenantTheme));
  }, [tenantTheme, tenant?.id]);

  // Manejar tema claro/oscuro (tu lógica original)
  useEffect(() => {
    const root = document.body;
    root.classList.remove("theme-blue", "theme-green", "theme-red");
    
    if (tenant?.theme && ["blue", "green", "red"].includes(tenant.theme)) {
      root.classList.add(`theme-${tenant.theme}`);
    }
  }, [tenant?.theme]);

  const updateTenantTheme = (config: Partial<TenantThemeConfig>) => {
    setTenantTheme((prev) => ({ ...prev, ...config }));
  };

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    tenantTheme,
    updateTenantTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
