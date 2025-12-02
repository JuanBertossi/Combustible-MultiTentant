// src/components/pages/_A/Login/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/components/providers/auth/_A/AdminAuthProvider";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function SuperAdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.email.endsWith("@goodapps.com")) {
        throw new Error("Solo usuarios de GoodApps pueden acceder");
      }

      await login(formData);
      navigate("/a");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Logo/Icon */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#1E2C56",
                mb: 3,
              }}
            >
              <BusinessIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mb: 1, color: "#1E2C56" }}
            >
              GoodApps Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Panel de Super Administración
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mb: 1, color: "#374151" }}
              >
                Correo electrónico
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="admin@goodapps.com"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                Usa tu correo @goodapps.com
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mb: 1, color: "#374151" }}
              >
                Contraseña
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Ingresa tu contraseña"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                  },
                }}
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: "#1E2C56",
                py: 1.5,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(30, 44, 86, 0.2)",
                "&:hover": {
                  bgcolor: "#16213E",
                  boxShadow: "0 6px 16px rgba(30, 44, 86, 0.3)",
                },
                "&:disabled": {
                  bgcolor: "#9ca3af",
                },
              }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Solo para personal autorizado de GoodApps
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
