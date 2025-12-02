import { useMemo } from "react";

export const useTenantDomain = () => {
  const tenant: string | 'default' = useMemo(() => {
    // Obtener el hostname actual
    const hostname = window.location.hostname;
    const appDomain = import.meta.env.VITE_APP_DOMAIN;
    const defaultTenant = import.meta.env.VITE_APP_DEFAULT_TENANT || "default";

    

    // Extraer el subdominio
    const subdomain = hostname.replace(`.${appDomain}`, "");

    console.log({
      hostname,
      appDomain,
      subdomain,
    })

    // Validar que sea un subdominio válido
    if (subdomain && subdomain !== hostname) {
      return subdomain;
    }

    return defaultTenant;
  }, []);

  return tenant;
};
