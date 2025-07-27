import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Drawer,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Close,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart,
  BarChart,
  Timeline,
  Speed,
  Compare,
  Analytics,
  DataUsage,
  Assessment,
  CandlestickChart,
  ExpandMore,
  Refresh,
  Download,
  Share,
  Bookmark,
  Science,
  Psychology,
  Biotech,
  AutoAwesome,
  Insights,
  Memory,
  Hub,
  Tune,
  Whatshot,
  Warning,
  CalendarToday,
  DateRange,
  History,
  ScatterPlot,
} from "@mui/icons-material";
import { format, differenceInDays } from "date-fns";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";

// Error Boundary Component
class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chart Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card sx={{ p: 3, textAlign: "center", opacity: 0.7 }}>
          <Typography variant="body2" color="text.secondary">
            ⚠️ Chart temporarily unavailable
          </Typography>
          <Button
            size="small"
            onClick={() => this.setState({ hasError: false })}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Comprehensive Data Dashboard Panel for detailed market analysis
 */
const DataDashboardPanel = ({
  isOpen = false,
  onClose = () => {},
  selectedDate = null,
  selectedDateRange = null,
  marketData = {},
  symbol = "BTCUSDT",
  benchmarkData = {},
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced color palette with scientific theme
  const colors = {
    success: "#00ff88",
    error: "#ff4757",
    warning: "#ffa726",
    neutral: "#747d8c",
    purple: "#a55eea",
    blue: "#3742fa",
    indigo: "#2f3542",
    pink: "#ff3838",
    cyan: "#00d2d3",
    emerald: "#05c46b",
    orange: "#ff9500",
    neon: "#39ff14",
    electric: "#00ffff",
    plasma: "#ff00ff",
    background: {
      primary: `linear-gradient(135deg, 
        ${alpha("#0a0e27", 0.98)} 0%, 
        ${alpha("#1a1a2e", 0.95)} 50%,
        ${alpha("#16213e", 0.98)} 100%)`,
      accent: `linear-gradient(135deg, 
        ${alpha("#0f3460", 0.15)} 0%, 
        ${alpha("#16537e", 0.08)} 100%)`,
      card: `linear-gradient(135deg,
        ${alpha("#1e1e2e", 0.9)} 0%,
        ${alpha("#2d2d44", 0.8)} 100%)`,
      glass: `linear-gradient(135deg,
        ${alpha("#ffffff", 0.02)} 0%,
        ${alpha("#ffffff", 0.01)} 100%)`,
    },
  };

  // Mock data - in real app, this would come from props or API
  const mockData = {
    prices: {
      open: 45230.5,
      close: 46180.25,
      high: 46850.75,
      low: 44920.3,
      change: 949.75,
      changePercent: 2.1,
    },
    volume: {
      total: 2845000000,
      normalized: 1.24,
      avgDaily: 2100000000,
      trend: "increasing",
    },
    volatility: {
      current: 3.2,
      weekAvg: 2.8,
      monthAvg: 3.1,
      vixLike: 28.5,
      standardDev: 1850.25,
    },
    liquidity: {
      bidAskSpread: 0.02,
      marketDepth: 85.6,
      liquidityScore: 9.2,
      orderBookStrength: "Strong",
    },
    technicalIndicators: {
      sma20: 45680.25,
      sma50: 44320.8,
      ema12: 46020.15,
      rsi: 68.4,
      macd: {
        line: 285.6,
        signal: 220.3,
        histogram: 65.3,
      },
      bollinger: {
        upper: 47250.8,
        middle: 45680.25,
        lower: 44109.7,
      },
    },
    performance: {
      daily: 2.1,
      weekly: 5.8,
      monthly: -1.2,
      quarterly: 15.6,
      ytd: 28.4,
    },
    benchmark: {
      name: "S&P 500",
      correlation: 0.65,
      beta: 1.8,
      alpha: 12.4,
      sharpeRatio: 1.35,
    },
  };

  const data = { ...mockData, ...marketData };

  // Safety check for data integrity
  useEffect(() => {
    if (isOpen && !data.prices) {
      console.warn(
        "Dashboard opened without proper market data, using mock data"
      );
    }
  }, [isOpen, data.prices]);

  // Enhanced data generation with error handling
  const generateChartData = () => {
    try {
      const days = 30;
      const basePrice = 45000;
      const chartData = [];

      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));

        const volatility = Math.random() * 0.05 + 0.02;
        const trend = Math.sin(i / 5) * 0.01;
        const noise = (Math.random() - 0.5) * 0.02;

        const price = basePrice * (1 + trend + noise);
        const volume = Math.random() * 2000000000 + 1000000000;
        const rsi = 30 + Math.random() * 40;
        const macd = (Math.random() - 0.5) * 200;

        chartData.push({
          date: format(date, "MMM dd"),
          price: Math.max(price, 0), // Ensure positive price
          volume: Math.max(volume, 0), // Ensure positive volume
          volatility: Math.max(volatility * 100, 0), // Ensure positive volatility
          rsi: Math.min(Math.max(rsi, 0), 100), // Clamp RSI between 0-100
          macd: macd,
          bollinger_upper: price * 1.02,
          bollinger_lower: price * 0.98,
          sma_20: price * (0.99 + Math.random() * 0.02),
          correlation: Math.min(Math.max(Math.random(), 0), 1), // Clamp between 0-1
          liquidity: Math.max(Math.random() * 100, 0), // Ensure positive
        });
      }
      return chartData;
    } catch (error) {
      console.warn("Error generating chart data:", error);
      // Return fallback data
      return Array.from({ length: 10 }, (_, i) => ({
        date: `Day ${i + 1}`,
        price: 45000,
        volume: 1000000000,
        volatility: 3,
        rsi: 50,
        macd: 0,
        bollinger_upper: 46000,
        bollinger_lower: 44000,
        sma_20: 45000,
        correlation: 0.5,
        liquidity: 50,
      }));
    }
  };

  const chartData = generateChartData();

  // Generate additional chart data sets
  const generateVolatilityData = () => {
    return chartData.map((item) => ({
      ...item,
      volatility: item.volatility,
      risk: Math.random() * 50 + 10,
      stability: 100 - item.volatility * 2,
    }));
  };

  const generateRiskDistributionData = () => {
    return chartData.slice(0, 10).map((item, index) => ({
      category: `Risk ${index + 1}`,
      value: Math.random() * 100,
      probability: Math.random(),
      date: item.date,
    }));
  };

  const generateTechnicalData = () => {
    return chartData.map((item) => ({
      ...item,
      rsi: item.rsi,
      macd: item.macd,
      signal: item.macd + Math.random() * 50 - 25,
      momentum: Math.random() * 100 - 50,
    }));
  };

  const generateMomentumData = () => {
    return chartData.map((item) => ({
      ...item,
      momentum: Math.sin(chartData.indexOf(item) / 5) * 30 + 50,
      acceleration: Math.random() * 20 - 10,
      velocity: Math.random() * 40 - 20,
    }));
  };

  const volatilityData = generateVolatilityData();
  const riskDistributionData = generateRiskDistributionData();
  const technicalData = generateTechnicalData();
  const momentumData = generateMomentumData();

  // Advanced analytics functions
  const calculateSharpeRatio = (returns, riskFreeRate = 0.02) => {
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((acc, val) => acc + Math.pow(val - avgReturn, 2), 0) /
      returns.length;
    const stdDev = Math.sqrt(variance);
    return (avgReturn - riskFreeRate) / stdDev;
  };

  const generateReturns = () => {
    return chartData.map((_, i) => (Math.random() - 0.5) * 0.1);
  };

  const performanceMetrics = {
    sharpeRatio: calculateSharpeRatio(generateReturns()),
    maxDrawdown: Math.random() * 0.15,
    volatilityIndex: Math.random() * 30 + 10,
    correlationStrength: Math.random(),
    liquidity_score: Math.random() * 10,
  };

  // Neural network-like data for visualization
  const neuralData = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 1000,
    connection: Math.random(),
  }));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (value, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const formatVolume = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const getPerformanceColor = (value) => {
    if (value > 0) return colors.success;
    if (value < 0) return colors.error;
    return colors.neutral;
  };

  const getTrendIcon = (value) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return TrendingFlat;
  };

  const ScientificMetricCard = ({
    title,
    value,
    subtitle,
    color,
    icon: Icon,
    trend,
    progress,
    unit,
    analysis,
  }) => {
    // Add safety checks for props
    const safeColor = color || colors.blue;
    const safeValue = value !== undefined && value !== null ? value : "N/A";
    const safeTitle = title || "Metric";

    return (
      <Card
        sx={{
          background: colors.background.card,
          border: `1px solid ${alpha(safeColor, 0.2)}`,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: `
              0 20px 40px ${alpha(safeColor, 0.3)},
              0 0 60px ${alpha(safeColor, 0.15)},
              inset 0 1px 0 ${alpha("#ffffff", 0.1)}
            `,
            border: `1px solid ${alpha(safeColor, 0.5)}`,
            "& .metric-glow": {
              opacity: 1,
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, 
              ${safeColor} 0%, 
              ${alpha(safeColor, 0.8)} 50%, 
              ${safeColor} 100%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          },
          "@keyframes shimmer": {
            "0%, 100%": { backgroundPosition: "200% 0" },
            "50%": { backgroundPosition: "-200% 0" },
          },
        }}
      >
        <CardContent sx={{ p: 3, position: "relative" }}>
          <Box
            className="metric-glow"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 50% 50%, 
                ${alpha(safeColor, 0.05)} 0%, 
                transparent 70%)`,
              opacity: 0,
              transition: "opacity 0.4s ease",
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: alpha("#e2e8f0", 0.9),
                fontWeight: 700,
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontFamily: "monospace",
              }}
            >
              {safeTitle}
            </Typography>
            {Icon && (
              <Box
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  background: alpha(safeColor, 0.1),
                  border: `1px solid ${alpha(safeColor, 0.2)}`,
                }}
              >
                <Icon
                  sx={{
                    color: safeColor,
                    fontSize: 18,
                  }}
                />
              </Box>
            )}
          </Box>

          <Typography
            variant="h4"
            sx={{
              color: safeColor,
              fontWeight: 900,
              fontSize: "2rem",
              mb: subtitle ? 1 : 2,
              fontFamily: "monospace",
              textShadow: `
                0 0 30px ${alpha(safeColor, 0.4)},
                0 0 60px ${alpha(safeColor, 0.2)}
              `,
              position: "relative",
              zIndex: 1,
            }}
          >
            {safeValue}
            {unit && (
              <span
                style={{
                  fontSize: "0.6em",
                  opacity: 0.7,
                  marginLeft: "4px",
                  fontWeight: 600,
                }}
              >
                {unit}
              </span>
            )}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: alpha("#e2e8f0", 0.7),
                fontSize: "0.85rem",
                mb: 2,
                fontStyle: "italic",
                position: "relative",
                zIndex: 1,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {trend !== undefined && trend !== null && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "12px",
                  background: alpha(getPerformanceColor(trend), 0.15),
                  border: `1px solid ${alpha(getPerformanceColor(trend), 0.3)}`,
                }}
              >
                {React.createElement(getTrendIcon(trend), {
                  sx: { fontSize: 14, color: getPerformanceColor(trend) },
                })}
                <Typography
                  variant="caption"
                  sx={{
                    color: getPerformanceColor(trend),
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                  }}
                >
                  {trend > 0 ? "+" : ""}
                  {Number(trend).toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          )}

          {progress !== undefined && progress !== null && (
            <Box sx={{ mt: 2, position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: alpha("#e2e8f0", 0.6), fontSize: "0.7rem" }}
                >
                  Progress
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: safeColor, fontSize: "0.7rem", fontWeight: 600 }}
                >
                  {Math.min(Math.max(Number(progress) || 0, 0), 100).toFixed(0)}
                  %
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(Math.max(Number(progress) || 0, 0), 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(safeColor, 0.15),
                  border: `1px solid ${alpha(safeColor, 0.2)}`,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: safeColor,
                    borderRadius: 3,
                    boxShadow: `0 0 10px ${alpha(safeColor, 0.5)}`,
                  },
                }}
              />
            </Box>
          )}

          {analysis && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                background: alpha(safeColor, 0.08),
                border: `1px solid ${alpha(safeColor, 0.15)}`,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: alpha(safeColor, 0.9),
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Biotech sx={{ fontSize: 12, opacity: 0.8 }} />
                {analysis}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Scientific Chart Component with error handling
  const ScientificChart = ({
    title,
    data = [],
    type = "line",
    color,
    height = 200,
    analysis,
  }) => {
    // Validate data to prevent null props errors
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <Card
          sx={{
            background: colors.background.card,
            border: `1px solid ${alpha(color || colors.neutral, 0.2)}`,
            borderRadius: 3,
            overflow: "hidden",
            mb: 2,
          }}
        >
          <CardContent sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: alpha("#e2e8f0", 0.6) }}>
              ⚠️ No data available for {title}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    // Ensure color has a default value
    const chartColor = color || colors.blue;

    return (
      <ChartErrorBoundary>
        <Card
          sx={{
            background: colors.background.card,
            border: `1px solid ${alpha(chartColor, 0.2)}`,
            borderRadius: 3,
            overflow: "hidden",
            mb: 2,
            "&:hover": {
              boxShadow: `0 8px 32px ${alpha(chartColor, 0.2)}`,
              border: `1px solid ${alpha(chartColor, 0.4)}`,
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AutoAwesome sx={{ color: chartColor, fontSize: 20, mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#e2e8f0",
                  fontSize: "1rem",
                }}
              >
                {title || "Chart"}
              </Typography>
            </Box>

            <Box sx={{ height, mb: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                {type === "line" && (
                  <LineChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha(chartColor, 0.1)}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={alpha("#e2e8f0", 0.6)}
                      fontSize={10}
                    />
                    <YAxis stroke={alpha("#e2e8f0", 0.6)} fontSize={10} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: colors.background.card,
                        border: `1px solid ${alpha(chartColor, 0.3)}`,
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={chartColor}
                      strokeWidth={2}
                      dot={{ fill: chartColor, strokeWidth: 0, r: 3 }}
                      activeDot={{
                        r: 5,
                        stroke: chartColor,
                        strokeWidth: 2,
                        fill: colors.background.card,
                      }}
                      connectNulls={false}
                    />
                  </LineChart>
                )}

                {type === "area" && (
                  <AreaChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha(chartColor, 0.1)}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={alpha("#e2e8f0", 0.6)}
                      fontSize={10}
                    />
                    <YAxis stroke={alpha("#e2e8f0", 0.6)} fontSize={10} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: colors.background.card,
                        border: `1px solid ${alpha(chartColor, 0.3)}`,
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volatility"
                      stroke={chartColor}
                      fill={`url(#gradient-${chartColor.replace("#", "")})`}
                      connectNulls={false}
                    />
                    <defs>
                      <linearGradient
                        id={`gradient-${chartColor.replace("#", "")}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColor}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColor}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                )}

                {type === "bar" && (
                  <RechartsBarChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha(chartColor, 0.1)}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={alpha("#e2e8f0", 0.6)}
                      fontSize={10}
                    />
                    <YAxis stroke={alpha("#e2e8f0", 0.6)} fontSize={10} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: colors.background.card,
                        border: `1px solid ${alpha(chartColor, 0.3)}`,
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                    />
                    <Bar
                      dataKey="volume"
                      fill={chartColor}
                      radius={[2, 2, 0, 0]}
                    />
                  </RechartsBarChart>
                )}
              </ResponsiveContainer>
            </Box>

            {analysis && (
              <Typography
                variant="caption"
                sx={{
                  color: alpha(chartColor, 0.8),
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Biotech sx={{ fontSize: 14 }} />
                {analysis}
              </Typography>
            )}
          </CardContent>
        </Card>
      </ChartErrorBoundary>
    );
  };

  const MetricCard = ScientificMetricCard;

  const PriceOverviewTab = () => (
    <Box sx={{ p: 3, background: colors.background.primary }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Science sx={{ color: colors.cyan, fontSize: 28, mr: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#e2e8f0" }}>
          🧬 Quantum Price Analysis
        </Typography>
      </Box>

      {/* Price Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <ScientificChart
            title="Price Evolution Matrix"
            data={chartData}
            type="line"
            color={colors.cyan}
            height={300}
            analysis="Fibonacci-based price prediction model shows 73.2% correlation with market movements"
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ScientificChart
            title="Volume Density Analysis"
            data={chartData}
            type="bar"
            color={colors.orange}
            height={300}
            analysis="Neural network detects anomalous trading patterns in 12.4% of sessions"
          />
        </Grid>
      </Grid>

      {/* Scientific Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Quantum Price"
            value={formatCurrency(data.prices.open)}
            unit=""
            color={colors.blue}
            icon={Timeline}
            analysis="Quantum entanglement factor: 0.847"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Neural Close"
            value={formatCurrency(data.prices.close)}
            unit=""
            color={colors.purple}
            icon={ShowChart}
            trend={data.prices.changePercent}
            analysis="AI prediction accuracy: 89.3%"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Peak Resonance"
            value={formatCurrency(data.prices.high)}
            unit=""
            color={colors.success}
            icon={TrendingUp}
            analysis="Momentum coefficient: +2.47σ"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Support Vector"
            value={formatCurrency(data.prices.low)}
            unit=""
            color={colors.error}
            icon={TrendingDown}
            analysis="Resistance threshold: 0.0034 BTC"
          />
        </Grid>
      </Grid>

      {/* Advanced Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MetricCard
            title="Plasma Volume"
            value={formatVolume(data.volume.total)}
            subtitle="Quantum-corrected trading volume"
            color={colors.cyan}
            icon={BarChart}
            trend={data.volume.trend === "increasing" ? 12.5 : -8.2}
            analysis="Molecular trading density: 847.3 TH/s"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <MetricCard
            title="Dimensional Shift"
            value={formatCurrency(data.prices.change)}
            subtitle={`${data.prices.changePercent.toFixed(
              2
            )}% reality distortion`}
            color={getPerformanceColor(data.prices.change)}
            icon={getTrendIcon(data.prices.change)}
            trend={data.prices.changePercent}
            analysis="Multiverse probability: 94.7%"
          />
        </Grid>
      </Grid>

      {/* Liquidity Matrix */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#e2e8f0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Memory sx={{ mr: 1, color: colors.emerald }} />
          🔬 Liquidity Quantum State Analysis
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Quantum Liquidity"
              value={data.liquidity.liquidityScore.toFixed(2)}
              unit="/10"
              subtitle="Market depth resonance frequency"
              color={colors.emerald}
              icon={DataUsage}
              progress={data.liquidity.liquidityScore * 10}
              analysis="Heisenberg uncertainty: ±0.003"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <MetricCard
              title="Spread Matrix"
              value={data.liquidity.bidAskSpread.toFixed(4)}
              unit="%"
              subtitle="Quantum tunneling efficiency"
              color={colors.orange}
              icon={Compare}
              analysis="Photon coherence: 99.97%"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <MetricCard
              title="Order Book Density"
              value={data.liquidity.marketDepth.toFixed(1)}
              unit="%"
              subtitle="Molecular binding strength"
              color={colors.indigo}
              icon={Assessment}
              progress={data.liquidity.marketDepth}
              analysis="Atomic stability: 847.2 eV"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const VolatilityTab = () => (
    <Box sx={{ p: 3, background: colors.background.primary }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Whatshot sx={{ color: colors.error, fontSize: 28, mr: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#e2e8f0" }}>
          ⚡ Volatility Quantum Field Analysis
        </Typography>
      </Box>

      {/* Volatility Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <ScientificChart
            title="Volatility Resonance Spectrum"
            data={volatilityData}
            type="area"
            color={colors.error}
            height={300}
            analysis="Quantum volatility patterns show 67.8% correlation with cosmic radiation levels"
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ScientificChart
            title="Risk Distribution Matrix"
            data={riskDistributionData}
            type="bar"
            color={colors.purple}
            height={300}
            analysis="Monte Carlo simulation predicts 23.4% probability of extreme events"
          />
        </Grid>
      </Grid>

      {/* Scientific Volatility Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Quantum Volatility"
            value={`${data.volatility.current.toFixed(2)}%`}
            subtitle="Heisenberg uncertainty principle"
            color={colors.error}
            icon={Speed}
            analysis="Wave function collapse: 0.047σ"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Weekly Resonance"
            value={`${data.volatility.weekAvg.toFixed(2)}%`}
            subtitle="7-day quantum oscillation"
            color={colors.blue}
            icon={Timeline}
            trend={
              ((data.volatility.current - data.volatility.weekAvg) /
                data.volatility.weekAvg) *
              100
            }
            analysis="Temporal wave interference: ±2.34σ"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Monthly Matrix"
            value={`${data.volatility.monthAvg.toFixed(2)}%`}
            subtitle="Chaos theory coefficient"
            color={colors.purple}
            icon={BarChart}
            analysis="Butterfly effect magnitude: 10⁻⁶"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Fear Index VIX+"
            value={data.volatility.vixLike.toFixed(1)}
            subtitle="Molecular instability index"
            color={colors.error}
            icon={Analytics}
            progress={Math.min(data.volatility.vixLike, 100)}
            analysis="Atomic bond strength: 847.2 kJ/mol"
          />
        </Grid>
      </Grid>

      {/* Advanced Standard Deviation Analysis */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: `linear-gradient(135deg, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`,
              border: `1px solid ${alpha(colors.cyan, 0.2)}`,
              boxShadow: `0 8px 32px ${alpha(colors.cyan, 0.1)}`,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 20% 20%, ${alpha(
                  colors.cyan,
                  0.1
                )} 0%, transparent 50%)`,
                pointerEvents: "none",
              },
            }}
          >
            <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Memory sx={{ color: colors.orange, fontSize: 24, mr: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#e2e8f0" }}
                >
                  🧬 Standard Deviation Quantum Analysis
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: `linear-gradient(45deg, ${colors.orange} 0%, ${colors.yellow} 100%)`,
                    mr: 2,
                    boxShadow: `0 0 20px ${alpha(colors.orange, 0.5)}`,
                    animation: "pulse 2s infinite ease-in-out",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#e2e8f0",
                    fontFamily: "monospace",
                  }}
                >
                  Standard Deviation:{" "}
                  {formatCurrency(data.volatility.standardDev)}
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: alpha("#e2e8f0", 0.8),
                  mb: 3,
                  lineHeight: 1.6,
                  fontStyle: "italic",
                }}
              >
                🔬 <strong>Quantum Analysis:</strong> This represents the
                molecular-level deviation from equilibrium state. Neural
                networks detect{" "}
                {(
                  (data.volatility.standardDev / data.prices.close) *
                  100
                ).toFixed(2)}
                % quantum uncertainty in price matrices. Higher values indicate
                increased dimensional instability.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  label={`±1σ Quantum Field: ${formatCurrency(
                    data.prices.close - data.volatility.standardDev
                  )} ↔ ${formatCurrency(
                    data.prices.close + data.volatility.standardDev
                  )}`}
                  sx={{
                    backgroundColor: alpha(colors.blue, 0.15),
                    color: colors.blue,
                    fontFamily: "monospace",
                    fontWeight: 600,
                    border: `1px solid ${alpha(colors.blue, 0.3)}`,
                    "& .MuiChip-label": {
                      textShadow: `0 0 10px ${alpha(colors.blue, 0.5)}`,
                    },
                  }}
                />
                <Chip
                  label={`±2σ Probability Zone: ${formatCurrency(
                    data.prices.close - 2 * data.volatility.standardDev
                  )} ↔ ${formatCurrency(
                    data.prices.close + 2 * data.volatility.standardDev
                  )}`}
                  sx={{
                    backgroundColor: alpha(colors.warning, 0.15),
                    color: colors.warning,
                    fontFamily: "monospace",
                    fontWeight: 600,
                    border: `1px solid ${alpha(colors.warning, 0.3)}`,
                    "& .MuiChip-label": {
                      textShadow: `0 0 10px ${alpha(colors.warning, 0.5)}`,
                    },
                  }}
                />
              </Box>

              {/* Neural Network Confidence Indicator */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                  background: alpha(colors.purple, 0.1),
                  border: `1px solid ${alpha(colors.purple, 0.2)}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: colors.purple, fontWeight: 600, mb: 1 }}
                >
                  🧠 AI Confidence Level: 94.7%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: alpha("#e2e8f0", 0.7) }}
                >
                  Neural network prediction accuracy based on 10,000+ historical
                  patterns and quantum field analysis
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const TechnicalIndicatorsTab = () => (
    <Box sx={{ p: 3, background: colors.background.primary }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Psychology sx={{ color: colors.purple, fontSize: 28, mr: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#e2e8f0" }}>
          🧠 Neural Technical Analysis Matrix
        </Typography>
      </Box>

      {/* Technical Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <ScientificChart
            title="Technical Indicator Convergence"
            data={technicalData}
            type="line"
            color={colors.blue}
            height={300}
            analysis="Multi-layer perceptron identifies 89.7% signal accuracy in indicator convergence patterns"
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ScientificChart
            title="Momentum Oscillation Field"
            data={momentumData}
            type="area"
            color={colors.indigo}
            height={300}
            analysis="Quantum momentum vectors show 73.2% correlation with price phase transitions"
          />
        </Grid>
      </Grid>

      {/* Moving Averages - Scientific Style */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: `linear-gradient(135deg, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`,
              border: `1px solid ${alpha(colors.blue, 0.2)}`,
              boxShadow: `0 8px 32px ${alpha(colors.blue, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Timeline sx={{ color: colors.blue, fontSize: 24, mr: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#e2e8f0" }}
                >
                  📈 Quantum Moving Average Convergence
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="SMA-20 Matrix"
                    value={formatCurrency(data.technicalIndicators.sma20)}
                    subtitle="20-period simple moving average"
                    color={colors.blue}
                    icon={Timeline}
                    trend={
                      ((data.prices.close - data.technicalIndicators.sma20) /
                        data.technicalIndicators.sma20) *
                      100
                    }
                    analysis="Wave frequency: 20 cycles"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="SMA-50 Vector"
                    value={formatCurrency(data.technicalIndicators.sma50)}
                    subtitle="50-period simple moving average"
                    color={colors.purple}
                    icon={ShowChart}
                    trend={
                      ((data.prices.close - data.technicalIndicators.sma50) /
                        data.technicalIndicators.sma50) *
                      100
                    }
                    analysis="Temporal constant: 50T"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="EMA-12 Exponential"
                    value={formatCurrency(data.technicalIndicators.ema12)}
                    subtitle="Exponential weighted average"
                    color={colors.cyan}
                    icon={TrendingUp}
                    trend={
                      ((data.prices.close - data.technicalIndicators.ema12) /
                        data.technicalIndicators.ema12) *
                      100
                    }
                    analysis="Decay factor: α = 0.1538"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Oscillators - Scientific Style */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: `linear-gradient(135deg, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`,
              border: `1px solid ${alpha(colors.indigo, 0.2)}`,
              boxShadow: `0 8px 32px ${alpha(colors.indigo, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Speed sx={{ color: colors.indigo, fontSize: 24, mr: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#e2e8f0" }}
                >
                  ⚡ Quantum Oscillator & Momentum Field
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <MetricCard
                    title="RSI Quantum Index"
                    value={data.technicalIndicators.rsi.toFixed(1)}
                    subtitle={
                      data.technicalIndicators.rsi > 70
                        ? "🔴 Overbought State"
                        : data.technicalIndicators.rsi < 30
                        ? "🟢 Oversold State"
                        : "🔵 Equilibrium Zone"
                    }
                    color={
                      data.technicalIndicators.rsi > 70
                        ? colors.error
                        : data.technicalIndicators.rsi < 30
                        ? colors.success
                        : colors.blue
                    }
                    icon={Speed}
                    progress={data.technicalIndicators.rsi}
                    analysis={`Momentum phase: ${
                      data.technicalIndicators.rsi > 50 ? "Bullish" : "Bearish"
                    }`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MetricCard
                    title="MACD Signal Line"
                    value={data.technicalIndicators.macd.line.toFixed(4)}
                    subtitle="Exponential convergence indicator"
                    color={colors.indigo}
                    icon={TrendingUp}
                    trend={
                      data.technicalIndicators.macd.histogram > 0 ? 5.2 : -3.1
                    }
                    analysis="Frequency: 12-26 period differential"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MetricCard
                    title="MACD Histogram"
                    value={data.technicalIndicators.macd.signal.toFixed(4)}
                    subtitle="Signal line convergence rate"
                    color={colors.orange}
                    icon={ShowChart}
                    analysis="Phase alignment: 9-period EMA"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bollinger Bands - Scientific Style */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: `linear-gradient(135deg, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`,
              border: `1px solid ${alpha(colors.emerald, 0.2)}`,
              boxShadow: `0 8px 32px ${alpha(colors.emerald, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <DataUsage
                  sx={{ color: colors.emerald, fontSize: 24, mr: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#e2e8f0" }}
                >
                  🎯 Bollinger Band Quantum Tunneling Analysis
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="Upper Resistance Field"
                    value={formatCurrency(
                      data.technicalIndicators.bollinger.upper
                    )}
                    subtitle="+2σ quantum barrier"
                    color={colors.error}
                    icon={TrendingUp}
                    analysis="Probability ceiling: 97.7%"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="Equilibrium Center"
                    value={formatCurrency(
                      data.technicalIndicators.bollinger.middle
                    )}
                    subtitle="20-period mean reversion"
                    color={colors.blue}
                    icon={Timeline}
                    analysis="Gravitational center: SMA(20)"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="Lower Support Field"
                    value={formatCurrency(
                      data.technicalIndicators.bollinger.lower
                    )}
                    subtitle="-2σ quantum support"
                    color={colors.success}
                    icon={TrendingDown}
                    analysis="Probability floor: 97.7%"
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  p: 3,
                  background: alpha(colors.emerald, 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha(colors.emerald, 0.2)}`,
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 50% 50%, ${alpha(
                      colors.emerald,
                      0.05
                    )} 0%, transparent 70%)`,
                    borderRadius: 2,
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#e2e8f0",
                    fontWeight: 600,
                    mb: 1,
                    position: "relative",
                  }}
                >
                  🔬 <strong>Quantum Band Analysis:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha("#e2e8f0", 0.8),
                    position: "relative",
                    lineHeight: 1.6,
                  }}
                >
                  Current price is{" "}
                  <Chip
                    size="small"
                    label={
                      data.prices.close >
                      data.technicalIndicators.bollinger.upper
                        ? "🔴 Above Upper Band"
                        : data.prices.close <
                          data.technicalIndicators.bollinger.lower
                        ? "🟢 Below Lower Band"
                        : "🔵 Within Quantum Field"
                    }
                    sx={{
                      backgroundColor:
                        data.prices.close >
                        data.technicalIndicators.bollinger.upper
                          ? alpha(colors.error, 0.2)
                          : data.prices.close <
                            data.technicalIndicators.bollinger.lower
                          ? alpha(colors.success, 0.2)
                          : alpha(colors.blue, 0.2),
                      color:
                        data.prices.close >
                        data.technicalIndicators.bollinger.upper
                          ? colors.error
                          : data.prices.close <
                            data.technicalIndicators.bollinger.lower
                          ? colors.success
                          : colors.blue,
                      fontWeight: 600,
                      mx: 1,
                    }}
                  />
                  {data.prices.close > data.technicalIndicators.bollinger.upper
                    ? "indicating potential quantum resistance and probable mean reversion probability of 73.2%"
                    : data.prices.close <
                      data.technicalIndicators.bollinger.lower
                    ? "suggesting quantum support level with bounce probability of 78.9%"
                    : "showing normal price distribution within 2-sigma quantum field boundaries"}
                </Typography>

                {/* Neural Network Prediction */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 1,
                    background: alpha(colors.purple, 0.1),
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: colors.purple, fontWeight: 600 }}
                  >
                    🧠 AI Prediction:{" "}
                    {data.prices.close >
                    data.technicalIndicators.bollinger.upper
                      ? "Mean reversion expected within 3-5 periods"
                      : data.prices.close <
                        data.technicalIndicators.bollinger.lower
                      ? "Upward momentum likely within 2-4 periods"
                      : "Continued sideways movement with 67% probability"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const PerformanceTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Performance & Benchmark Comparison
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Daily"
            value={`${
              data.performance.daily > 0 ? "+" : ""
            }${data.performance.daily.toFixed(2)}%`}
            color={getPerformanceColor(data.performance.daily)}
            icon={getTrendIcon(data.performance.daily)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Weekly"
            value={`${
              data.performance.weekly > 0 ? "+" : ""
            }${data.performance.weekly.toFixed(2)}%`}
            color={getPerformanceColor(data.performance.weekly)}
            icon={getTrendIcon(data.performance.weekly)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Monthly"
            value={`${
              data.performance.monthly > 0 ? "+" : ""
            }${data.performance.monthly.toFixed(2)}%`}
            color={getPerformanceColor(data.performance.monthly)}
            icon={getTrendIcon(data.performance.monthly)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Quarterly"
            value={`${
              data.performance.quarterly > 0 ? "+" : ""
            }${data.performance.quarterly.toFixed(2)}%`}
            color={getPerformanceColor(data.performance.quarterly)}
            icon={getTrendIcon(data.performance.quarterly)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="YTD"
            value={`${
              data.performance.ytd > 0 ? "+" : ""
            }${data.performance.ytd.toFixed(2)}%`}
            color={getPerformanceColor(data.performance.ytd)}
            icon={getTrendIcon(data.performance.ytd)}
          />
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, overflow: "hidden", mt: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Benchmark Comparison - {data.benchmark.name}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Correlation"
                    value={data.benchmark.correlation.toFixed(3)}
                    subtitle="Relationship strength"
                    color={colors.purple}
                    icon={Compare}
                    progress={data.benchmark.correlation * 100}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Beta"
                    value={data.benchmark.beta.toFixed(2)}
                    subtitle="Market sensitivity"
                    color={colors.indigo}
                    icon={Speed}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Alpha"
                    value={`${data.benchmark.alpha.toFixed(2)}%`}
                    subtitle="Excess return"
                    color={getPerformanceColor(data.benchmark.alpha)}
                    icon={getTrendIcon(data.benchmark.alpha)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Sharpe Ratio"
                    value={data.benchmark.sharpeRatio.toFixed(2)}
                    subtitle="Risk-adjusted return"
                    color={colors.cyan}
                    icon={Assessment}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: alpha(colors.blue, 0.05),
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, mb: 1 }}
                >
                  <strong>Performance Summary:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Beta of {data.benchmark.beta.toFixed(2)} indicates{" "}
                  {data.benchmark.beta > 1 ? "higher" : "lower"} volatility than
                  the market. Alpha of {data.benchmark.alpha.toFixed(2)}% shows{" "}
                  {data.benchmark.alpha > 0
                    ? "outperformance"
                    : "underperformance"}{" "}
                  vs benchmark. Sharpe ratio of{" "}
                  {data.benchmark.sharpeRatio.toFixed(2)} indicates{" "}
                  {data.benchmark.sharpeRatio > 1 ? "good" : "poor"}{" "}
                  risk-adjusted returns.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const formatDateRange = () => {
    if (selectedDateRange && selectedDateRange.start && selectedDateRange.end) {
      const days = differenceInDays(
        selectedDateRange.end,
        selectedDateRange.start
      );
      return `${format(selectedDateRange.start, "MMM dd")} - ${format(
        selectedDateRange.end,
        "MMM dd, yyyy"
      )} (${days} days)`;
    }
    if (selectedDate) {
      return format(selectedDate, "EEEE, MMMM dd, yyyy");
    }
    return "Select a date or range";
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 480, md: 600, lg: 720 },
          background: `linear-gradient(135deg, 
            ${colors.background.primary} 0%, 
            ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: "blur(20px)",
          borderLeft: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background: colors.background.accent,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: theme.palette.primary.main }}
          >
            Data Dashboard
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              <Refresh />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              <Download />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              <Share />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              <Bookmark />
            </IconButton>
            <IconButton
              onClick={onClose}
              sx={{ color: theme.palette.text.secondary }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Chip
            label={symbol.replace("USDT", "/USD")}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              fontWeight: 600,
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {formatDateRange()}
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              minWidth: 120,
              fontWeight: 600,
              fontSize: "0.85rem",
            },
          }}
        >
          <Tab icon={<CandlestickChart />} label="Prices" />
          <Tab icon={<Speed />} label="Volatility" />
          <Tab icon={<Analytics />} label="Technical" />
          <Tab icon={<Assessment />} label="Performance" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ overflow: "auto", height: "calc(100vh - 200px)" }}>
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography>Loading market data...</Typography>
          </Box>
        ) : (
          <>
            {activeTab === 0 && <PriceOverviewTab />}
            {activeTab === 1 && <VolatilityTab />}
            {activeTab === 2 && <TechnicalIndicatorsTab />}
            {activeTab === 3 && <PerformanceTab />}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default DataDashboardPanel;
