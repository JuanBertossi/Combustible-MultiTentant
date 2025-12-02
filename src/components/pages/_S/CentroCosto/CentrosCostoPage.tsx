// components/pages/_S/CentroCosto/CentroCostoPage.tsx
import { useState } from "react";
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
  Avatar,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useAuth } from "@/components/providers/auth/auth-provider";
import { useTenantContext } from "@/components/providers/tenants/use-tenant";
import * as XLSX from "xlsx";

type TipoCentroCosto = "Lote" | "Obra" | "Area" | "Proyecto" | "Otro";

interface CentroCosto {
  id: number;
  codigo: string;
  nombre: string;
  tipo: TipoCentroCosto;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
}

interface FormErrors {
  [key: string]: string;
}

const TIPOS_CENTRO_COSTO: TipoCentroCosto[] = [
  "Lote",
  "Obra",
  "Area",
  "Proyecto",
  "Otro",
];

interface FormData {
  codigo: string;
  nombre: string;
  tipo: TipoCentroCosto;
  activo: boolean;
}

// Mock data temporal
const mockCentrosCosto: CentroCosto[] = [
  {
    id: 1,
    codigo: "LOTE-001",
    nombre: "Lote Norte",
    tipo: "Lote",
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
  {
    id: 2,
    codigo: "OBRA-001",
    nombre: "Construcción Edificio Centro",
    tipo: "Obra",
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
];

export default function CentroCostoPage() {
  const { user } = useAuth();
  const { id: tenantId, name: tenantName } = useTenantContext();
  const [items, setItems] = useState<CentroCosto[]>(mockCentrosCosto);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CentroCosto | null>(null);
  const [deleteItem, setDeleteItem] = useState<CentroCosto | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    codigo: "",
    nombre: "",
    tipo: "Lote",
    activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const itemsPorEmpresa =
    user?.role === "superadmin"
      ? items
      : items.filter((i) => i.empresaId === tenantId);

  const filteredItems = itemsPorEmpresa.filter((item) => {
    return (
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleExport = (): void => {
    const dataToExport = filteredItems.map((item) => ({
      Código: item.codigo,
      Nombre: item.nombre,
      Tipo: item.tipo,
      Estado: item.activo ? "Activo" : "Inactivo",
      ...(user?.role === "superadmin" && { Empresa: item.empresaNombre }),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CentrosCosto");
    XLSX.writeFile(
      wb,
      `CentrosCosto_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleNew = (): void => {
    setEditingItem(null);
    setFormData({
      codigo: "",
      nombre: "",
      tipo: "Lote",
      activo: true,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (item: CentroCosto): void => {
    setEditingItem(item);
    setFormData({
      codigo: item.codigo,
      nombre: item.nombre,
      tipo: item.tipo,
      activo: item.activo,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = "El código es obligatorio";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.tipo) newErrors.tipo = "El tipo es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (): void => {
    if (!validate()) return;

    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? {
                ...editingItem,
                ...formData,
              }
            : item
        )
      );
    } else {
      const newItem: CentroCosto = {
        id: Math.max(...items.map((i) => i.id), 0) + 1,
        ...formData,
        empresaId: tenantId || 0,
        empresaNombre: tenantName,
      };
      setItems([...items, newItem]);
    }

    setOpenDialog(false);
  };

  const handleDeleteClick = (item: CentroCosto): void => {
    setDeleteItem(item);
    setOpenDeleteDialog(true);
  };

  const handleDelete = (): void => {
    if (deleteItem) {
      setItems(items.filter((item) => item.id !== deleteItem.id));
    }
    setOpenDeleteDialog(false);
    setDeleteItem(null);
  };

  const getAvatarColor = (tipo: TipoCentroCosto): string => {
    const colors: Record<TipoCentroCosto, string> = {
      Lote: "#10b981",
      Obra: "#3b82f6",
      Area: "#f59e0b",
      Proyecto: "#8b5cf6",
      Otro: "#64748b",
    };
    return colors[tipo] || colors.Otro;
  };

  return (
    <Box>
      {/* Header */}
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
              Centros de Costo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de lotes, obras, áreas o proyectos •{" "}
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "ítem" : "ítems"}
            </Typography>
          </Box>
        </Box>

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
            placeholder="Buscar por código o nombre..."
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
            disabled={filteredItems.length === 0}
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
            Nuevo Centro de Costo
          </Button>
        </Box>
      </Box>

      {/* Grid de Items */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
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
                {/* Avatar y estado */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: getAvatarColor(item.tipo),
                      fontSize: 20,
                      fontWeight: 700,
                      mr: 2,
                    }}
                  >
                    <AccountTreeIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                      {item.codigo}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Chip
                        label={item.tipo}
                        size="small"
                        sx={{
                          bgcolor: `${getAvatarColor(item.tipo)}15`,
                          color: getAvatarColor(item.tipo),
                          fontWeight: 600,
                          height: 20,
                          fontSize: 11,
                        }}
                      />
                      <Chip
                        label={item.activo ? "Activo" : "Inactivo"}
                        size="small"
                        sx={{
                          bgcolor: item.activo ? "#10b98115" : "#99999915",
                          color: item.activo ? "#10b981" : "#999",
                          fontWeight: 600,
                          height: 20,
                          fontSize: 11,
                        }}
                      />
                    </Box>
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
                      Nombre
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {item.nombre}
                    </Typography>
                  </Box>
                </Box>

                {user?.role === "superadmin" && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 2 }}
                  >
                    Empresa: {item.empresaNombre || "N/A"}
                  </Typography>
                )}

                {/* Acciones */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(item)}
                    sx={{
                      bgcolor: "#f3f4f6",
                      "&:hover": { bgcolor: "#e5e7eb" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(item)}
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

      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <AccountTreeIcon sx={{ fontSize: 64, color: "#ddd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay centros de costo registrados
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
          {editingItem ? "Editar Centro de Costo" : "Nuevo Centro de Costo"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              fullWidth
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
            />

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
              select
              label="Tipo"
              value={formData.tipo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipo: e.target.value as TipoCentroCosto,
                })
              }
              error={!!errors.tipo}
              helperText={errors.tipo}
              required
            >
              {TIPOS_CENTRO_COSTO.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                />
              }
              label="Activo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingItem ? "Guardar Cambios" : "Crear"}
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
            ¿Estás seguro de eliminar el centro de costo{" "}
            <strong>
              {deleteItem?.codigo} - {deleteItem?.nombre}
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
