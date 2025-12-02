// src/components/providers/tenants/tenant-provider.tsx
import { useContext, type ReactNode } from "react";
import { TenantContext } from "./tenant-context";
import { useTenantDomain } from "@/hooks/use-tenant-domain";
import type { TenantConfig } from "./types";
import { useQuery } from "@tanstack/react-query";

// Simulacion a api para obtener configuracion del tenant
const getThemeConfig = async ({
  queryKey,
}: {
  queryKey: string[];
}): Promise<TenantConfig> => {
  const tenant = queryKey[1];

  if (tenant === "default") {
    return {
      name: "default",
      theme: getTenantTheme("default"),
    };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: tenant,
        theme: getTenantTheme(tenant),
      });
    }, 500); // ✅ Cambiar a 500ms para que sea más rápido
  });
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const tenant = useTenantDomain();

  const getTenantConfigQuery = useQuery({
    queryKey: ["tenant-config", tenant],
    queryFn: getThemeConfig,
    staleTime: 1000 * 60 * 60, // 1 hora
    refetchOnWindowFocus: false,
  });

  if (getTenantConfigQuery.isLoading) {
    return <div>Cargando configuración del tenant...</div>;
  }

  if (getTenantConfigQuery.isError) {
    return <div>Error al cargar la configuración del tenant.</div>;
  }

  return (
    <TenantContext.Provider value={getTenantConfigQuery.data}>
      {children}
    </TenantContext.Provider>
  );
};

// ✅ AGREGAR ESTE HOOK
export function useTenant() {
  const tenant = useTenantDomain(); // Subdomain detectado
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }

  return {
    tenant: context, // TenantConfig (name, theme)
    tenantSlug: tenant, // Subdomain string
    loading: false, // Ya está cargado si llegamos aquí
  };
}

function getTenantTheme(tenant: string): string {
  const themes: Record<string, string> = {
    empresaA: "blue",
    empresaB: "green",
    clientec: "red",
    default: "",
  };
  return themes[tenant] || themes.default;
}
