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

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

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
      (e.adminEmail &&
        e.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()));
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
    XLSX.writeFile(
      wb,
      `Empresas_${new Date().toISOString().split("T")[0]}.xlsx`
    );
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

  const handleDeleteClick = (empresa: Empresa): void => {
    setDeleteEmpresa(empresa);
    setOpenDeleteDialog(true);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.slug.trim()) {
      newErrors.slug = "El slug es requerido";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Solo letras minúsculas, números y guiones";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.domain.trim()) {
      newErrors.domain = "El dominio es requerido";
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      if (editingEmpresa) {
        // Actualizar
        setEmpresas(
          empresas.map((e) =>
            e.id === editingEmpresa.id ? { ...e, ...formData } : e
          )
        );
      } else {
        // Crear
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

  const handleDelete = async (): Promise<void> => {
    if (!deleteEmpresa) return;

    try {
      setEmpresas(empresas.filter((e) => e.id !== deleteEmpresa.id));
      setOpenDeleteDialog(false);
      setDeleteEmpresa(null);
    } catch (error) {
      console.error("Error deleting empresa:", error);
    }
  };

  const copyLoginUrl = (empresa: Empresa): void => {
    const url = `${window.location.origin}/login/${empresa.slug}`;
    navigator.clipboard.writeText(url);
    alert(`URL copiada: ${url}`);
  };

  return (
    <Box>
      {/* Header visual */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            px: 2,
            py: 2,
            bgcolor: "#284057",
            borderRadius: 3,
            boxShadow: "0 2px 8px rgba(40,64,87,0.08)",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mb: 0.5, color: "#66FF99" }}
            >
              Gestión de Empresas
            </Typography>
            <Typography variant="body2" sx={{ color: "#F6F7F7" }}>
              Administra los tenants del sistema • {filteredEmpresas.length}{" "}
              {filteredEmpresas.length === 1 ? "empresa" : "empresas"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            sx={{
              bgcolor: "#66FF99",
              color: "#284057",
              fontWeight: 700,
              px: 3,
              py: 1.2,
              fontSize: 16,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(102,255,153,0.12)",
              textTransform: "none",
              "&:hover": { bgcolor: "#196791", color: "#fff" },
            }}
          >
            Nueva Empresa
          </Button>
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
            border: `2px solid #66FF99`,
            boxShadow: "0 2px 8px rgba(102,255,153,0.06)",
          }}
        >
          <TextField
            placeholder="Buscar por nombre, slug, dominio o email..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flexGrow: 1,
              minWidth: 250,
              borderRadius: 2,
              bgcolor: "#F6F7F7",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#284057" }} />
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
              borderColor: "#66FF99",
              color: "#284057",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                borderColor: "#196791",
                bgcolor: "#66FF9910",
                color: "#196791",
              },
            }}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredEmpresas.map((empresa) => (
          <Grid item xs={12} sm={6} md={4} key={empresa.id}>
            <Card
              elevation={0}
              sx={{
                border: `2px solid #66FF99`,
                borderRadius: 3,
                height: "100%",
                transition: "all 0.3s",
                boxShadow: "0 2px 8px rgba(40,64,87,0.06)",
                "&:hover": {
                  boxShadow: "0 6px 18px rgba(40,64,87,0.12)",
                  transform: "translateY(-2px)",
                  borderColor: "#196791",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: empresa.primaryColor || "#284057",
                      fontSize: 24,
                      fontWeight: 700,
                      mr: 2,
                      border: `2px solid #66FF99`,
                    }}
                  >
                    {getInitials(empresa.name)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{ mb: 0.5, color: "#284057" }}
                    >
                      {empresa.name}
                    </Typography>
                    <Chip
                      label={empresa.activo ? "Activo" : "Inactivo"}
                      size="small"
                      sx={{
                        bgcolor: empresa.activo ? "#66FF9915" : "#99999915",
                        color: empresa.activo ? "#284057" : "#999",
                        fontWeight: 700,
                        height: 22,
                        fontSize: 12,
                        borderRadius: 1,
                        border: empresa.activo
                          ? `1.5px solid #66FF99`
                          : undefined,
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mb: 0.3, color: "#284057" }}
                    >
                      Slug
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      sx={{ color: "#196791" }}
                    >
                      {empresa.slug}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mb: 0.3, color: "#284057" }}
                    >
                      Dominio
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      sx={{ color: "#196791" }}
                    >
                      {empresa.domain}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mb: 0.3, color: "#284057" }}
                    >
                      Email Admin
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      sx={{ wordBreak: "break-word", color: "#196791" }}
                    >
                      {empresa.adminEmail}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 2,
                        bgcolor: empresa.primaryColor,
                        border: `2px solid #66FF99`,
                      }}
                    />
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 2,
                        bgcolor: empresa.secondaryColor,
                        border: `2px solid #66FF99`,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "#284057" }}>
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
                      fontSize: 13,
                      borderColor: "#66FF99",
                      color: "#284057",
                      fontWeight: 700,
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "#196791",
                        bgcolor: "#66FF9910",
                        color: "#196791",
                      },
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
                      bgcolor: "#66FF99",
                      color: "#284057",
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#196791", color: "#fff" },
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
                      borderRadius: 2,
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
          <BusinessIcon sx={{ fontSize: 64, color: "#284057", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#284057" }}>
            No hay empresas registradas
          </Typography>
        </Box>
      )}

      {/* Dialog Crear/Editar */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#284057", fontWeight: 700 }}>
          {editingEmpresa ? "Editar Empresa" : "Nueva Empresa"}
        </DialogTitle>
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
              sx={{ borderRadius: 2, bgcolor: "#F6F7F7" }}
            />

            <TextField
              label="Nombre de la Empresa"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
              required
              placeholder="Empresa A - Transportes"
              fullWidth
              sx={{ borderRadius: 2, bgcolor: "#F6F7F7" }}
            />

            <TextField
              label="Dominio"
              value={formData.domain}
              onChange={(e) =>
                setFormData({ ...formData, domain: e.target.value })
              }
              error={!!errors.domain}
              helperText={errors.domain || "Dominio de la empresa"}
              required
              placeholder="empresaA.com"
              fullWidth
              sx={{ borderRadius: 2, bgcolor: "#F6F7F7" }}
            />

            <TextField
              label="Email del Administrador"
              type="email"
              value={formData.adminEmail}
              onChange={(e) =>
                setFormData({ ...formData, adminEmail: e.target.value })
              }
              error={!!errors.adminEmail}
              helperText={errors.adminEmail}
              required
              placeholder="admin@empresaA.com"
              fullWidth
              sx={{ borderRadius: 2, bgcolor: "#F6F7F7" }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Color Primario"
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                fullWidth
                sx={{ borderRadius: 2, bgcolor: "#F6F7F7" }}
              />
              <TextField
                label="Color Secundario"
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                fullWidth
                sx={{ borderRadius: 2, bgcolor: "#F6F7F7" }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: "#284057", fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#66FF99",
              color: "#284057",
              fontWeight: 700,
              borderRadius: 2,
              "&:hover": { bgcolor: "#196791", color: "#fff" },
            }}
          >
            {editingEmpresa ? "Guardar Cambios" : "Crear Empresa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Eliminar */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle sx={{ color: "#dc2626", fontWeight: 700 }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar la empresa{" "}
            <strong>{deleteEmpresa?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer y eliminará todos los datos
            asociados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: "#284057", fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
