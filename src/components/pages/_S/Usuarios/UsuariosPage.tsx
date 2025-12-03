// components/pages/_S/Usuarios/UsuariosPage.tsx
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
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useTenantAuth } from "@/components/providers/auth/_S/TenantAuthProvider";
import { useTenantContext } from "@/components/providers/tenants/use-tenant";
import * as XLSX from "xlsx";

type UserRole = "superadmin" | "admin" | "supervisor" | "operator" | "auditor";

interface Usuario {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  whatsapp?: string;
  rol: UserRole;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
}

interface UsuarioFormData {
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
  rol: UserRole;
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ROLES: UserRole[] = ["admin", "supervisor", "operator", "auditor"];

// Helpers
const getInitials = (nombre: string, apellido?: string): string => {
  const first = nombre?.charAt(0) ?? "";
  const second = apellido?.charAt(0) ?? "";
  return (first + second).toUpperCase();
};

const getAvatarColor = (name: string): string => {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] ?? "#999";
};

const getRolColor = (rol: UserRole): { bg: string; color: string } => {
  const colors: Record<UserRole, { bg: string; color: string }> = {
    superadmin: { bg: "#dc262615", color: "#dc2626" },
    admin: { bg: "#ef444415", color: "#ef4444" },
    supervisor: { bg: "#f59e0b15", color: "#f59e0b" },
    operator: { bg: "#3b82f615", color: "#3b82f6" },
    auditor: { bg: "#10b98115", color: "#10b981" },
  };
  return colors[rol] || { bg: "#99999915", color: "#999" };
};

const getRolLabel = (rol: UserRole): string => {
  const labels: Record<UserRole, string> = {
    superadmin: "Super Admin",
    admin: "Admin",
    supervisor: "Supervisor",
    operator: "Operador",
    auditor: "Auditor",
  };
  return labels[rol] || rol;
};

// Mock data
const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@empresa.com",
    whatsapp: "+5493512345678",
    rol: "admin",
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@empresa.com",
    whatsapp: "+5493519876543",
    rol: "supervisor",
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
];

