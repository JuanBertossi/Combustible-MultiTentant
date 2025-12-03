import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useTenantAuth } from "@/components/providers/auth/_S/TenantAuthProvider";
import { useTenantContext } from "@/components/providers/tenants/use-tenant";
import * as XLSX from "xlsx";

interface Chofer {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  licencia?: string;
  telefono?: string;
  vehiculoId?: number;
  vehiculoPatente?: string;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
}

interface ChoferFormData {
  nombre: string;
  apellido: string;
  dni: string;
  licencia: string;
  whatsapp: string;
  vehiculoId: number;
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const mockChoferes: Chofer[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    licencia: "B1234567",
    telefono: "+5493512345678",
    vehiculoId: 1,
    vehiculoPatente: "ABC123",
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    dni: "87654321",
    licencia: "B7654321",
    telefono: "+5493519876543",
    vehiculoId: 2,
    vehiculoPatente: "XYZ789",
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "López",
    dni: "23456789",
    licencia: "C4567890",
    telefono: "+5493498765432",
    activo: false,
    empresaId: 2,
    empresaNombre: "Empresa B",
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "Martínez",
    dni: "34567890",
    licencia: "D2345678",
    telefono: "+5493487654321",
    activo: true,
    empresaId: 2,
    empresaNombre: "Empresa B",
  },
];

const mockVehiculos = [
  { id: 1, patente: "ABC123", tipo: "Camión" as const },
  { id: 2, patente: "XYZ789", tipo: "Tractor" as const },
  { id: 3, patente: "AAA111", tipo: "Pick-up" as const },
];

const getAvatarColor = (nombre: string): string => {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];
  return colors[nombre.charCodeAt(0) % colors.length];
};

const getInitials = (nombre: string, apellido: string): string => {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
};

