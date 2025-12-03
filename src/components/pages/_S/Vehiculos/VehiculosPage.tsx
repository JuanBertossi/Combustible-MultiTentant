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
import { useDropzone } from "react-dropzone";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useTenantAuth } from "@/components/providers/auth/_S/TenantAuthProvider";
import { useTenantContext } from "@/components/providers/tenants/use-tenant";
import * as XLSX from "xlsx";

type TipoVehiculo =
  | "Camión"
  | "Tractor"
  | "Sembradora"
  | "Cosechadora"
  | "Pulverizadora"
  | "Pick-up"
  | "Generador"
  | "Otro";

interface Vehiculo {
  id: number;
  patente: string;
  tipo: TipoVehiculo;
  marca?: string;
  modelo?: string;
  anio?: number;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
}

interface VehiculoFormData {
  patente: string;
  tipo: TipoVehiculo;
  marca: string;
  modelo: string;
  anio: number;
  capacidad: string | number;
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const TIPOS_VEHICULO: TipoVehiculo[] = [
  "Camión",
  "Tractor",
  "Sembradora",
  "Cosechadora",
  "Pulverizadora",
  "Pick-up",
  "Generador",
  "Otro",
];

// Mock data temporal
const mockVehiculos: Vehiculo[] = [
  {
    id: 1,
    patente: "ABC123",
    tipo: "Camión",
    marca: "Ford",
    modelo: "F-150",
    anio: 2022,
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
  {
    id: 2,
    patente: "XYZ789",
    tipo: "Tractor",
    marca: "John Deere",
    modelo: "6120M",
    anio: 2021,
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
  {
    id: 3,
    patente: "AAA111",
    tipo: "Pick-up",
    marca: "Toyota",
    modelo: "Hilux",
    anio: 2020,
    activo: true,
    empresaId: 2,
    empresaNombre: "Empresa B",
  },
  {
    id: 4,
    patente: "BBB222",
    tipo: "Cosechadora",
    marca: "Case IH",
    modelo: "Axial-Flow 8250",
    anio: 2019,
    activo: false,
    empresaId: 2,
    empresaNombre: "Empresa B",
  },
];

const getColorByTipo = (tipo: TipoVehiculo): string => {
  const colors: Record<TipoVehiculo, string> = {
    Camión: "#3b82f6",
    Tractor: "#10b981",
    Sembradora: "#f59e0b",
    Cosechadora: "#8b5cf6",
    Pulverizadora: "#ec4899",
    "Pick-up": "#06b6d4",
    Generador: "#ef4444",
    Otro: "#667eea",
  };
  return colors[tipo] || "#667eea";
};

export default function VehiculosPage() {
  const { user } = useTenantAuth();
  const { name: tenantName } = useTenantContext();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [deleteVehiculo, setDeleteVehiculo] = useState<Vehiculo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterTipo, setFilterTipo] = useState<string>("Todos");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<VehiculoFormData>({
    patente: "",
    tipo: "Camión",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    capacidad: "",
    activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setImageFile(acceptedFiles[0]);
      }
    },
    accept: { "image/*": [] },
    multiple: false,
  });

