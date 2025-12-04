import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WarningIcon from "@mui/icons-material/Warning";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RemoveIcon from "@mui/icons-material/Remove";
import * as XLSX from "xlsx";

type TipoReporte =
  | "consumo-vehiculos"
  | "litros-surtidor"
  | "litros-operador"
  | "costo-centro"
  | "desvios"
  | "ranking-eficiencia";

const COLORS = ["#1E2C56", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Mock data
const mockConsumoVehiculos = [
  {
    vehiculoId: 1,
    vehiculoPatente: "ABC123",
    vehiculoTipo: "Camión",
    litrosTotales: 1500,
    costoTotal: 1275000,
    numeroEventos: 25,
    eficienciaKmPorLitro: 8.5,
    eficienciaLitrosPorHora: undefined,
  },
  {
    vehiculoId: 2,
    vehiculoPatente: "XYZ789",
    vehiculoTipo: "Pickup",
    litrosTotales: 800,
    costoTotal: 680000,
    numeroEventos: 15,
    eficienciaKmPorLitro: 12.3,
    eficienciaLitrosPorHora: undefined,
  },
  {
    vehiculoId: 3,
    vehiculoPatente: "AAA111",
    vehiculoTipo: "Tractor",
    litrosTotales: 1200,
    costoTotal: 1020000,
    numeroEventos: 20,
    eficienciaKmPorLitro: 6.8,
    eficienciaLitrosPorHora: undefined,
  },
];

const mockLitrosPorSurtidor = [
  { surtidorId: 1, surtidorNombre: "Surtidor Norte", litrosTotales: 3500, costoTotal: 2975000, numeroEventos: 45 },
  { surtidorId: 2, surtidorNombre: "Surtidor Sur", litrosTotales: 2800, costoTotal: 2380000, numeroEventos: 38 },
  { surtidorId: 3, surtidorNombre: "Surtidor Este", litrosTotales: 1900, costoTotal: 1615000, numeroEventos: 28 },
];

const mockLitrosPorOperador = [
  { choferId: 1, choferNombre: "Juan", choferApellido: "Pérez", litrosTotales: 1200, numeroEventos: 20, vehiculosMasUsados: ["ABC123"] },
  { choferId: 2, choferNombre: "María", choferApellido: "González", litrosTotales: 950, numeroEventos: 18, vehiculosMasUsados: ["XYZ789"] },
  { choferId: 3, choferNombre: "Carlos", choferApellido: "López", litrosTotales: 780, numeroEventos: 15, vehiculosMasUsados: ["AAA111"] },
];

const mockCostoPorCentroCosto = [
  {
    centroCostoId: 1,
    centroCostoCodigo: "LOTE-001",
    centroCostoNombre: "Lote Norte",
    centroCostoTipo: "Lote",
    litrosTotales: 2500,
    costoTotal: 2125000,
    numeroEventos: 35,
    vehiculosAsignados: 3,
  },
  {
    centroCostoId: 2,
    centroCostoCodigo: "LOTE-002",
    centroCostoNombre: "Lote Sur",
    centroCostoTipo: "Lote",
    litrosTotales: 1800,
    costoTotal: 1530000,
    numeroEventos: 28,
    vehiculosAsignados: 2,
  },
];

const mockDesvios = [
  {
    eventoId: 101,
    fecha: "2024-12-01",
    vehiculoPatente: "ABC123",
    choferNombre: "Juan Pérez",
    litros: 250,
    tipoDesvio: "exceso",
    severidad: "alta" as const,
    descripcion: "Carga excesiva detectada (>200L)",
  },
  {
    eventoId: 102,
    fecha: "2024-12-02",
    vehiculoPatente: "XYZ789",
    choferNombre: "María González",
    litros: 45,
    tipoDesvio: "falta-evidencia",
    severidad: "media" as const,
    descripcion: "Falta evidencia fotográfica",
  },
  {
    eventoId: 103,
    fecha: "2024-12-03",
    vehiculoPatente: "AAA111",
    choferNombre: "Carlos López",
    litros: 180,
    tipoDesvio: "horario-inusual",
    severidad: "baja" as const,
    descripcion: "Carga fuera de horario habitual",
  },
];

const mockRankingEficiencia = [
  {
    posicion: 1,
    vehiculoId: 2,
    vehiculoPatente: "XYZ789",
    vehiculoTipo: "Pickup",
    eficiencia: 12.3,
    litrosTotales: 800,
    tendencia: "mejorando" as const,
  },
  {
    posicion: 2,
    vehiculoId: 1,
    vehiculoPatente: "ABC123",
    vehiculoTipo: "Camión",
    eficiencia: 8.5,
    litrosTotales: 1500,
    tendencia: "estable" as const,
  },
  {
    posicion: 3,
    vehiculoId: 3,
    vehiculoPatente: "AAA111",
    vehiculoTipo: "Tractor",
    eficiencia: 6.8,
    litrosTotales: 1200,
    tendencia: "empeorando" as const,
  },
];

export default function ReportesPage() {
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>("consumo-vehiculos");

  const handleExport = () => {
    let dataToExport: Record<string, string | number>[] = [];
    let filename = "";

    switch (tipoReporte) {
      case "consumo-vehiculos":
        dataToExport = mockConsumoVehiculos.map((item) => ({
          Vehículo: `${item.vehiculoPatente} - ${item.vehiculoTipo}`,
          "Total Litros": item.litrosTotales,
          "Total Costo": item.costoTotal,
          Eventos: item.numeroEventos,
          Eficiencia: item.eficienciaKmPorLitro || item.eficienciaLitrosPorHora || 0,
        }));
        filename = "Consumo_por_Vehiculos";
        break;
      case "litros-surtidor":
        dataToExport = mockLitrosPorSurtidor.map((item) => ({
          Surtidor: item.surtidorNombre,
          "Total Litros": item.litrosTotales,
          "Total Costo": item.costoTotal,
          Eventos: item.numeroEventos,
        }));
        filename = "Litros_por_Surtidor";
        break;
      case "litros-operador":
        dataToExport = mockLitrosPorOperador.map((item) => ({
          Operador: `${item.choferNombre} ${item.choferApellido}`,
          "Total Litros": item.litrosTotales,
          Eventos: item.numeroEventos,
          "Vehículos Usados": item.vehiculosMasUsados.join(", "),
        }));
        filename = "Litros_por_Operador";
        break;
      case "costo-centro":
        dataToExport = mockCostoPorCentroCosto.map((item) => ({
          "Centro de Costo": `${item.centroCostoCodigo} - ${item.centroCostoNombre}`,
          Tipo: item.centroCostoTipo,
          "Total Litros": item.litrosTotales,
          "Total Costo": item.costoTotal,
          Eventos: item.numeroEventos,
          Vehículos: item.vehiculosAsignados,
        }));
        filename = "Costos_por_Centro_de_Costo";
        break;
      case "desvios":
        dataToExport = mockDesvios.map((item) => ({
          "Evento ID": item.eventoId,
          Fecha: new Date(item.fecha).toLocaleDateString(),
          Vehículo: item.vehiculoPatente,
          Chofer: item.choferNombre,
          Litros: item.litros,
          Tipo: item.tipoDesvio,
          Severidad: item.severidad,
          Descripción: item.descripcion,
        }));
        filename = "Analisis_de_Desvios";
        break;
      case "ranking-eficiencia":
        dataToExport = mockRankingEficiencia.map((item) => ({
          Posición: item.posicion,
          Vehículo: `${item.vehiculoPatente} - ${item.vehiculoTipo}`,
          Eficiencia: item.eficiencia,
          "Total Litros": item.litrosTotales,
          Tendencia: item.tendencia,
        }));
        filename = "Ranking_de_Eficiencia";
        break;
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case "alta":
        return { bg: "#ef444415", color: "#ef4444" };
      case "media":
        return { bg: "#f59e0b15", color: "#f59e0b" };
      case "baja":
        return { bg: "#3b82f615", color: "#3b82f6" };
      default:
        return { bg: "#99999915", color: "#999" };
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case "mejorando":
        return <TrendingUpIcon sx={{ fontSize: 18, color: "#10b981" }} />;
      case "empeorando":
        return <TrendingDownIcon sx={{ fontSize: 18, color: "#ef4444" }} />;
      default:
        return <RemoveIcon sx={{ fontSize: 18, color: "#9ca3af" }} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1, mb: 0.5 }}>
            Sistema de Reportes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análisis completo de consumo, costos, eficiencia y desvíos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          sx={{
            bgcolor: "#10b981",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { bgcolor: "#059669" },
          }}
        >
          Exportar a Excel
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tipoReporte}
        onChange={(_, newValue) => setTipoReporte(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          bgcolor: "white",
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            minHeight: 64,
          },
        }}
      >
        <Tab value="consumo-vehiculos" icon={<LocalShippingIcon />} iconPosition="start" label="Consumo por Vehículo" />
        <Tab value="litros-surtidor" icon={<LocalGasStationIcon />} iconPosition="start" label="Litros por Surtidor" />
        <Tab value="litros-operador" icon={<PersonIcon />} iconPosition="start" label="Litros por Operador" />
        <Tab value="costo-centro" icon={<AccountBalanceIcon />} iconPosition="start" label="Costos Centro de Costo" />
        <Tab value="desvios" icon={<WarningIcon />} iconPosition="start" label="Análisis de Desvíos" />
        <Tab value="ranking-eficiencia" icon={<EmojiEventsIcon />} iconPosition="start" label="Ranking Eficiencia" />
      </Tabs>

      {/* Reporte 1: Consumo por Vehículo */}
      {tipoReporte === "consumo-vehiculos" && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Total de Litros por Vehículo
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockConsumoVehiculos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vehiculoPatente" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                      formatter={(value) => [`${value} L`, "Litros"]}
                    />
                    <Bar dataKey="litrosTotales" fill="#1E2C56" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, bgcolor: "#1E2C5608" }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Total Litros</Typography>
                  <Typography variant="h4" fontWeight={700} color="#1E2C56">
                    {mockConsumoVehiculos.reduce((sum, item) => sum + item.litrosTotales, 0).toLocaleString()} L
                  </Typography>
                </CardContent>
              </Card>
              <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, bgcolor: "#10b98108" }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Costo Total</Typography>
                  <Typography variant="h4" fontWeight={700} color="#10b981">
                    ${mockConsumoVehiculos.reduce((sum, item) => sum + item.costoTotal, 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f9fafb" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Vehículo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Total Litros</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Costo Total</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Eventos</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Eficiencia</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockConsumoVehiculos.map((item) => (
                      <TableRow key={item.vehiculoId} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{item.vehiculoPatente}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.vehiculoTipo}</Typography>
                        </TableCell>
                        <TableCell align="right">{item.litrosTotales.toLocaleString()} L</TableCell>
                        <TableCell align="right">${item.costoTotal.toLocaleString()}</TableCell>
                        <TableCell align="right">{item.numeroEventos}</TableCell>
                        <TableCell align="right">
                          {item.eficienciaKmPorLitro ? `${item.eficienciaKmPorLitro.toFixed(2)} km/L` : `${item.eficienciaLitrosPorHora?.toFixed(2)} L/h`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 2: Litros por Surtidor */}
      {tipoReporte === "litros-surtidor" && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Distribución por Surtidor</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockLitrosPorSurtidor}
                      dataKey="litrosTotales"
                      nameKey="surtidorNombre"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {mockLitrosPorSurtidor.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} L`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f9fafb" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Surtidor</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Litros</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Eventos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockLitrosPorSurtidor.map((item) => (
                      <TableRow key={item.surtidorId} hover>
                        <TableCell>{item.surtidorNombre}</TableCell>
                        <TableCell align="right">{item.litrosTotales.toLocaleString()} L</TableCell>
                        <TableCell align="right">{item.numeroEventos}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 3: Litros por Operador */}
      {tipoReporte === "litros-operador" && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Consumo por Operador</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockLitrosPorOperador}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey={(item) => `${item.choferNombre} ${item.choferApellido}`} stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip formatter={(value) => [`${value} L`, "Litros"]} />
                    <Bar dataKey="litrosTotales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 4: Costo por Centro de Costo */}
      {tipoReporte === "costo-centro" && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f9fafb" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Centro de Costo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Litros</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Costo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Vehículos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockCostoPorCentroCosto.map((item) => (
                      <TableRow key={item.centroCostoId} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{item.centroCostoCodigo}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.centroCostoNombre}</Typography>
                        </TableCell>
                        <TableCell>{item.centroCostoTipo}</TableCell>
                        <TableCell align="right">{item.litrosTotales.toLocaleString()} L</TableCell>
                        <TableCell align="right">${item.costoTotal.toLocaleString()}</TableCell>
                        <TableCell align="right">{item.vehiculosAsignados}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 5: Análisis de Desvíos */}
      {tipoReporte === "desvios" && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f9fafb" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Evento</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Vehículo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Chofer</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Severidad</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockDesvios.map((item) => (
                      <TableRow key={item.eventoId} hover>
                        <TableCell>#{item.eventoId}</TableCell>
                        <TableCell>{new Date(item.fecha).toLocaleDateString("es-AR")}</TableCell>
                        <TableCell>{item.vehiculoPatente}</TableCell>
                        <TableCell>{item.choferNombre}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.severidad.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: getSeveridadColor(item.severidad).bg,
                              color: getSeveridadColor(item.severidad).color,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.descripcion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 6: Ranking de Eficiencia */}
      {tipoReporte === "ranking-eficiencia" && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f9fafb" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Posición</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Vehículo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Eficiencia</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Litros</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tendencia</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockRankingEficiencia.map((item) => (
                      <TableRow key={item.vehiculoId} hover>
                        <TableCell>
                          <Chip
                            label={`#${item.posicion}`}
                            size="small"
                            sx={{
                              bgcolor: item.posicion === 1 ? "#f59e0b15" : "#e2e8f0",
                              color: item.posicion === 1 ? "#f59e0b" : "#64748b",
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{item.vehiculoPatente}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.vehiculoTipo}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700} color="#10b981">
                            {item.eficiencia.toFixed(2)} km/L
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{item.litrosTotales.toLocaleString()} L</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            {getTendenciaIcon(item.tendencia)}
                            <Typography variant="caption">{item.tendencia}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