export default function ChoferesPage() {
  const { user } = useTenantAuth();
  const { name: tenantName } = useTenantContext();
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingChofer, setEditingChofer] = useState<Chofer | null>(null);
  const [deleteChofer, setDeleteChofer] = useState<Chofer | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ChoferFormData>({
    nombre: "",
    apellido: "",
    dni: "",
    licencia: "",
    whatsapp: "",
    vehiculoId: 0,
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
    const loadChoferes = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setChoferes(mockChoferes);
      } catch (error) {
        console.error("Error loading choferes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadChoferes();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Cargando choferes...</Typography>
      </Box>
    );
  }

  const filteredChoferes = choferes.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(term) ||
      c.apellido.toLowerCase().includes(term) ||
      c.dni.includes(searchTerm)
    );
  });

  const handleExport = (): void => {
    const dataToExport = filteredChoferes.map((c) => ({
      Nombre: c.nombre,
      Apellido: c.apellido,
      DNI: c.dni,
      WhatsApp: c.telefono || "",
      Vehículo: c.vehiculoPatente || "Sin asignar",
      Estado: c.activo ? "Activo" : "Inactivo",
      ...(user?.role === "admin" && { Empresa: c.empresaNombre }),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Choferes");
    XLSX.writeFile(
      wb,
      `Choferes_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleNew = (): void => {
    setEditingChofer(null);
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      licencia: "",
      whatsapp: "",
      vehiculoId: 0,
      activo: true,
    });
    setImageFile(null);
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (chofer: Chofer): void => {
    setEditingChofer(chofer);
    setFormData({
      nombre: chofer.nombre,
      apellido: chofer.apellido,
      dni: chofer.dni,
      licencia: chofer.licencia || "",
      whatsapp: chofer.telefono || "",
      vehiculoId: chofer.vehiculoId || 0,
      activo: chofer.activo,
    });
    setImageFile(null);
    setErrors({});
    setOpenDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido.trim())
      newErrors.apellido = "El apellido es obligatorio";
    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio";
    } else if (!/^\d{7,8}$/.test(formData.dni)) {
      newErrors.dni = "DNI inválido (7-8 dígitos)";
    }
    if (
      formData.whatsapp &&
      !/^\+?\d{10,15}$/.test(formData.whatsapp.replace(/\s/g, ""))
    ) {
      newErrors.whatsapp = "Formato inválido (ej: +5493512345678)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingChofer) {
        setChoferes(
          choferes.map((c) =>
            c.id === editingChofer.id
              ? {
                  ...editingChofer,
                  ...formData,
                  telefono: formData.whatsapp,
                  vehiculoPatente:
                    mockVehiculos.find((v) => v.id === formData.vehiculoId)
                      ?.patente || "",
                }
              : c
          )
        );
      } else {
        const newChofer: Chofer = {
          id: Math.max(...choferes.map((c) => c.id), 0) + 1,
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          licencia: formData.licencia,
          telefono: formData.whatsapp,
          vehiculoId: formData.vehiculoId,
          vehiculoPatente:
            mockVehiculos.find((v) => v.id === formData.vehiculoId)?.patente ||
            "",
          activo: formData.activo,
          empresaId: 1,
          empresaNombre: tenantName,
        };
        setChoferes([...choferes, newChofer]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving chofer:", error);
    }
  };

  const handleDeleteClick = (chofer: Chofer): void => {
    setDeleteChofer(chofer);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deleteChofer) {
      setChoferes(choferes.filter((c) => c.id !== deleteChofer.id));
    }
    setOpenDeleteDialog(false);
    setDeleteChofer(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
          mt: -3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
          Gestión de Choferes • {filteredChoferes.length}{" "}
          {filteredChoferes.length === 1 ? "chofer" : "choferes"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredChoferes.length === 0}
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
            Nuevo Chofer
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
          placeholder="Buscar por nombre, apellido o DNI..."
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
      </Box>

      {/* Grid */}
      <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
        {filteredChoferes.map((chofer) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={chofer.id}
            sx={{ display: "flex", alignItems: "stretch" }}
          >
            <Card
              elevation={0}
              sx={{
                background: "white",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                width: 350,
                maxWidth: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 8px 18px rgba(15,23,42,0.10)",
                  transform: "translateY(-3px)",
                  borderColor: "#10b981",
                },
              }}
            >
              <CardContent
                sx={{ p: 2.5, display: "flex", gap: 2, height: "100%" }}
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
                  ></Box>

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
                        {chofer.nombre} {chofer.apellido}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {chofer.dni}
                      </Typography>
                      <Chip
                        label={chofer.activo ? "Activo" : "Inactivo"}
                        size="small"
                        sx={{
                          bgcolor: chofer.activo ? "#10b98115" : "#99999915",
                          color: chofer.activo ? "#10b981" : "#999",
                          fontWeight: 600,
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PhoneAndroidIcon
                        sx={{ fontSize: 16, color: "#10b981" }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {chofer.telefono || "Sin WhatsApp"}
                      </Typography>
                    </Box>
                  </Box>

                  {chofer.vehiculoPatente && (
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        Vehículo
                      </Typography>
                      <Chip
                        label={chofer.vehiculoPatente}
                        size="small"
                        sx={{ bgcolor: "#3b82f615", color: "#3b82f6" }}
                      />
                    </Box>
                  )}

                  {user?.role === "admin" && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {chofer.empresaNombre}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", gap: 1, mt: "auto", pt: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(chofer)}
                      sx={{
                        bgcolor: "#f3f4f6",
                        "&:hover": { bgcolor: "#e5e7eb" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(chofer)}
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

                {/* Derecha: imagen del chofer */}
                <Box
                  sx={{
                    width: 140,
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
                  <PersonIcon sx={{ fontSize: 48, color: "#9ca3af" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredChoferes.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <PersonIcon sx={{ fontSize: 64, color: "#ddd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay choferes registrados
          </Typography>
        </Box>
      )}

      {/* Diálogo */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingChofer ? "Editar Chofer" : "Nuevo Chofer"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 3, pt: 2 }}>
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
                fullWidth
              />
              <TextField
                label="Apellido"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                error={!!errors.apellido}
                helperText={errors.apellido}
                required
                fullWidth
              />
              <TextField
                label="DNI"
                value={formData.dni}
                onChange={(e) =>
                  setFormData({ ...formData, dni: e.target.value })
                }
                error={!!errors.dni}
                helperText={errors.dni}
                required
                fullWidth
              />
              <TextField
                label="Licencia"
                value={formData.licencia}
                onChange={(e) =>
                  setFormData({ ...formData, licencia: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="WhatsApp"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                error={!!errors.whatsapp}
                helperText={errors.whatsapp || "Formato: +54 9 351 234 5678"}
                placeholder="+54 9 11 1234-5678"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroidIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                label="Vehículo"
                value={formData.vehiculoId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehiculoId: parseInt(e.target.value as string),
                  })
                }
                fullWidth
              >
                <MenuItem value={0}>Sin asignar</MenuItem>
                {mockVehiculos.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.patente} - {v.tipo}
                  </MenuItem>
                ))}
              </TextField>
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
              <input
                {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)}
              />
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
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  Arrastrá o clickeá
                  <br />
                  para subir foto
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingChofer ? "Guardar cambios" : "Crear Chofer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar al chofer{" "}
            <strong>
              {deleteChofer?.nombre} {deleteChofer?.apellido}
            </strong>
            ?
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
