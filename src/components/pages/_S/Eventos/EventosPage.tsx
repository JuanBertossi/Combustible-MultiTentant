// components/pages/_S/Eventos/EventosPage.tsx
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import { useAuth } from "@/components/providers/auth/auth-provider";
import { useTenantContext } from "@/components/providers/tenants/use-tenant";

// Tipos
interface EventoExtended {
  id: number;
  vehiculoId: number;
  vehiculoPatente: string;
  choferId: number;
  choferNombre: string;
  surtidorId: number;
  surtidorNombre: string;
  litros: number;
  precio: number;
  total: number;
  fecha: string;
  estado: "Pendiente" | "Validado" | "Rechazado";
  observaciones?: string;
  ubicacion?: string;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
}

interface EventoFormData {
  vehiculoId: number | "";
  choferId: number | "";
  surtidorId: number | "";
  litros: number | "";
  precio: number | "";
  total: number | "";
  fecha: string;
  estado: "Pendiente" | "Validado" | "Rechazado";
  observaciones: string;
  evidencias?: File[];
  ubicacion?: string;
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// Mock data temporal
const mockEventos: EventoExtended[] = [
  {
    id: 1,
    vehiculoId: 1,
    vehiculoPatente: "ABC123",
    choferId: 1,
    choferNombre: "Juan Pérez",
    surtidorId: 1,
    surtidorNombre: "Surtidor 1",
    litros: 50,
    precio: 850,
    total: 42500,
    fecha: "2024-01-15",
    estado: "Validado",
    observaciones: "Carga completa",
    ubicacion: "Córdoba Capital",
    activo: true,
    empresaId: 1,
    empresaNombre: "Empresa A",
  },
];

const mockVehiculos = [
  { id: 1, patente: "ABC123", marca: "Ford", modelo: "Ranger" },
  { id: 2, patente: "XYZ789", marca: "Toyota", modelo: "Hilux" },
];

const mockChoferes = [
  { id: 1, nombre: "Juan", apellido: "Pérez" },
  { id: 2, nombre: "María", apellido: "González" },
];

const mockSurtidores = [
  { id: 1, nombre: "Surtidor 1", ubicacion: "Zona Norte" },
  { id: 2, nombre: "Surtidor 2", ubicacion: "Zona Sur" },
];

export default function EventosPage() {
  const { user } = useAuth();
  const { id: tenantId } = useTenantContext();
  const [eventos, setEventos] = useState<EventoExtended[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingEvento, setEditingEvento] = useState<EventoExtended | null>(null);
  const [deleteEvento, setDeleteEvento] = useState<EventoExtended | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<EventoFormData>({
    vehiculoId: "",
    choferId: "",
    surtidorId: "",
    litros: "",
    precio: "",
    total: "",
    fecha: "",
    estado: "Pendiente",
    observaciones: "",
    evidencias: [],
    ubicacion: "",
    activo: true,
  });
  const [errors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchData = async () => {
      // Aquí irá la llamada al servicio
      setEventos(mockEventos);
    };
    fetchData();
  }, []);

  const eventosPorEmpresa = eventos.filter((e) => e.empresaId === tenantId);

  const filteredEventos = eventosPorEmpresa.filter((e) => {
    const vehiculoPatente = e.vehiculoPatente?.toLowerCase() || "";
    const choferNombre = e.choferNombre?.toLowerCase() || "";
    const observaciones = e.observaciones?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return (
      vehiculoPatente.includes(term) ||
      choferNombre.includes(term) ||
      observaciones.includes(term)
    );
  });

  const handleNew = () => {
    setEditingEvento(null);
    setFormData({
      vehiculoId: "",
      choferId: "",
      surtidorId: "",
      litros: "",
      precio: "",
      total: "",
      fecha: "",
      estado: "Pendiente",
      observaciones: "",
      evidencias: [],
      ubicacion: "",
      activo: true,
    });
    setOpenDialog(true);
  };

