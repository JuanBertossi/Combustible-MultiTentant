import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Typography,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PropaneTankIcon from "@mui/icons-material/PropaneTank";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WarningIcon from "@mui/icons-material/Warning";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useTenantStore } from "@/stores/tenant.store";
import * as XLSX from "xlsx";

const TIPOS_COMBUSTIBLE: string[] = ["Diésel", "Nafta", "GNC", "GLP"];

interface TanqueExtended {
  id: number;
  codigo?: string;
  nombre: string;
  ubicacion?: string;
  tipoCombustible?: string;
  capacidadMaxima?: number;
  nivelActual?: number;
  activo: boolean;
  empresaId: number;
  empresa?: string;
  empresaNombre?: string;
}

interface TanqueFormData {
  codigo: string;
  nombre: string;
  ubicacion: string;
  tipoCombustible: string;
  capacidadMaxima: string | number;
  nivelActual: string | number;
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// Mock data
const mockTanques: TanqueExtended[] = [
  {
    id: 1,
    codigo: "TNQ-001",
    nombre: "Tanque Principal Diésel",
    ubicacion: "Estación Central",
    tipoCombustible: "Diésel",
    capacidadMaxima: 10000,
    nivelActual: 7500,
    activo: true,
    empresaId: 1,
    empresa: "Empresa A",
  },
  {
    id: 2,
    codigo: "TNQ-002",
    nombre: "Tanque Nafta Super",
    ubicacion: "Zona Norte",
    tipoCombustible: "Nafta",
    capacidadMaxima: 5000,
    nivelActual: 1200,
    activo: true,
    empresaId: 1,
    empresa: "Empresa A",
  },
  {
    id: 3,
    codigo: "TNQ-003",
    nombre: "Tanque GNC Secundario",
    ubicacion: "Zona Sur - Depósito",
    tipoCombustible: "GNC",
    capacidadMaxima: 8000,
    nivelActual: 300,
    activo: true,
    empresaId: 2,
    empresa: "Empresa B",
  },
  {
    id: 4,
    codigo: "TNQ-004",
    nombre: "Tanque GLP Reserva",
    ubicacion: "Zona Este - Campo 5",
    tipoCombustible: "GLP",
    capacidadMaxima: 3000,
    nivelActual: 2100,
    activo: false,
    empresaId: 1,
    empresa: "Empresa A",
  },
];

const getColorByTipo = (tipo: string): string => {
  const colors: Record<string, string> = {
    Diésel: "#10b981",
    Nafta: "#3b82f6",
    GNC: "#f59e0b",
    GLP: "#8b5cf6",
  };
  return colors[tipo] ?? "#667eea";
};

const getNivelPercentage = (tanque: TanqueExtended): number => {
  return ((tanque.nivelActual || 0) / (tanque.capacidadMaxima || 1)) * 100;
};

const getNivelColor = (percentage: number): "success" | "warning" | "error" => {
  if (percentage > 50) return "success";
  if (percentage > 25) return "warning";
  return "error";
};

export default function TanquesPage() {
  const { user, tenantConfig } = useTenantStore();
  const tenantName = tenantConfig?.name;
  const [tanques, setTanques] = useState<TanqueExtended[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingTanque, setEditingTanque] = useState<TanqueExtended | null>(
    null
  );
  const [deleteTanque, setDeleteTanque] = useState<TanqueExtended | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterTipo, setFilterTipo] = useState<string>("Todos");
  const [formData, setFormData] = useState<TanqueFormData>({
    codigo: "",
    nombre: "",
    ubicacion: "",
    tipoCombustible: "Diésel",
    capacidadMaxima: "",
    nivelActual: "",
    activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // ✅ Todos los hooks antes del early return
  useEffect(() => {
    const loadTanques = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTanques(mockTanques);
      } catch (error) {
        console.error("Error loading tanques:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTanques();
  }, []);

  // ✅ Early return después de todos los hooks
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Cargando tanques...</Typography>
      </Box>
    );
  }

  const filteredTanques = tanques.filter((t) => {
    const matchSearch =
      (t.codigo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.ubicacion || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo =
      filterTipo === "Todos" || t.tipoCombustible === filterTipo;
    return matchSearch && matchTipo;
  });

  const handleExport = (): void => {
    const dataToExport = filteredTanques.map((t) => {
      const percentage = (
        ((t.nivelActual || 0) / (t.capacidadMaxima || 1)) *
        100
      ).toFixed(1);
      return {
        Código: t.codigo || "",
        Nombre: t.nombre,
        Ubicación: t.ubicacion || "",
        "Tipo Combustible": t.tipoCombustible || "",
        "Capacidad Máxima (L)": t.capacidadMaxima || 0,
        "Nivel Actual (L)": t.nivelActual || 0,
        "Nivel (%)": percentage,
        "Disponible (L)": (t.capacidadMaxima || 0) - (t.nivelActual || 0),
        Estado: t.activo ? "Activo" : "Inactivo",
        ...(user?.role === "admin" && {
          Empresa: t.empresa || t.empresaNombre,
        }),
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tanques");
    XLSX.writeFile(
      wb,
      `Tanques_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleNew = (): void => {
    setEditingTanque(null);
    setFormData({
      codigo: "",
      nombre: "",
      ubicacion: "",
      tipoCombustible: "Diésel",
      capacidadMaxima: "",
      nivelActual: "",
      activo: true,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (tanque: TanqueExtended): void => {
    setEditingTanque(tanque);
    setFormData({
      codigo: tanque.codigo || "",
      nombre: tanque.nombre,
      ubicacion: tanque.ubicacion || "",
      tipoCombustible: tanque.tipoCombustible || "Diésel",
      capacidadMaxima: tanque.capacidadMaxima || "",
      nivelActual: tanque.nivelActual || "",
      activo: tanque.activo,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = "El código es obligatorio";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.ubicacion.trim())
      newErrors.ubicacion = "La ubicación es obligatoria";
    if (!formData.tipoCombustible)
      newErrors.tipoCombustible = "El tipo es obligatorio";

    const capacidad =
      typeof formData.capacidadMaxima === "string"
        ? parseFloat(formData.capacidadMaxima)
        : formData.capacidadMaxima;
    const nivel =
      typeof formData.nivelActual === "string"
        ? parseFloat(formData.nivelActual)
        : formData.nivelActual;

    if (!capacidad || capacidad <= 0) {
      newErrors.capacidadMaxima = "La capacidad debe ser mayor a 0";
    }
    if (nivel < 0) {
      newErrors.nivelActual = "El nivel no puede ser negativo";
    }
    if (nivel > capacidad) {
      newErrors.nivelActual = "El nivel no puede superar la capacidad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const capacidad =
      typeof formData.capacidadMaxima === "string"
        ? parseFloat(formData.capacidadMaxima)
        : formData.capacidadMaxima;
    const nivel =
      typeof formData.nivelActual === "string"
        ? parseFloat(formData.nivelActual)
        : formData.nivelActual;

    try {
      if (editingTanque) {
        setTanques(
          tanques.map((t) =>
            t.id === editingTanque.id
              ? {
                  ...editingTanque,
                  ...formData,
                  capacidadMaxima: capacidad,
                  nivelActual: nivel,
                }
              : t
          )
        );
      } else {
        const newTanque: TanqueExtended = {
          id: Math.max(...tanques.map((t) => t.id), 0) + 1,
          codigo: formData.codigo,
          nombre: formData.nombre,
          ubicacion: formData.ubicacion,
          tipoCombustible: formData.tipoCombustible,
          capacidadMaxima: capacidad,
          nivelActual: nivel,
          activo: formData.activo,
          empresaId: 1,
          empresa: tenantName,
        };
        setTanques([...tanques, newTanque]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving tanque:", error);
    }
  };

  const handleDeleteClick = (tanque: TanqueExtended): void => {
    setDeleteTanque(tanque);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deleteTanque) {
      try {
        setTanques(tanques.filter((t) => t.id !== deleteTanque.id));
      } catch (error) {
        console.error("Error deleting tanque:", error);
      }
    }
    setOpenDeleteDialog(false);
    setDeleteTanque(null);
  };

  return (
    <Box sx={{ p: 3, mt: -3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
          Gestión de Tanques • {filteredTanques.length}{" "}
          {filteredTanques.length === 1 ? "tanque" : "tanques"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredTanques.length === 0}
            sx={{
              borderColor: "#10b981",
              color: "#10b981",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { borderColor: "#059669", bgcolor: "#10b98110" },
            }}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            sx={{
              bgcolor: "#1E2C56",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#16213E" },
            }}
          >
            Nuevo Tanque
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Box
        sx={{
          mb: 3,
          background: "white",
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Buscar por código, nombre o ubicación..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          label="Tipo"
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="Todos">Todos los tipos</MenuItem>
          {TIPOS_COMBUSTIBLE.map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              {tipo}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Grid de tanques */}
      <Grid container spacing={3}>
        {filteredTanques.map((tanque) => {
          const percentage = getNivelPercentage(tanque);
          const nivelColor = getNivelColor(percentage);

          return (
            <Grid item xs={12} sm={6} md={4} key={tanque.id}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  height: "100%",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    boxShadow: "0 8px 18px rgba(15,23,42,0.10)",
                    transform: "translateY(-3px)",
                    borderColor: getColorByTipo(tanque.tipoCombustible || ""),
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: `${getColorByTipo(
                          tanque.tipoCombustible || ""
                        )}15`,
                        color: getColorByTipo(tanque.tipoCombustible || ""),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PropaneTankIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Chip
                      label={tanque.tipoCombustible || ""}
                      size="small"
                      sx={{
                        bgcolor: `${getColorByTipo(
                          tanque.tipoCombustible || ""
                        )}15`,
                        color: getColorByTipo(tanque.tipoCombustible || ""),
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                    {tanque.codigo || ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    {tanque.nombre}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 2,
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
                    <Typography variant="caption" color="text.secondary">
                      {tanque.ubicacion}
                    </Typography>
                  </Box>

                  {/* Nivel del tanque */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Nivel actual
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {percentage < 25 && (
                          <WarningIcon
                            sx={{ fontSize: 16, color: "#f59e0b" }}
                          />
                        )}
                        <Typography variant="caption" fontWeight={600}>
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      color={nivelColor}
                      sx={{ height: 8, borderRadius: 1, mb: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {(tanque.nivelActual || 0).toLocaleString()} /{" "}
                      {(tanque.capacidadMaxima || 0).toLocaleString()} L
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        Capacidad
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {(tanque.capacidadMaxima || 0).toLocaleString()} L
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        Disponible
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="#10b981"
                      >
                        {(
                          (tanque.capacidadMaxima || 0) -
                          (tanque.nivelActual || 0)
                        ).toLocaleString()}{" "}
                        L
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={tanque.activo ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{
                      bgcolor: tanque.activo ? "#10b98115" : "#99999915",
                      color: tanque.activo ? "#10b981" : "#999",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  />

                  {user?.role === "admin" && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 2 }}
                    >
                      Empresa: {tanque.empresa}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(tanque)}
                      sx={{
                        bgcolor: "#f3f4f6",
                        "&:hover": { bgcolor: "#e5e7eb" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(tanque)}
                      sx={{
                        bgcolor: "#fee2e2",
                        color: "#dc2626",
                        "&:hover": { bgcolor: "#fecaca" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredTanques.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <PropaneTankIcon sx={{ fontSize: 64, color: "#ddd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay tanques registrados
          </Typography>
        </Box>
      )}

      {/* Diálogo crear/editar */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTanque ? "Editar Tanque" : "Nuevo Tanque"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Código"
              value={formData.codigo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  codigo: e.target.value.toUpperCase(),
                })
              }
              error={!!errors.codigo}
              helperText={errors.codigo}
              required
              placeholder="TNQ-001"
              fullWidth
            />
            <TextField
              select
              label="Tipo de Combustible"
              value={formData.tipoCombustible}
              onChange={(e) =>
                setFormData({ ...formData, tipoCombustible: e.target.value })
              }
              error={!!errors.tipoCombustible}
              helperText={errors.tipoCombustible}
              required
              fullWidth
            >
              {TIPOS_COMBUSTIBLE.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
              placeholder="Tanque Principal Diésel"
              fullWidth
            />
            <TextField
              label="Ubicación"
              value={formData.ubicacion}
              onChange={(e) =>
                setFormData({ ...formData, ubicacion: e.target.value })
              }
              error={!!errors.ubicacion}
              helperText={errors.ubicacion}
              required
              placeholder="Estación Central, Lote 45, etc."
              fullWidth
            />
            <TextField
              label="Capacidad Máxima (litros)"
              type="number"
              value={formData.capacidadMaxima}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacidadMaxima: parseInt(e.target.value) || "",
                })
              }
              error={!!errors.capacidadMaxima}
              helperText={errors.capacidadMaxima}
              required
              fullWidth
            />
            <TextField
              label="Nivel Actual (litros)"
              type="number"
              value={formData.nivelActual}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nivelActual: parseInt(e.target.value) || "",
                })
              }
              error={!!errors.nivelActual}
              helperText={errors.nivelActual}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingTanque ? "Guardar Cambios" : "Crear Tanque"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo eliminar */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar el tanque{" "}
            <strong>{deleteTanque?.codigo}</strong> -{" "}
            <strong>{deleteTanque?.nombre}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
