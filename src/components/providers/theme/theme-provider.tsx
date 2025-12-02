import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./theme-context";
import type { Theme, ThemeProviderProps } from "./types";
import { useTenantContext } from "../tenants/use-tenant";

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

  useEffect(() => {
    // const root = window.document.documentElement;

    // root.classList.remove("light", "dark");

    // if (theme === "system") {
    //   const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
    //     .matches
    //     ? "dark"
    //     : "light";

    //   root.classList.add(systemTheme);
    //   return;
    // }

    // root.classList.add(theme);
    const root = document.body; // o document.documentElement
    // Remueve cualquier tema anterior
    root.classList.remove("theme-blue", "theme-green", "theme-red");
    // Aplica el tema del tenant si existe y es válido
    if (tenant?.theme && ["blue", "green", "red"].includes(tenant.theme)) {
      root.classList.add(`theme-${tenant.theme}`);
    }else{
      // si no hay tema de tenant, revisar el tema en root y si hay uno quitarlo
    }
  }, [tenant?.theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
