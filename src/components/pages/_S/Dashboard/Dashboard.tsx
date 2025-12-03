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
  Chip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
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
//
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

export default function Dashboard() {
  const [periodo, setPeriodo] = useState<PeriodoType>("mes");
  const [isLoading] = useState<boolean>(false);
  const handlePeriodo = (event: SelectChangeEvent<PeriodoType>) => {
    setPeriodo(event.target.value as PeriodoType);
  };
  const kpis: KPIData[] = [
    {
      label: "Consumo Total",
      value: "32,450 L",
      change: "+12%",
      trend: "up",
      icon: <LocalGasStationIcon sx={{ fontSize: 24 }} />,
      color: "#1E2C56",
      bgColor: "#1E2C5615",
    },
    {
      label: "Costo Total",
      value: "$48,675",
      change: "+8%",
      trend: "up",
      icon: <AttachMoneyIcon sx={{ fontSize: 24 }} />,
      color: "#10b981",
      bgColor: "#10b98115",
    },
    {
      label: "Vehículos Activos",
      value: "24",
      change: "+2",
      trend: "up",
      icon: <DirectionsCarIcon sx={{ fontSize: 24 }} />,
      color: "#4A90E2",
      bgColor: "#4A90E215",
    },
    {
      label: "Alertas Pendientes",
      value: "3",
      change: "-5",
      trend: "down",
      icon: <WarningIcon sx={{ fontSize: 24 }} />,
      color: "#f59e0b",
      bgColor: "#f59e0b15",
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <SkeletonLoading height={48} count={1} />
        <SkeletonLoading height={120} count={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: -4,
          mb: 1,
        }}
      >
        <FormControl
          size="small"
          sx={{
            minWidth: 160,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "& .MuiOutlinedInput-root": {
              height: 38,
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#e2e8f0",
              },
              "&:hover fieldset": {
                borderColor: "#1E2C56",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1E2C56",
                borderWidth: 2,
              },
            },
          }}
        >
          <Select
            value={periodo}
            onChange={handlePeriodo}
            displayEmpty
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            <MenuItem value="semana">Esta semana</MenuItem>
            <MenuItem value="mes">Este mes</MenuItem>
            <MenuItem value="trimestre">Trimestre</MenuItem>
            <MenuItem value="anio">Año</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPIs más compactos */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {kpis.map((kpi, index) => (
          <Card
            key={index}
            elevation={0}
            sx={{
              background: "white",
              border: "1px solid #f1f5f9",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(30,44,86,0.1)",
                transform: "translateY(-2px)",
                borderColor: kpi.color + "40",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: kpi.bgColor,
                    color: kpi.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {kpi.icon}
                </Box>
                <Chip
                  icon={
                    kpi.trend === "up" ? (
                      <TrendingUpIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16 }} />
                    )
                  }
                  label={kpi.change}
                  size="small"
                  sx={{
                    height: 24,
                    bgcolor: kpi.trend === "up" ? "#10b98118" : "#ef444418",
                    color: kpi.trend === "up" ? "#10b981" : "#ef4444",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    "& .MuiChip-icon": {
                      color: "inherit",
                      fontSize: 16,
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
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {kpi.label}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  letterSpacing: "-0.5px",
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
          gap: 2.5,
          mb: 2.5,
        }}
      >
        {/* Consumo Mensual */}
        <Card
          elevation={0}
          sx={{
            background: "white",
            border: "1px solid #f1f5f9",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: "#1e293b",
                fontSize: "1.125rem",
              }}
            >
              Consumo y Costo Mensual
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={consumoMensual}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  stroke="#94a3b8"
                  style={{ fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#1E2C56"
                  style={{ fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  style={{ fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "0.875rem",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 20, fontSize: "0.875rem" }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="litros"
                  stroke="#1E2C56"
                  strokeWidth={3}
                  name="Litros"
                  dot={{
                    fill: "#1E2C56",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="costo"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Costo ($)"
                  dot={{
                    fill: "#10b981",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consumo por Tipo */}
        <Card
          elevation={0}
          sx={{
            background: "white",
            border: "1px solid #f1f5f9",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: "#1e293b",
                fontSize: "1.125rem",
              }}
            >
              Consumo por Tipo
            </Typography>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={consumoPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: ConsumoPorTipoData) => `${entry.porcentaje}%`}
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="litros"
                  paddingAngle={2}
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
                    borderRadius: 8,
                    fontSize: "0.875rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 2 }}>
              {consumoPorTipo.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                    p: 1,
                    borderRadius: 1.5,
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: "#f8fafc" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: COLORS[index],
                      }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      fontSize="0.875rem"
                    >
                      {item.tipo}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    fontSize="0.875rem"
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
          background: "white",
          border: "1px solid #f1f5f9",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "1.125rem",
            }}
          >
            Consumo por Vehículo (Top 4)
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={consumoPorVehiculo}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="vehiculo"
                stroke="#94a3b8"
                style={{ fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: 20, fontSize: "0.875rem" }}
              />
              <Bar
                dataKey="litros"
                fill="#1E2C56"
                name="Litros consumidos"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="eficiencia"
                fill="#4A90E2"
                name="Eficiencia (km/L)"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