  const handleEdit = (evento: EventoExtended) => {
    setEditingEvento(evento);
    setFormData({
      vehiculoId: evento.vehiculoId,
      choferId: evento.choferId,
      surtidorId: evento.surtidorId,
      litros: evento.litros,
      precio: evento.precio,
      total: evento.total,
      fecha: evento.fecha,
      estado: evento.estado,
      observaciones: evento.observaciones || "",
      ubicacion: evento.ubicacion || "",
      activo: evento.activo,
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (evento: EventoExtended) => {
    setDeleteEvento(evento);
    setOpenDeleteDialog(true);
  };

  const handleSave = () => {
    if (editingEvento) {
      setEventos(
        eventos.map((e) =>
          e.id === editingEvento.id
            ? { ...editingEvento, ...formData }
            : e
        )
      );
    } else {
      const newEvento: EventoExtended = {
        id: Math.max(...eventos.map((e) => e.id), 0) + 1,
        vehiculoId: formData.vehiculoId as number,
        vehiculoPatente: mockVehiculos.find((v) => v.id === formData.vehiculoId)?.patente || "",
        choferId: formData.choferId as number,
        choferNombre: mockChoferes.find((c) => c.id === formData.choferId)
          ? `${mockChoferes.find((c) => c.id === formData.choferId)?.nombre} ${mockChoferes.find((c) => c.id === formData.choferId)?.apellido}`
          : "",
        surtidorId: formData.surtidorId as number,
        surtidorNombre: mockSurtidores.find((s) => s.id === formData.surtidorId)?.nombre || "",
        litros: formData.litros as number,
        precio: formData.precio as number,
        total: formData.total as number,
        fecha: formData.fecha,
        estado: formData.estado,
        observaciones: formData.observaciones,
        ubicacion: formData.ubicacion,
        activo: formData.activo,
        empresaId: tenantId || 0,
      };
      setEventos([...eventos, newEvento]);
    }
    setOpenDialog(false);
    setEditingEvento(null);
  };

  const handleDelete = () => {
    if (deleteEvento) {
      setEventos(eventos.filter((e) => e.id !== deleteEvento.id));
    }
    setOpenDeleteDialog(false);
    setDeleteEvento(null);
  };

  const handleExport = (): void => {
    const ws = XLSX.utils.json_to_sheet(filteredEventos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Eventos");
    XLSX.writeFile(
      wb,
      `Eventos_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      Validado: "success",
      Pendiente: "info",
      Rechazado: "error",
    };
    return colors[estado as keyof typeof colors] || "default";
  };

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
              Eventos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de eventos • {filteredEventos.length}{" "}
              {filteredEventos.length === 1 ? "evento" : "eventos"}
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
            placeholder="Buscar por vehículo, chofer u observaciones..."
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
            disabled={filteredEventos.length === 0}
            sx={{
              borderColor: "#10b981",
              color: "#10b981",
              fontWeight: 600,
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
              "&:hover": { bgcolor: "#16213E" },
            }}
          >
            Nuevo Evento
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ border: "1px solid #e0e0e0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              <TableCell>Vehículo</TableCell>
              <TableCell>Chofer</TableCell>
              <TableCell>Surtidor</TableCell>
              <TableCell align="right">Litros</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              {user?.role === "superadmin" && <TableCell>Empresa</TableCell>}
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEventos.map((evento) => (
              <TableRow key={evento.id} hover>
                <TableCell>{evento.vehiculoPatente}</TableCell>
                <TableCell>{evento.choferNombre}</TableCell>
                <TableCell>{evento.surtidorNombre}</TableCell>
                <TableCell align="right">{evento.litros}</TableCell>
                <TableCell align="right">${evento.precio}</TableCell>
                <TableCell align="right">${evento.total}</TableCell>
                <TableCell>{evento.fecha}</TableCell>
                <TableCell>
                  <Chip
                    label={evento.estado}
                    size="small"
                    color={getEstadoColor(evento.estado) as any}
                  />
                </TableCell>
                {user?.role === "superadmin" && (
                  <TableCell>{evento.empresaNombre}</TableCell>
                )}
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleEdit(evento)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(evento)}
                    sx={{ color: "#dc2626" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredEventos.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No hay eventos registrados
          </Typography>
        </Box>
      )}

      {/* Dialog Create/Edit - continuará en el siguiente mensaje por límite de caracteres */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingEvento ? "Editar Evento" : "Nuevo Evento"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              select
              label="Vehículo"
              value={formData.vehiculoId}
              onChange={(e) =>
                setFormData({ ...formData, vehiculoId: Number(e.target.value) })
              }
              error={!!errors.vehiculoId}
              helperText={errors.vehiculoId}
              required
              fullWidth
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {mockVehiculos.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.patente} - {v.marca} {v.modelo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Chofer"
              value={formData.choferId}
              onChange={(e) =>
                setFormData({ ...formData, choferId: Number(e.target.value) })
              }
              error={!!errors.choferId}
              helperText={errors.choferId}
              required
              fullWidth
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {mockChoferes.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre} {c.apellido}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Surtidor"
              value={formData.surtidorId}
              onChange={(e) =>
                setFormData({ ...formData, surtidorId: Number(e.target.value) })
              }
              error={!!errors.surtidorId}
              helperText={errors.surtidorId}
              required
              fullWidth
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {mockSurtidores.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre} ({s.ubicacion})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Litros"
              type="number"
              value={formData.litros}
              onChange={(e) =>
                setFormData({ ...formData, litros: Number(e.target.value) })
              }
              error={!!errors.litros}
              helperText={errors.litros}
              required
              fullWidth
            />

            <TextField
              label="Precio Unitario"
              type="number"
              value={formData.precio}
              onChange={(e) =>
                setFormData({ ...formData, precio: Number(e.target.value) })
              }
              fullWidth
            />

            <TextField
              label="Total"
              type="number"
              value={formData.total}
              onChange={(e) =>
                setFormData({ ...formData, total: Number(e.target.value) })
              }
              fullWidth
            />

            <TextField
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
              error={!!errors.fecha}
              helperText={errors.fecha}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              select
              label="Estado"
              value={formData.estado}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estado: e.target.value as "Pendiente" | "Validado" | "Rechazado",
                })
              }
              fullWidth
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Validado">Validado</MenuItem>
              <MenuItem value="Rechazado">Rechazado</MenuItem>
            </TextField>

            <TextField
              label="Observaciones"
              value={formData.observaciones}
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingEvento ? "Guardar Cambios" : "Crear Evento"}
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
            ¿Estás seguro de eliminar el evento del vehículo{" "}
            <strong>{deleteEvento?.vehiculoPatente}</strong>?
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
