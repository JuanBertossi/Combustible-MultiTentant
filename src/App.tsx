// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { TenantProvider } from "./components/providers/tenants/tenant-provider";
import { ThemeProvider } from "./components/providers/theme/theme-provider";
import { AdminAuthProvider } from "./components/providers/auth/_A/AdminAuthProvider";
import { TenantAuthProvider } from "./components/providers/auth/_S/TenantAuthProvider";
import { Toaster } from "./components/ui/sonner";
import { Routing } from "./routes/routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TenantProvider>
          {/* Auth para TENANTS (/s) */}
          <TenantAuthProvider>
            {/* Auth para ADMIN (/a) */}
            <AdminAuthProvider>
              <ThemeProvider
                defaultTheme="system"
                storageKey="multitenant-ui-theme"
              >
                <Routing />
                <Toaster />
              </ThemeProvider>
            </AdminAuthProvider>
          </TenantAuthProvider>
        </TenantProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
