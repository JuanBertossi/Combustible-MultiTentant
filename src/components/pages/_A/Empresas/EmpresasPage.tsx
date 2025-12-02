// src/components/pages/_A/Empresas/EmpresasPage.tsx
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
  Chip,
  IconButton,
  LinearProgress,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";

interface Empresa {
  id: number;
  slug: string;
  name: string;
  domain?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  adminEmail?: string;
  activo: boolean;
  createdAt?: string;
}

interface EmpresaFormData {
  slug: string;
  name: string;
  domain: string;
  adminEmail: string;
  primaryColor: string;
  secondaryColor: string;
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// Mock data inicial
const mockEmpresas: Empresa[] = [
  {
    id: 1,
    slug: "empresaA",
    name: "Empresa A - Transportes",
    domain: "empresaA.com",
    adminEmail: "admin@empresaA.com",
    primaryColor: "#1E2C56",
    secondaryColor: "#4A90E2",
    activo: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    slug: "empresaB",
    name: "Empresa B - Logística",
    domain: "empresaB.com",
    adminEmail: "admin@empresaB.com",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    activo: true,
    createdAt: "2024-02-20",
  },
];

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [deleteEmpresa, setDeleteEmpresa] = useState<Empresa | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<EmpresaFormData>({
    slug: "",
    name: "",
    domain: "",
    adminEmail: "",
    primaryColor: "#1E2C56",
    secondaryColor: "#4A90E2",
    activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      // Aquí irá la llamada al servicio
      // const data = await empresaService.getAll();
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEmpresas(mockEmpresas);
    } catch (error) {
      console.error("Error loading empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmpresas = empresas.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.domain && e.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.adminEmail && e.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSearch;
  });

  const handleExport = (): void => {
    const dataToExport = filteredEmpresas.map((e) => ({
      Slug: e.slug,
      Nombre: e.name,
      Dominio: e.domain || "",
      "Email Admin": e.adminEmail || "",
      "Color Primario": e.primaryColor || "",
      "Color Secundario": e.secondaryColor || "",
      Estado: e.activo ? "Activo" : "Inactivo",
      "Fecha Creación": e.createdAt || "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Empresas");
    XLSX.writeFile(wb, `Empresas_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleNew = (): void => {
    setEditingEmpresa(null);
    setFormData({
      slug: "",
      name: "",
      domain: "",
      adminEmail: "",
      primaryColor: "#1E2C56",
      secondaryColor: "#4A90E2",
      activo: true,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (empresa: Empresa): void => {
    setEditingEmpresa(empresa);
    setFormData({
      slug: empresa.slug,
      name: empresa.name,
      domain: empresa.domain || "",
      adminEmail: empresa.adminEmail || "",
      primaryColor: empresa.primaryColor || "#1E2C56",
      secondaryColor: empresa.secondaryColor || "#4A90E2",
      activo: empresa.activo,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.slug.trim()) {
      newErrors.slug = "El slug es obligatorio";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Solo minúsculas, números y guiones";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    if (!formData.domain.trim()) {
      newErrors.domain = "El dominio es obligatorio";
    }
    
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingEmpresa) {
        // Update
        setEmpresas(
          empresas.map((e) =>
            e.id === editingEmpresa.id ? { ...editingEmpresa, ...formData } : e
          )
        );
      } else {
        // Create
        const newEmpresa: Empresa = {
          id: Math.max(...empresas.map((e) => e.id), 0) + 1,
          ...formData,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setEmpresas([...empresas, newEmpresa]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving empresa:", error);
    }
  };

  const handleDeleteClick = (empresa: Empresa): void => {
    setDeleteEmpresa(empresa);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deleteEmpresa) {
      try {
        setEmpresas(empresas.filter((e) => e.id !== deleteEmpresa.id));
      } catch (error) {
        console.error("Error deleting empresa:", error);
      }
    }
    setOpenDeleteDialog(false);
    setDeleteEmpresa(null);
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const copyLoginUrl = (empresa: Empresa): void => {
    const url = `http://${empresa.slug}.localhost:5177/s/login`;
    navigator.clipboard.writeText(url);
    // Aquí podrías mostrar un toast de éxito
    console.log("URL copiada:", url);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Cargando empresas...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
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
              Gestión de Empresas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administra los tenants del sistema • {filteredEmpresas.length}{" "}
              {filteredEmpresas.length === 1 ? "empresa" : "empresas"}
            </Typography>
          </Box>
        </Box>

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
            placeholder="Buscar por nombre, slug, dominio o email..."
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
            disabled={filteredEmpresas.length === 0}
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
            Nueva Empresa
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredEmpresas.map((empresa) => (
          <Grid item xs={12} sm={6} md={4} key={empresa.id}>
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
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: empresa.primaryColor || "#1E2C56",
                      fontSize: 20,
                      fontWeight: 700,
                      mr: 2,
                    }}
                  >
                    {getInitials(empresa.name)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                      {empresa.name}
                    </Typography>
                    <Chip
                      label={empresa.activo ? "Activo" : "Inactivo"}
                      size="small"
                      sx={{
                        bgcolor: empresa.activo ? "#10b98115" : "#99999915",
                        color: empresa.activo ? "#10b981" : "#999",
                        fontWeight: 600,
                        height: 20,
                        fontSize: 11,
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.3 }}
                    >
                      Slug
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {empresa.slug}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.3 }}
                    >
                      Dominio
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {empresa.domain}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.3 }}
                    >
                      Email Admin
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {empresa.adminEmail}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        bgcolor: empresa.primaryColor,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        bgcolor: empresa.secondaryColor,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Colores del tema
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    onClick={() => copyLoginUrl(empresa)}
                    sx={{
                      textTransform: "none",
                      fontSize: 12,
                    }}
                  >
                    Copiar URL
                  </Button>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(empresa)}
                    sx={{
                      bgcolor: "#e5e7eb",
                      color: "#374151",
                      "&:hover": { bgcolor: "#d1d5db" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(empresa)}
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

      {filteredEmpresas.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: "#ddd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay empresas registradas
          </Typography>
        </Box>
      )}

      {/* Dialog Crear/Editar */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEmpresa ? "Editar Empresa" : "Nueva Empresa"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Slug (identificador único)"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value.toLowerCase() })
              }
              error={!!errors.slug}
              helperText={errors.slug || "Ejemplo: empresaA, transportes-sur"}
              required
              disabled={!!editingEmpresa}
              placeholder="empresaA"
              fullWidth
            />

            <TextField
              label="Nombre de la Empresa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              required
              placeholder="Empresa A - Transportes"
              fullWidth
            />

            <TextField
              label="Dominio"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              error={!!errors.domain}
              helperText={errors.domain || "Dominio de la empresa"}
              required
              placeholder="empresaA.com"
              fullWidth
            />

            <TextField
              label="Email del Administrador"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              error={!!errors.adminEmail}
              helperText={errors.adminEmail}
              required
              placeholder="admin@empresaA.com"
              fullWidth
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Color Primario"
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                fullWidth
              />
              <TextField
                label="Color Secundario"
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingEmpresa ? "Guardar Cambios" : "Crear Empresa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Eliminar */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar la empresa <strong>{deleteEmpresa?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer y eliminará todos los datos asociados.
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