export default function UsuariosPage() {
  const { user } = useTenantAuth();
  const { name: tenantName } = useTenantContext(); // no usamos id para no romper
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [deleteUsuario, setDeleteUsuario] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRol, setFilterRol] = useState<string>("Todos");
  const [formData, setFormData] = useState<UsuarioFormData>({
    nombre: "",
    apellido: "",
    email: "",
    whatsapp: "",
    rol: "operator",
    activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsuarios(mockUsuarios);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Mientras mockeás, no filtres por tenantId
  const usuariosPorEmpresa = usuarios;
  const filteredUsuarios = usuariosPorEmpresa.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      u.nombre.toLowerCase().includes(term) ||
      (u.apellido && u.apellido.toLowerCase().includes(term)) ||
      u.email.toLowerCase().includes(term);
    const matchRol = filterRol === "Todos" || u.rol === filterRol;
    return matchSearch && matchRol;
  });

  const handleExport = (): void => {
    const dataToExport = filteredUsuarios.map((u) => ({
      Nombre: u.nombre,
      Apellido: u.apellido || "",
      Email: u.email,
      WhatsApp: u.whatsapp || "Sin WhatsApp",
      Rol: getRolLabel(u.rol),
      Estado: u.activo ? "Activo" : "Inactivo",
      ...(user?.role === "superadmin" && { Empresa: u.empresaNombre }),
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(
      wb,
      `Usuarios_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleNew = (): void => {
    setEditingUsuario(null);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      whatsapp: "",
      rol: "operator",
      activo: true,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (usuario: Usuario): void => {
    setEditingUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido || "",
      email: usuario.email,
      whatsapp: usuario.whatsapp || "",
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido.trim())
      newErrors.apellido = "El apellido es obligatorio";
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (
      formData.whatsapp &&
      !/^\+?\d{10,15}$/.test(formData.whatsapp.replace(/\s/g, ""))
    ) {
      newErrors.whatsapp = "Formato inválido (ej: +5493512345678)";
    }
    if (!formData.rol) newErrors.rol = "El rol es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (): Promise<void> => {
    if (!validate()) return;

    try {
      if (editingUsuario) {
        setUsuarios(
          usuarios.map((u) =>
            u.id === editingUsuario.id ? { ...editingUsuario, ...formData } : u
          )
        );
      } else {
        const newUsuario: Usuario = {
          id: Math.max(...usuarios.map((u) => u.id), 0) + 1,
          ...formData,
          empresaId: 1,
          empresaNombre: tenantName,
        };
        setUsuarios([...usuarios, newUsuario]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving usuario:", error);
    }
  };

  const handleDeleteClick = (usuario: Usuario): void => {
    setDeleteUsuario(usuario);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (deleteUsuario) {
      setUsuarios(usuarios.filter((u) => u.id !== deleteUsuario.id));
    }
    setOpenDeleteDialog(false);
    setDeleteUsuario(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <LinearProgress sx={{ width: "50%" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: -3,
          mb: 1.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
          }}
        >
          Gestión de accesos • {filteredUsuarios.length}{" "}
          {filteredUsuarios.length === 1 ? "usuario" : "usuarios"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              disabled={filteredUsuarios.length === 0}
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
              Nuevo usuario
            </Button>
          </Box>
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
          placeholder="Buscar por nombre, apellido o email..."
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
          label="Rol"
          value={filterRol}
          onChange={(e) => setFilterRol(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="Todos">Todos los roles</MenuItem>
          {ROLES.map((rol) => (
            <MenuItem key={rol} value={rol}>
              {getRolLabel(rol)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Grid usuarios */}
      <Grid container spacing={3}>
        {filteredUsuarios.map((usuario) => (
          <Grid item component="div" xs={12} sm={6} md={4} key={usuario.id}>
            <Card
              elevation={0}
              sx={{
                background: "white",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                height: "100%",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 8px 18px rgba(15,23,42,0.10)",
                  transform: "translateY(-3px)",
                  borderColor: "#cbd5f5",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header usuario */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2.5,
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: getAvatarColor(usuario.nombre),
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(usuario.nombre, usuario.apellido)}
                  </Avatar>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {usuario.nombre} {usuario.apellido || ""}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                      <Chip
                        label={getRolLabel(usuario.rol)}
                        size="small"
                        sx={{
                          bgcolor: getRolColor(usuario.rol).bg,
                          color: getRolColor(usuario.rol).color,
                          fontWeight: 600,
                          height: 22,
                          fontSize: 11,
                        }}
                      />
                      <Chip
                        label={usuario.activo ? "Activo" : "Inactivo"}
                        size="small"
                        sx={{
                          bgcolor: usuario.activo ? "#10b98115" : "#e5e7eb",
                          color: usuario.activo ? "#10b981" : "#6b7280",
                          fontWeight: 600,
                          height: 22,
                          fontSize: 11,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Acciones separadas visualmente */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      ml: 0.5,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(usuario)}
                      sx={{
                        bgcolor: "#eef2ff",
                        color: "#1d4ed8",
                        "&:hover": { bgcolor: "#e0e7ff" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(usuario)}
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

                {/* Detalles con más separación */}
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.3 }}
                    >
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ wordBreak: "break-word" }}
                    >
                      {usuario.email}
                    </Typography>
                  </Box>

                  {usuario.whatsapp && (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.3 }}
                      >
                        WhatsApp
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <PhoneAndroidIcon
                          sx={{ fontSize: 18, color: "#10b981" }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {usuario.whatsapp}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {user?.role === "superadmin" && (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.3 }}
                      >
                        Empresa
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {usuario.empresaNombre || "N/A"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filteredUsuarios.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
            <PersonIcon sx={{ fontSize: 64, color: "#e5e7eb", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay usuarios registrados
            </Typography>
          </Box>
        )}
      </Grid>

      {/* Dialog crear / editar */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />
            <TextField
              fullWidth
              label="Apellido"
              value={formData.apellido}
              onChange={(e) =>
                setFormData({ ...formData, apellido: e.target.value })
              }
              error={!!errors.apellido}
              helperText={errors.apellido}
              required
            />
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <TextField
              fullWidth
              label="Número WhatsApp (opcional)"
              placeholder="+5493512345678"
              value={formData.whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
              error={!!errors.whatsapp}
              helperText={
                errors.whatsapp || "Formato: +54 9 351 234 5678 (opcional)"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon sx={{ color: "#999" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              select
              label="Rol"
              value={formData.rol}
              onChange={(e) =>
                setFormData({ ...formData, rol: e.target.value as UserRole })
              }
              error={!!errors.rol}
              helperText={errors.rol}
              required
            >
              {ROLES.map((rol) => (
                <MenuItem key={rol} value={rol}>
                  {getRolLabel(rol)}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2">Activo</Typography>
              <Button
                variant={formData.activo ? "contained" : "outlined"}
                onClick={() =>
                  setFormData({ ...formData, activo: !formData.activo })
                }
              >
                {formData.activo ? "Sí" : "No"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingUsuario ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog eliminar */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar al usuario{" "}
            <strong>
              {deleteUsuario?.nombre} {deleteUsuario?.apellido || ""}
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
