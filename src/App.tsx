import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { TenantProvider } from "./components/providers/tenants/tenant-provider";
import { ThemeProvider } from "./components/providers/theme/theme-provider";
import { AuthProvider } from "./components/providers/auth/auth-provider";
import { Toaster } from "./components/ui/sonner";
import { Routing } from "./routes/routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <AuthProvider> 
          <ThemeProvider defaultTheme="system" storageKey="multitenant-ui-theme">
            <Routing />
            <Toaster />
          </ThemeProvider>
        </AuthProvider> 
      </TenantProvider>
    </QueryClientProvider>
  );
}

export default App;
