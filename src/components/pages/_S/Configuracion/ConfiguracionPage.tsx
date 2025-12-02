// components/pages/_S/Configuracion/ConfiguracionPage.tsx
import { useState } from "react";
import { Box, Typography, Tabs, Tab, Card, Alert } from "@mui/material";
import PolicyIcon from "@mui/icons-material/Policy";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Tipos temporales (luego moverlos a types/)
interface PoliticaCombustible {
  id: number;
  nombre: string;
  requiereFoto: boolean;
  requiereTicket: boolean;
  requiereKilometraje: boolean;
}

interface PrecioCombustible {
  id: number;
  tipoCombustible: string;
  precio: number;
  vigenciaDesde: string;
}

interface UmbralVehiculo {
  id: number;
  vehiculoPatente: string;
  umbralMinimo: number;
  umbralMaximo: number;
}

interface ConfiguracionAlerta {
  id: number;
  tipo: string;
  habilitada: boolean;
  descripcion: string;
}

// Mock data temporal
const mockPolitica: PoliticaCombustible = {
  id: 1,
  nombre: "Política Estándar",
  requiereFoto: true,
  requiereTicket: true,
  requiereKilometraje: true,
};

const mockPrecios: PrecioCombustible[] = [
  {
    id: 1,
    tipoCombustible: "Nafta Super",
    precio: 850,
    vigenciaDesde: "2024-01-01",
  },
  {
    id: 2,
    tipoCombustible: "Diesel",
    precio: 780,
    vigenciaDesde: "2024-01-01",
  },
];

const mockUmbrales: UmbralVehiculo[] = [
  {
    id: 1,
    vehiculoPatente: "ABC123",
    umbralMinimo: 20,
    umbralMaximo: 80,
  },
];

const mockConfiguracionesAlertas: ConfiguracionAlerta[] = [
  {
    id: 1,
    tipo: "Carga Excesiva",
    habilitada: true,
    descripcion: "Notificar cuando se excede el umbral máximo",
  },
  {
    id: 2,
    tipo: "Precio Fuera de Rango",
    habilitada: true,
    descripcion: "Notificar cuando el precio difiere significativamente",
  },
];

// Componentes de tabs simplificados (crear archivos separados después)
function PoliticasTab({
  politica,
  onChange,
  onSave,
}: {
  politica: PoliticaCombustible;
  onChange: (p: PoliticaCombustible) => void;
  onSave: () => void;
}) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Políticas de Evidencias
      </Typography>
      <Typography color="text.secondary">
        Configuración de políticas (próximamente)
      </Typography>
    </Card>
  );
}

function PreciosTab({
  precios,
  onUpdate,
  onSave,
}: {
  precios: PrecioCombustible[];
  onUpdate: (p: PrecioCombustible[]) => void;
  onSave: () => void;
}) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Precios de Combustible
      </Typography>
      <Typography color="text.secondary">
        Gestión de precios (próximamente)
      </Typography>
    </Card>
  );
}

function UmbralesTab({
  umbrales,
  onUpdate,
  onSave,
}: {
  umbrales: UmbralVehiculo[];
  onUpdate: (u: UmbralVehiculo[]) => void;
  onSave: () => void;
}) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Umbrales por Vehículo
      </Typography>
      <Typography color="text.secondary">
        Configuración de umbrales (próximamente)
      </Typography>
    </Card>
  );
}

function AlertasTab({
  configuraciones,
  onToggle,
}: {
  configuraciones: ConfiguracionAlerta[];
  onToggle: (c: ConfiguracionAlerta) => void;
}) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Configuración de Alertas
      </Typography>
      <Typography color="text.secondary">
        Gestión de alertas (próximamente)
      </Typography>
    </Card>
  );
}

export default function ConfiguracionPage() {
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(false);

  // Estados
  const [politica, setPolitica] = useState<PoliticaCombustible>(mockPolitica);
  const [precios, setPrecios] = useState<PrecioCombustible[]>(mockPrecios);
  const [umbrales, setUmbrales] = useState<UmbralVehiculo[]>(mockUmbrales);
  const [configuracionesAlertas, setConfiguracionesAlertas] = useState<
    ConfiguracionAlerta[]
  >(mockConfiguracionesAlertas);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    console.log("Configuración guardada");
  };

  const handleToggleAlerta = (config: ConfiguracionAlerta) => {
    setConfiguracionesAlertas(
      configuracionesAlertas.map((c) =>
        c.id === config.id ? { ...c, habilitada: !c.habilitada } : c
      )
    );
    handleSave();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
          Configuración
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestión de políticas, precios, umbrales y alertas
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ Configuración guardada exitosamente
        </Alert>
      )}

      {/* Tabs */}
      <Card
        elevation={0}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 3 }}
      >
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #e0e0e0",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 64,
            },
          }}
        >
          <Tab
            icon={<PolicyIcon />}
            iconPosition="start"
            label="Políticas de Evidencias"
          />
          <Tab
            icon={<LocalGasStationIcon />}
            iconPosition="start"
            label="Precios de Combustible"
          />
          <Tab
            icon={<DirectionsCarIcon />}
            iconPosition="start"
            label="Umbrales por Vehículo"
          />
          <Tab
            icon={<NotificationsIcon />}
            iconPosition="start"
            label="Alertas"
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {tab === 0 && (
        <PoliticasTab
          politica={politica}
          onChange={setPolitica}
          onSave={handleSave}
        />
      )}

      {tab === 1 && (
        <PreciosTab
          precios={precios}
          onUpdate={setPrecios}
          onSave={handleSave}
        />
      )}

      {tab === 2 && (
        <UmbralesTab
          umbrales={umbrales}
          onUpdate={setUmbrales}
          onSave={handleSave}
        />
      )}

      {tab === 3 && (
        <AlertasTab
          configuraciones={configuracionesAlertas}
          onToggle={handleToggleAlerta}
        />
      )}
    </Box>
  );
}
