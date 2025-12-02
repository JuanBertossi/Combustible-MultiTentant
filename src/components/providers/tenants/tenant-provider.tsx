import type { ReactNode } from "react";
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
    }, 5000);
  });
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const tenant = useTenantDomain();

  // Aquí puedes agregar lógica para cargar configuraciones específicas del tenant
  // const tenantConfig: TenantConfig = {
  //   name: tenant,
  //   theme: getTenantTheme(tenant),
  // };

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

function getTenantTheme(tenant: string): string {
  const themes: Record<string, string> = {
    clientea: "blue",
    clienteb: "green",
    clientec: "red",
    default: "",
  };
  return themes[tenant] || themes.default;
}
