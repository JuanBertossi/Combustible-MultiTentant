// components/pages/_S/Configuracion/ConfiguracionPage.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  Alert,
  Grid,
  TextField,
  Button,
  CardContent,
} from "@mui/material";
import PolicyIcon from "@mui/icons-material/Policy";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaletteIcon from "@mui/icons-material/Palette";
import { useTheme } from "@/components/providers/theme/use-theme";

// Componente de personalización
function PersonalizacionTab() {
  const { tenantTheme, updateTenantTheme } = useTheme();
  const [localConfig, setLocalConfig] = useState(tenantTheme || {
    primaryColor: '#1E2C56',
    secondaryColor: '#3b82f6',
    sidebarBg: '#1E2C56',
    sidebarText: '#ffffff',
    accentColor: '#10b981',
  });
  const [saved, setSaved] = useState(false);

  const handleColorChange = (key: keyof typeof localConfig, value: string) => {
    setLocalConfig({ ...localConfig, [key]: value });
  };

  const handleSave = () => {
    if (updateTenantTheme) {
      updateTenantTheme(localConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleReset = () => {
    if (tenantTheme) {
      setLocalConfig(tenantTheme);
    }
  };

  const presets = [
    { name: "Azul Corporativo", colors: { primaryColor: '#1E2C56', secondaryColor: '#3b82f6', sidebarBg: '#1E2C56', sidebarText: '#ffffff', accentColor: '#10b981' } },
    { name: "Verde Naturaleza", colors: { primaryColor: '#10b981', secondaryColor: '#059669', sidebarBg: '#064e3b', sidebarText: '#d1fae5', accentColor: '#f59e0b' } },
    { name: "Rojo Energía", colors: { primaryColor: '#ef4444', secondaryColor: '#dc2626', sidebarBg: '#7f1d1d', sidebarText: '#fee2e2', accentColor: '#f59e0b' } },
    { name: "Púrpura Moderno", colors: { primaryColor: '#8b5cf6', secondaryColor: '#7c3aed', sidebarBg: '#5b21b6', sidebarText: '#ede9fe', accentColor: '#10b981' } },
  ];

  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          🎨 Personalización del Tema
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure los colores y estilo de su empresa. Los cambios se aplicarán inmediatamente.
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ✅ Tema guardado exitosamente
          </Alert>
        )}

        {/* Presets */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            Temas Predefinidos
          </Typography>
          <Grid container spacing={2}>
            {presets.map((preset) => (
              <Grid item xs={6} sm={3} key={preset.name}>
                <Box
                  onClick={() => setLocalConfig(preset.colors)}
                  sx={{
                    p: 2,
                    border: "2px solid #e2e8f0",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: preset.colors.primaryColor,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: preset.colors.primaryColor, borderRadius: 1 }} />
                    <Box sx={{ width: 20, height: 20, bgcolor: preset.colors.secondaryColor, borderRadius: 1 }} />
                    <Box sx={{ width: 20, height: 20, bgcolor: preset.colors.accentColor, borderRadius: 1 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={600}>
                    {preset.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {/* Color Primario */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color Primario
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                type="color"
                value={localConfig.primaryColor}
                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                sx={{ width: 80 }}
              />
              <TextField
                value={localConfig.primaryColor}
                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                placeholder="#1E2C56"
                fullWidth
                size="small"
              />
            </Box>
          </Grid>

          {/* Color Secundario */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color Secundario
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                type="color"
                value={localConfig.secondaryColor}
                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                sx={{ width: 80 }}
              />
              <TextField
                value={localConfig.secondaryColor}
                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                placeholder="#3b82f6"
                fullWidth
                size="small"
              />
            </Box>
          </Grid>

          {/* Fondo Sidebar */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Fondo del Sidebar
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                type="color"
                value={localConfig.sidebarBg}
                onChange={(e) => handleColorChange("sidebarBg", e.target.value)}
                sx={{ width: 80 }}
              />
              <TextField
                value={localConfig.sidebarBg}
                onChange={(e) => handleColorChange("sidebarBg", e.target.value)}
                placeholder="#1E2C56"
                fullWidth
                size="small"
              />
            </Box>
          </Grid>

          {/* Texto Sidebar */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Texto del Sidebar
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                type="color"
                value={localConfig.sidebarText}
                onChange={(e) => handleColorChange("sidebarText", e.target.value)}
                sx={{ width: 80 }}
              />
              <TextField
                value={localConfig.sidebarText}
                onChange={(e) => handleColorChange("sidebarText", e.target.value)}
                placeholder="#ffffff"
                fullWidth
                size="small"
              />
            </Box>
          </Grid>

          {/* Color de Acento */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Color de Acento
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                type="color"
                value={localConfig.accentColor}
                onChange={(e) => handleColorChange("accentColor", e.target.value)}
                sx={{ width: 80 }}
              />
              <TextField
                value={localConfig.accentColor}
                onChange={(e) => handleColorChange("accentColor", e.target.value)}
                placeholder="#10b981"
                fullWidth
                size="small"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Preview */}
        <Box sx={{ mt: 4, p: 3, border: "2px solid #e2e8f0", borderRadius: 2, bgcolor: "#f9fafb" }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            Vista Previa
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Button
                variant="contained"
                fullWidth
                size="small"
                sx={{ bgcolor: localConfig.primaryColor, "&:hover": { bgcolor: localConfig.primaryColor, opacity: 0.9 } }}
              >
                Primario
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  height: 36,
                  bgcolor: localConfig.sidebarBg,
                  color: localConfig.sidebarText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  fontSize: "0.875rem",
                }}
              >
                Sidebar
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  height: 36,
                  bgcolor: localConfig.accentColor,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  fontSize: "0.875rem",
                }}
              >
                Acento
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                sx={{ borderColor: localConfig.secondaryColor, color: localConfig.secondaryColor }}
              >
                Secundario
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Acciones */}
        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={handleReset}>
            Restablecer
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: localConfig.primaryColor, "&:hover": { bgcolor: localConfig.primaryColor, opacity: 0.9 } }}
          >
            Guardar Cambios
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// Tabs placeholders (mantén los que tenías)
function PoliticasTab() {
  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Políticas de Evidencias</Typography>
      <Typography color="text.secondary">Próximamente...</Typography>
    </Card>
  );
}

function PreciosTab() {
  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Precios de Combustible</Typography>
      <Typography color="text.secondary">Próximamente...</Typography>
    </Card>
  );
}

function UmbralesTab() {
  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Umbrales por Vehículo</Typography>
      <Typography color="text.secondary">Próximamente...</Typography>
    </Card>
  );
}

function AlertasTab() {
  return (
    <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Configuración de Alertas</Typography>
      <Typography color="text.secondary">Próximamente...</Typography>
    </Card>
  );
}

export default function ConfiguracionPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
          Configuración
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestión de políticas, precios, umbrales, alertas y personalización
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          bgcolor: "white",
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            minHeight: 64,
          },
        }}
      >
        <Tab icon={<PaletteIcon />} iconPosition="start" label="Personalización" />
        <Tab icon={<PolicyIcon />} iconPosition="start" label="Políticas" />
        <Tab icon={<LocalGasStationIcon />} iconPosition="start" label="Precios" />
        <Tab icon={<DirectionsCarIcon />} iconPosition="start" label="Umbrales" />
        <Tab icon={<NotificationsIcon />} iconPosition="start" label="Alertas" />
      </Tabs>

      {tab === 0 && <PersonalizacionTab />}
      {tab === 1 && <PoliticasTab />}
      {tab === 2 && <PreciosTab />}
      {tab === 3 && <UmbralesTab />}
      {tab === 4 && <AlertasTab />}
    </Box>
  );
}
