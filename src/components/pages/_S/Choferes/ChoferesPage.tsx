// components/pages/_S/Choferes/ChoferesPage.tsx
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
  Alert,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useAuth } from "@/components/providers/auth/auth-provider";
import { useTenantContext } from "@/components/providers/tenants/use-tenant";
import * as XLSX from "xlsx";

interface Chofer {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  licencia?: string;
  telefono?: string;
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
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// Mock data temporal
const mockChoferes: Chofer[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    licencia: "B1234567",
    telefono: "+5493512345678",
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
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
];

export default function ChoferesPage() {
  const { user } = useAuth();
  const { id: tenantId, name: tenantName } = useTenantContext();
  const [choferes, setChoferes] = useState<Chofer[]>(mockChoferes);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingChofer, setEditingChofer] = useState<Chofer | null>(null);
  const [deleteChofer, setDeleteChofer] = useState<Chofer | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<ChoferFormData>({
    nombre: "",
    apellido: "",
    dni: "",
    licencia: "",
    whatsapp: "",
    activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadChoferes();
  }, []);

  const loadChoferes = async () => {
    setLoading(true);
    try {
      // Aquí irá la llamada al servicio
      // const data = await choferService.getAll();
      // setChoferes(data);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error loading choferes:", error);
    } finally {
      setLoading(false);
    }
  };

  const choferesPorEmpresa = choferes.filter((c) => c.empresaId === tenantId);

  const filteredChoferes = choferesPorEmpresa.filter((c) => {
    return (
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dni.includes(searchTerm)
    );
  });

  const handleExport = (): void => {
    const dataToExport = filteredChoferes.map((c) => ({
      Nombre: c.nombre,
      Apellido: c.apellido,
      DNI: c.dni,
      WhatsApp: c.telefono || "",
      Estado: c.activo ? "Activo" : "Inactivo",
      ...(user?.role === "superadmin" && { Empresa: c.empresaNombre }),
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
      activo: true,
    });
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
      activo: chofer.activo,
    });
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
      newErrors.dni = "DNI inválido";
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
          activo: formData.activo,
          empresaId: tenantId || 0,
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
      try {
        setChoferes(choferes.filter((c) => c.id !== deleteChofer.id));
      } catch (error) {
        console.error("Error deleting chofer:", error);
      }
    }
    setOpenDeleteDialog(false);
    setDeleteChofer(null);
  };

  const getInitials = (nombre: string, apellido: string): string => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (nombre: string): string => {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
    ];
    const index = nombre.charCodeAt(0) % colors.length;
    return colors[index] ?? "#999";
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              Choferes y Operadores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Whitelist de WhatsApp para envío de eventos •{" "}
              {filteredChoferes.length}{" "}
              {filteredChoferes.length === 1 ? "chofer" : "choferes"}
            </Typography>
          </Box>
        </Box>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Whitelist de WhatsApp:</strong> Solo los choferes registrados
          aquí con número de WhatsApp podrán enviar eventos de combustible desde
          la aplicación móvil. Estos usuarios NO tienen acceso al frontoffice
          web.
        </Alert>

        {/* Filtros */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            bgcolor: "white",
            p: 2.5,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <TextField
            placeholder="Buscar por nombre, apellido o DNI..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredChoferes.length === 0}
            sx={{
              borderColor: "#10b981",
              color: "#10b981",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#059669",
                bgcolor: "#10b98110",
              },
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
              "&:hover": { bgcolor: "#16213E" },
            }}
          >
            Nuevo Chofer
          </Button>
        </Box>
      </Box>

      {/* Grid de choferes */}
      <Grid container spacing={3}>
        {filteredChoferes.map((chofer) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={chofer.id}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                height: "100%",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* Avatar */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: getAvatarColor(chofer.nombre),
                      fontSize: 20,
                      fontWeight: 700,
                      mr: 2,
                    }}
                  >
                    {getInitials(chofer.nombre, chofer.apellido)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                      {chofer.nombre} {chofer.apellido}
                    </Typography>
                    <Chip
                      label={chofer.activo ? "Activo" : "Inactivo"}
                      size="small"
                      sx={{
                        bgcolor: chofer.activo ? "#10b98115" : "#99999915",
                        color: chofer.activo ? "#10b981" : "#999",
                        fontWeight: 600,
                        height: 20,
                        fontSize: 11,
                      }}
                    />
                  </Box>
                </Box>

                {/* Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.3 }}
                    >
                      DNI
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {chofer.dni}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.3 }}
                    >
                      WhatsApp
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PhoneAndroidIcon
                        sx={{ fontSize: 16, color: "#10b981" }}
                      />
                      <Typography variant="body2" fontWeight="600">
                        {chofer.telefono || "Sin WhatsApp"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {user?.role === "superadmin" && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 2 }}
                  >
                    Empresa: {chofer.empresaNombre}
                  </Typography>
                )}

                {/* Acciones */}
                <Box sx={{ display: "flex", gap: 1 }}>
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

      {/* Dialogs */}
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
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
              error={!!errors.licencia}
              helperText={errors.licencia}
              fullWidth
            />
            <TextField
              label="WhatsApp (obligatorio para whitelist)"
              value={formData.whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
              error={!!errors.whatsapp}
              helperText={
                errors.whatsapp ||
                "Formato: +54 9 351 234 5678 - Obligatorio para enviar eventos"
              }
              placeholder="+54 9 11 1234-5678"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingChofer ? "Guardar Cambios" : "Crear Chofer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar al chofer {deleteChofer?.nombre}{" "}
            {deleteChofer?.apellido}?
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
