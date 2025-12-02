// src/components/pages/_S/Login/LoginPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTenantAuth } from "../../../providers/auth/_S/TenantAuthProvider";
import { useTenant } from "@/components/providers/tenants/tenant-provider"; 
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function LoginPage() {
  const { isAuthenticated, login } = useTenantAuth();
  const { tenant, tenantSlug, loading: loadingTenant } = useTenant();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Si ya está autenticado, redirigir a /s
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/s", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa email y contraseña");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔐 Intentando login en tenant:", tenantSlug);
      await login({ email, password });
      console.log("✅ Login exitoso, redirigiendo a /s");
      navigate("/s");
    } catch (err: any) {
      console.error("❌ Error login:", err);
      setError(err.message || "Credenciales inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading mientras detecta el tenant
  if (loadingTenant) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si no hay tenant detectado
  if (!tenantSlug) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Alert severity="error">
          No se pudo detectar el subdominio. Asegurate de estar en empresaA.localhost:5177
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundImage: "url(/src/assets/images/LoginFondo.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        bgcolor: "#0a0a0a",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(10, 10, 20, 0.2)",
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        <Card
          elevation={24}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "rgba(255, 255, 255, 0.40)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box
            sx={{
              bgcolor: tenant?.primaryColor || "#1E2C56",
              py: 2.5,
              px: 3,
              textAlign: "center",
              color: "#fff",
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                margin: "0 auto 10px",
                borderRadius: "50%",
                bgcolor: tenant?.secondaryColor || "#4A90E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
              }}
            >
              <LocalGasStationIcon sx={{ fontSize: 28, color: "#fff" }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{ mb: 0.5, letterSpacing: 0.3 }}
            >
              {tenant?.name || "Fuel Manager"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, fontSize: "0.75rem" }}
            >
              Sistema de Gestión de Combustible
            </Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "0.8rem",
                }}
              >
                Email *
              </Typography>
              <TextField
                fullWidth
                placeholder={`admin@${tenant?.domain || "empresa.com"}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <EmailOutlinedIcon
                      sx={{ mr: 1, color: "#4A90E2", fontSize: 20 }}
                    />
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 1.5,
                    "& input": {
                      py: 1.3,
                      fontSize: "0.9rem",
                    },
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4A90E2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: tenant?.primaryColor || "#1E2C56",
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "0.8rem",
                }}
              >
                Contraseña *
              </Typography>
              <TextField
                fullWidth
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                required
                InputProps={{
                  startAdornment: (
                    <LockOutlinedIcon
                      sx={{ mr: 1, color: "#4A90E2", fontSize: 20 }}
                    />
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 1.5,
                    "& input": {
                      py: 1.3,
                      fontSize: "0.9rem",
                    },
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4A90E2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: tenant?.primaryColor || "#1E2C56",
                      borderWidth: 2,
                    },
                  },
                }}
              />

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    py: 0.5,
                    fontSize: "0.8rem",
                    borderRadius: 1.5,
                  }}
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.4,
                  bgcolor: tenant?.primaryColor || "#1E2C56",
                  fontWeight: "600",
                  textTransform: "none",
                  fontSize: "1rem",
                  borderRadius: 1.5,
                  boxShadow: "0 4px 12px rgba(30, 44, 86, 0.3)",
                  "&:hover": {
                    bgcolor: tenant?.secondaryColor || "#253661",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(30, 44, 86, 0.4)",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {isLoading ? "Iniciando..." : "Iniciar Sesión"}
              </Button>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 2,
                  fontSize: "0.75rem",
                  color: "#666",
                }}
              >
                Tenant: <strong>{tenantSlug}</strong>
              </Typography>
            </form>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 2,
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 2px 4px rgba(0,0,0,0.6)",
          }}
        >
          © 2025 Fuel Manager
        </Typography>
      </Container>
    </Box>
  );
}