  useEffect(() => {
    const loadVehiculos = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setVehiculos(mockVehiculos);
      } catch (error) {
        console.error("Error loading vehiculos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVehiculos();
  }, []);

  const handleExport = (): void => {
    const dataToExport = filteredVehiculos.map((v) => ({
      Patente: v.patente,
      Tipo: v.tipo,
      Marca: v.marca || "",
      Modelo: v.modelo || "",
      Año: v.anio || "",
      Estado: v.activo ? "Activo" : "Inactivo",
      ...(user?.role === "admin" && { Empresa: v.empresaNombre }),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vehículos");
    XLSX.writeFile(
      wb,
      `Vehiculos_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleNew = (): void => {
    setEditingVehiculo(null);
    setFormData({
      patente: "",
      tipo: "Camión",
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      capacidad: "",
      activo: true,
    });
    setImageFile(null);
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (vehiculo: Vehiculo): void => {
    setEditingVehiculo(vehiculo);
    setFormData({
      patente: vehiculo.patente,
      tipo: vehiculo.tipo,
      marca: vehiculo.marca || "",
      modelo: vehiculo.modelo || "",
      anio: vehiculo.anio || new Date().getFullYear(),
      capacidad: "",
      activo: vehiculo.activo,
    });
    setImageFile(null);
    setErrors({});
    setOpenDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.patente.trim())
      newErrors.patente = "La patente es obligatoria";
    if (!formData.tipo) newErrors.tipo = "El tipo es obligatorio";
    if (!formData.marca.trim()) newErrors.marca = "La marca es obligatoria";
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es obligatorio";
    if (!formData.anio) {
      newErrors.anio = "El año es obligatorio";
    } else if (
      formData.anio < 1900 ||
      formData.anio > new Date().getFullYear() + 1
    ) {
      newErrors.anio = "Año inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingVehiculo) {
        setVehiculos(
          vehiculos.map((v) =>
            v.id === editingVehiculo.id
              ? { ...editingVehiculo, ...formData }
              : v
          )
        );
      } else {
        const newVehiculo: Vehiculo = {
          id: Math.max(...vehiculos.map((v) => v.id), 0) + 1,
          patente: formData.patente,
          tipo: formData.tipo,
          marca: formData.marca,
          modelo: formData.modelo,
          anio: formData.anio,
          activo: formData.activo,
          empresaId: 1,
          empresaNombre: tenantName,
        };
        setVehiculos([...vehiculos, newVehiculo]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving vehiculo:", error);
    }
  };

  const handleDeleteClick = (vehiculo: Vehiculo): void => {
    setDeleteVehiculo(vehiculo);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deleteVehiculo) {
      try {
        setVehiculos(vehiculos.filter((v) => v.id !== deleteVehiculo.id));
      } catch (error) {
        console.error("Error deleting vehiculo:", error);
      }
    }
    setOpenDeleteDialog(false);
    setDeleteVehiculo(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Cargando vehículos...</Typography>
      </Box>
    );
  }

  const vehiculosPorEmpresa = vehiculos;

  const filteredVehiculos = vehiculosPorEmpresa.filter((v) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      v.patente.toLowerCase().includes(term) ||
      (v.marca && v.marca.toLowerCase().includes(term)) ||
      (v.modelo && v.modelo.toLowerCase().includes(term));
    const matchTipo = filterTipo === "Todos" || v.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header alineado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: -3,
          mb: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              mb: 0.5,
            }}
          >
            Gestión de vehículos y maquinaria • {filteredVehiculos.length}{" "}
            {filteredVehiculos.length === 1 ? "vehículo" : "vehículos"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredVehiculos.length === 0}
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
            Nuevo vehículo
          </Button>
        </Box>
      </Box>

      {/* Filtros estilo card */}
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
          placeholder="Buscar por patente, marca o modelo..."
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
          {TIPOS_VEHICULO.map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              {tipo}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Grid de vehículos */}
      <Grid
        container
        spacing={3}
        sx={{
          alignItems: "stretch",
        }}
      >
        {filteredVehiculos.map((vehiculo) => {
          // Variable local para preview de imagen (si existiera)
          const vehicleImageFile = null; // En una app real, esto vendría de vehiculo.imagenUrl

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={vehiculo.id}
              sx={{ display: "flex", alignItems: "stretch" }}
            >
              <Card
                elevation={0}
                sx={{
                  background: "white",
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  width: 500,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    boxShadow: "0 8px 18px rgba(15,23,42,0.10)",
                    transform: "translateY(-3px)",
                    borderColor: getColorByTipo(vehiculo.tipo),
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 2.5,
                    display: "flex",
                    gap: 2,
                    height: "100%",
                  }}
                >
                  {/* Izquierda: datos */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      pl: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: `${getColorByTipo(vehiculo.tipo)}15`,
                          color: getColorByTipo(vehiculo.tipo),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DirectionsCarIcon sx={{ fontSize: 22 }} />
                      </Box>

                      <Chip
                        label={vehiculo.tipo}
                        size="small"
                        sx={{
                          bgcolor: `${getColorByTipo(vehiculo.tipo)}15`,
                          color: getColorByTipo(vehiculo.tipo),
                          fontWeight: 600,
                          border: "none",
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {vehiculo.patente}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {vehiculo.marca} {vehiculo.modelo}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight={600}>
                          {vehiculo.anio}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={vehiculo.activo ? "Activo" : "Inactivo"}
                      size="small"
                      sx={{
                        bgcolor: vehiculo.activo ? "#10b98115" : "#99999915",
                        color: vehiculo.activo ? "#10b981" : "#999",
                        fontWeight: 600,
                        width: "fit-content",
                        mb: 1,
                      }}
                    />

                    {user?.role === "admin" && (
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {vehiculo.empresaNombre || "N/A"}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", gap: 1, mt: "auto", pt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(vehiculo)}
                        sx={{
                          bgcolor: "#f3f4f6",
                          "&:hover": { bgcolor: "#e5e7eb" },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(vehiculo)}
                        sx={{
                          bgcolor: "#fee2e2",
                          color: "#dc2626",
                          "&:hover": { bgcolor: "#fecaca" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Derecha: imagen del vehículo */}
                  <Box
                    sx={{
                      width: 250,
                      minWidth: 150,
                      height: "100%",
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {vehicleImageFile ? (
                      <img
                        src={URL.createObjectURL(vehicleImageFile)}
                        alt={vehiculo.patente}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <DirectionsCarIcon
                        sx={{ fontSize: 40, color: "#9ca3af" }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredVehiculos.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <DirectionsCarIcon sx={{ fontSize: 64, color: "#ddd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay vehículos registrados
          </Typography>
        </Box>
      )}

      {/* Diálogo de crear/editar */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingVehiculo ? "Editar vehículo" : "Nuevo vehículo"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 3, pt: 2 }}>
            {/* Formulario */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Patente"
                value={formData.patente}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    patente: e.target.value.toUpperCase(),
                  })
                }
                error={!!errors.patente}
                helperText={errors.patente}
                required
                fullWidth
              />
              <TextField
                select
                label="Tipo"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo: e.target.value as TipoVehiculo,
                  })
                }
                error={!!errors.tipo}
                helperText={errors.tipo}
                required
                fullWidth
              >
                {TIPOS_VEHICULO.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Marca"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                error={!!errors.marca}
                helperText={errors.marca}
                required
                fullWidth
              />
              <TextField
                label="Modelo"
                value={formData.modelo}
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
                error={!!errors.modelo}
                helperText={errors.modelo}
                required
                fullWidth
              />
              <TextField
                label="Año"
                type="number"
                value={formData.anio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    anio: parseInt(e.target.value, 10),
                  })
                }
                error={!!errors.anio}
                helperText={errors.anio}
                required
                fullWidth
              />
            </Box>

            <Box
              {...getRootProps()}
              sx={{
                width: 140,
                height: 140,
                borderRadius: 2,
                bgcolor: isDragActive ? "#d1fae5" : "#f3f4f6",
                border: "2px dashed #10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { bgcolor: "#d1fae5" },
              }}
            >
              <input {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <Typography
                variant="caption"
                sx={{ 
                  color: 'text.secondary',
                  letterSpacing: '0.5px',
                  fontWeight: 400,
                  width: '50%',
                  height: '50%',
                }}
              >
                Arrastrá o clickeá para subir una imagen
              </Typography>
              
              
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingVehiculo ? "Guardar cambios" : "Crear vehículo"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar el vehículo{" "}
            <strong>{deleteVehiculo?.patente}</strong>?
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
