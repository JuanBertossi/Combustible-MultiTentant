import { useState } from "react";
import SkeletonLoading from "../../../common/SkeletonLoading/SkeletonLoading";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  type SelectChangeEvent,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";

type PeriodoType = "semana" | "mes" | "trimestre" | "anio";

interface ConsumoMensualData {
  mes: string;
  litros: number;
  costo: number;
}

interface ConsumoPorVehiculoData {
  vehiculo: string;
  litros: number;
  eficiencia: number;
}

interface ConsumoPorTipoData {
  tipo: string;
  litros: number;
  porcentaje: number;
  [key: string]: string | number;
}

interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const consumoMensual: ConsumoMensualData[] = [
  { mes: "Ene", litros: 4500, costo: 6750 },
  { mes: "Feb", litros: 5200, costo: 7800 },
  { mes: "Mar", litros: 4800, costo: 7200 },
  { mes: "Abr", litros: 5500, costo: 8250 },
  { mes: "May", litros: 6000, costo: 9000 },
  { mes: "Jun", litros: 5800, costo: 8700 },
];

const consumoPorVehiculo: ConsumoPorVehiculoData[] = [
  { vehiculo: "ABC123", litros: 1200, eficiencia: 4.0 },
  { vehiculo: "DEF456", litros: 980, eficiencia: 4.0 },
  { vehiculo: "GHI789", litros: 1500, eficiencia: 3.5 },
  { vehiculo: "JKL012", litros: 850, eficiencia: 4.0 },
];

const consumoPorTipo: ConsumoPorTipoData[] = [
  { tipo: "Camión", litros: 3200, porcentaje: 45 },
  { tipo: "Tractor", litros: 2400, porcentaje: 34 },
  { tipo: "Sembradora", litros: 800, porcentaje: 11 },
  { tipo: "Pick-up", litros: 700, porcentaje: 10 },
];

const COLORS = ["#1E2C56", "#4A90E2", "#10b981", "#f59e0b"];

export default function HomePage() {
  const [periodo, setPeriodo] = useState<PeriodoType>("mes");
  const [isLoading] = useState<boolean>(false);

  const kpis: KPIData[] = [
    {
      label: "Consumo Total",
      value: "32,450 L",
      change: "+12%",
      trend: "up",
      icon: <LocalGasStationIcon sx={{ fontSize: 28 }} />,
      color: "#1E2C56",
      bgColor: "#1E2C5615",
    },
    {
      label: "Costo Total",
      value: "$48,675",
      change: "+8%",
      trend: "up",
      icon: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
      color: "#10b981",
      bgColor: "#10b98115",
    },
    {
      label: "Vehículos Activos",
      value: "24",
      change: "+2",
      trend: "up",
      icon: <DirectionsCarIcon sx={{ fontSize: 28 }} />,
      color: "#4A90E2",
      bgColor: "#4A90E215",
    },
    {
      label: "Alertas Pendientes",
      value: "3",
      change: "-5",
      trend: "down",
      icon: <WarningIcon sx={{ fontSize: 28 }} />,
      color: "#f59e0b",
      bgColor: "#f59e0b15",
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <SkeletonLoading height={48} count={1} />
        <SkeletonLoading height={120} count={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <FormControl
            size="small"
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#1E2C56",
                },
              },
            }}
          >
            <InputLabel sx={{ fontWeight: 600 }}>Período</InputLabel>
            <Select
              value={periodo}
              onChange={(e: SelectChangeEvent<PeriodoType>) =>
                setPeriodo(e.target.value as PeriodoType)
              }
              label="Período"
            >
              <MenuItem value="semana">Esta semana</MenuItem>
              <MenuItem value="mes">Este mes</MenuItem>
              <MenuItem value="trimestre">Trimestre</MenuItem>
              <MenuItem value="anio">Año</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* KPIs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {kpis.map((kpi, index) => (
          <Card
            key={index}
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 3,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(30,44,86,0.15)",
                transform: "translateY(-4px)",
                borderColor: kpi.color + "30",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2.5,
                    bgcolor: kpi.bgColor,
                    color: kpi.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${kpi.color}20`,
                  }}
                >
                  {kpi.icon}
                </Box>
                <Chip
                  icon={
                    kpi.trend === "up" ? (
                      <TrendingUpIcon />
                    ) : (
                      <TrendingDownIcon />
                    )
                  }
                  label={kpi.change}
                  size="small"
                  sx={{
                    bgcolor: kpi.trend === "up" ? "#10b98118" : "#ef444418",
                    color: kpi.trend === "up" ? "#10b981" : "#ef4444",
                    fontWeight: 700,
                    border: "none",
                    fontSize: 13,
                    "& .MuiChip-icon": {
                      color: "inherit",
                    },
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {kpi.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  letterSpacing: "-1px",
                }}
              >
                {kpi.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Gráficos */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Consumo Mensual */}
        <Card
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                fontWeight: 700,
                color: "#1e293b",
                letterSpacing: "-0.3px",
              }}
            >
              Consumo y Costo Mensual
            </Typography>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={consumoMensual}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  stroke="#94a3b8"
                  style={{ fontSize: 13, fontWeight: 600 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#1E2C56"
                  style={{ fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  style={{ fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    fontWeight: 600,
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: 30,
                    fontWeight: 600,
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="litros"
                  stroke="#1E2C56"
                  strokeWidth={4}
                  name="Litros"
                  dot={{
                    fill: "#1E2C56",
                    r: 7,
                    strokeWidth: 3,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 9 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="costo"
                  stroke="#10b981"
                  strokeWidth={4}
                  name="Costo ($)"
                  dot={{
                    fill: "#10b981",
                    r: 7,
                    strokeWidth: 3,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 9 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consumo por Tipo */}
        <Card
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                fontWeight: 700,
                color: "#1e293b",
                letterSpacing: "-0.3px",
              }}
            >
              Consumo por Tipo
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={consumoPorTipo}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={(entry: ConsumoPorTipoData) =>
                    `${entry.porcentaje}%`
                  }
                  outerRadius={95}
                  innerRadius={55}
                  fill="#8884d8"
                  dataKey="litros"
                  paddingAngle={3}
                >
                  {consumoPorTipo.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3 }}>
              {consumoPorTipo.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        bgcolor: COLORS[index],
                      }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {item.tipo}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight="700"
                    sx={{ color: "#1e293b" }}
                  >
                    {item.litros.toLocaleString()} L
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Consumo por Vehículo */}
      <Card
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: "#1e293b",
              letterSpacing: "-0.3px",
            }}
          >
            Consumo por Vehículo (Top 4)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={consumoPorVehiculo}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="vehiculo"
                stroke="#94a3b8"
                style={{ fontSize: 13, fontWeight: 600 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  fontWeight: 600,
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  paddingTop: 30,
                  fontWeight: 600,
                }}
              />
              <Bar
                dataKey="litros"
                fill="#1E2C56"
                name="Litros consumidos"
                radius={[8, 8, 0, 0]}
                maxBarSize={70}
              />
              <Bar
                dataKey="eficiencia"
                fill="#4A90E2"
                name="Eficiencia (km/L)"
                radius={[8, 8, 0, 0]}
                maxBarSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
