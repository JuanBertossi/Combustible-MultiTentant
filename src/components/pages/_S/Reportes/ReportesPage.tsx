// components/pages/_S/Reportes/ReportesPage.tsx
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
import * as XLSX from "xlsx";

type TipoReporte =
  | "consumo-vehiculos"
  | "litros-surtidor"
  | "litros-operador"
  | "costo-centro"
  | "desvios"
  | "ranking-eficiencia";

const COLORS = [
  "#1E2C56",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

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
];

const mockLitrosPorSurtidor = [
  { surtidorId: 1, surtidorNombre: "Surtidor Norte", litrosTotales: 3500, costoTotal: 2975000, numeroEventos: 45 },
  { surtidorId: 2, surtidorNombre: "Surtidor Sur", litrosTotales: 2800, costoTotal: 2380000, numeroEventos: 38 },
];

const mockLitrosPorOperador = [
  { choferId: 1, choferNombre: "Juan", choferApellido: "Pérez", litrosTotales: 1200, numeroEventos: 20, vehiculosMasUsados: ["ABC123"] },
  { choferId: 2, choferNombre: "María", choferApellido: "González", litrosTotales: 950, numeroEventos: 18, vehiculosMasUsados: ["XYZ789"] },
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
];

const mockDesvios = [
  {
    eventoId: 101,
    fecha: "2024-01-15",
    vehiculoPatente: "ABC123",
    choferNombre: "Juan Pérez",
    litros: 250,
    tipoDesvio: "exceso",
    severidad: "alta" as const,
    descripcion: "Carga excesiva detectada",
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
          "Total Costo": `$${item.costoTotal.toLocaleString()}`,
          Eventos: item.numeroEventos,
          Eficiencia: item.eficienciaKmPorLitro
            ? `${item.eficienciaKmPorLitro.toFixed(2)} km/L`
            : `${item.eficienciaLitrosPorHora?.toFixed(2)} L/h`,
        }));
        filename = "Consumo_por_Vehiculos";
        break;
      case "litros-surtidor":
        dataToExport = mockLitrosPorSurtidor.map((item) => ({
          Surtidor: item.surtidorNombre,
          "Total Litros": item.litrosTotales,
          "Total Costo": `$${item.costoTotal.toLocaleString()}`,
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
          "Total Costo": `$${item.costoTotal.toLocaleString()}`,
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
    XLSX.writeFile(
      wb,
      `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
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
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 64,
            },
          }}
        >
          <Tab
            value="consumo-vehiculos"
            icon={<LocalShippingIcon />}
            iconPosition="start"
            label="Consumo por Vehículo"
          />
          <Tab
            value="litros-surtidor"
            icon={<LocalGasStationIcon />}
            iconPosition="start"
            label="Litros por Surtidor"
          />
          <Tab
            value="litros-operador"
            icon={<PersonIcon />}
            iconPosition="start"
            label="Litros por Operador"
          />
          <Tab
            value="costo-centro"
            icon={<AccountBalanceIcon />}
            iconPosition="start"
            label="Costos Centro de Costo"
          />
          <Tab
            value="desvios"
            icon={<WarningIcon />}
            iconPosition="start"
            label="Análisis de Desvíos"
          />
          <Tab
            value="ranking-eficiencia"
            icon={<EmojiEventsIcon />}
            iconPosition="start"
            label="Ranking Eficiencia"
          />
        </Tabs>
      </Box>

      {/* Reporte 1: Consumo por Vehículo */}
      {tipoReporte === "consumo-vehiculos" && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Total de Litros por Vehículo
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockConsumoVehiculos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="vehiculoPatente" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`${value} L`, "Litros"]}
                    />
                    <Bar
                      dataKey="litrosTotales"
                      fill="#1E2C56"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  bgcolor: "#1E2C5608",
                }}
              >
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Total Litros
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#1E2C56">
                    {mockConsumoVehiculos
                      .reduce((sum, item) => sum + item.litrosTotales, 0)
                      .toLocaleString()}{" "}
                    L
                  </Typography>
                </CardContent>
              </Card>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  bgcolor: "#10b98108",
                }}
              >
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Costo Total
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#10b981">
                    $
                    {mockConsumoVehiculos
                      .reduce((sum, item) => sum + item.costoTotal, 0)
                      .toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Vehículo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Total Litros
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Costo Total
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Eventos
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Eficiencia
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockConsumoVehiculos.map((item) => (
                        <TableRow key={item.vehiculoId} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {item.vehiculoPatente}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.vehiculoTipo}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {item.litrosTotales.toLocaleString()} L
                          </TableCell>
                          <TableCell align="right">
                            ${item.costoTotal.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {item.numeroEventos}
                          </TableCell>
                          <TableCell align="right">
                            {item.eficienciaKmPorLitro
                              ? `${item.eficienciaKmPorLitro.toFixed(2)} km/L`
                              : `${item.eficienciaLitrosPorHora?.toFixed(2)} L/h`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Otros reportes simplificados para mantener el código corto */}
      {tipoReporte !== "consumo-vehiculos" && (
        <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Reporte: {tipoReporte}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Visualización próximamente (implementar según necesidad)
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
