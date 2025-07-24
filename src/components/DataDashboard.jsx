import React, { useState, useMemo } from "react";
import {
  Drawer,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";

const DataDashboard = ({
  open,
  onClose,
  selectedData,
  historicalData = [],
  benchmarkData = [],
  technicalIndicators = {},
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate technical indicators if not provided
  const calculatedIndicators = useMemo(() => {
    if (!historicalData || historicalData.length < 20) return {};

    const prices = historicalData.map((d) => d.close);
    const volumes = historicalData.map((d) => d.volume);

    return {
      sma20: calculateSMA(prices, 20),
      sma50: calculateSMA(prices, 50),
      rsi: calculateRSI(prices, 14),
      bollinger: calculateBollingerBands(prices, 20),
      macd: calculateMACD(prices),
      volumeProfile: calculateVolumeProfile(volumes),
      volatility: calculateVolatility(prices),
      ...technicalIndicators,
    };
  }, [historicalData, technicalIndicators]);

  if (!selectedData) return null;

  const priceChange = selectedData.close - selectedData.open;
  const priceChangePercent = (priceChange / selectedData.open) * 100;
  const isPositive = priceChange >= 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "600px", md: "800px" },
          bgcolor: "background.paper",
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Data Dashboard
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" color="textSecondary">
            {format(new Date(selectedData.date), "EEEE, MMMM dd, yyyy")}
          </Typography>
        </Box>

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, px: 2 }}>
          <Box sx={{ display: "flex", gap: 1, py: 1 }}>
            {[
              { id: "overview", label: "Overview", icon: <AssessmentIcon /> },
              { id: "technical", label: "Technical", icon: <ShowChartIcon /> },
              {
                id: "performance",
                label: "Performance",
                icon: <TimelineIcon />,
              },
              { id: "risk", label: "Risk Metrics", icon: <SpeedIcon /> },
            ].map((tab) => (
              <Chip
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "filled" : "outlined"}
                color={activeTab === tab.id ? "primary" : "default"}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {activeTab === "overview" && (
            <OverviewTab
              data={selectedData}
              priceChange={priceChange}
              priceChangePercent={priceChangePercent}
              isPositive={isPositive}
            />
          )}
          {activeTab === "technical" && (
            <TechnicalTab
              data={selectedData}
              indicators={calculatedIndicators}
              historicalData={historicalData}
            />
          )}
          {activeTab === "performance" && (
            <PerformanceTab
              data={selectedData}
              historicalData={historicalData}
              benchmarkData={benchmarkData}
            />
          )}
          {activeTab === "risk" && (
            <RiskMetricsTab
              data={selectedData}
              indicators={calculatedIndicators}
              historicalData={historicalData}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

// Overview Tab Component
const OverviewTab = ({ data, priceChange, priceChangePercent, isPositive }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {/* Price Summary Card */}
      <Grid item xs={12}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Price Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Open
                  </Typography>
                  <Typography variant="h6">${data.open?.toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Close
                  </Typography>
                  <Typography variant="h6">
                    ${data.close?.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    High
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    ${data.high?.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Low
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    ${data.low?.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isPositive ? (
                <TrendingUpIcon color="success" />
              ) : (
                <TrendingDownIcon color="error" />
              )}
              <Typography
                variant="h6"
                color={isPositive ? "success.main" : "error.main"}
              >
                {isPositive ? "+" : ""}${priceChange.toFixed(2)} (
                {priceChangePercent.toFixed(2)}%)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Volume & Liquidity Metrics */}
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Volume & Liquidity
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Total Volume
              </Typography>
              <Typography variant="h5">{formatVolume(data.volume)}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Volume Percentile
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={data.volumePercentile || 50}
                  sx={{ flex: 1, height: 8, borderRadius: 1 }}
                />
                <Typography variant="body2">
                  {(data.volumePercentile || 50).toFixed(0)}%
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Liquidity Score
              </Typography>
              <Typography variant="h6" color="primary.main">
                {calculateLiquidityScore(data).toFixed(1)}/10
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Volatility Metrics */}
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Volatility Metrics
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Daily Volatility
              </Typography>
              <Typography
                variant="h5"
                color={getVolatilityColor(data.volatility)}
              >
                {data.volatility?.toFixed(2)}%
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Price Range
              </Typography>
              <Typography variant="body1">
                ${(data.high - data.low).toFixed(2)} (
                {(((data.high - data.low) / data.open) * 100).toFixed(2)}%)
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Volatility Rating
              </Typography>
              <Chip
                label={getVolatilityRating(data.volatility)}
                color={getVolatilityChipColor(data.volatility)}
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Technical Analysis Tab
const TechnicalTab = ({ data, indicators, historicalData }) => {
  const chartData = historicalData.slice(-30).map((item, index) => ({
    date: format(new Date(item.date), "MM/dd"),
    price: item.close,
    sma20: indicators.sma20?.[index],
    sma50: indicators.sma50?.[index],
    volume: item.volume,
  }));

  return (
    <Grid container spacing={3}>
      {/* Price Chart with Moving Averages */}
      <Grid item xs={12}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Price Chart with Moving Averages
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#1976d2"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="#ff9800"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="#f44336"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Technical Indicators Table */}
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Technical Indicators
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Indicator</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Signal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>RSI (14)</TableCell>
                    <TableCell align="right">
                      {indicators.rsi?.toFixed(2) || "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={getRSISignal(indicators.rsi)}
                        size="small"
                        color={getRSISignalColor(indicators.rsi)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SMA 20</TableCell>
                    <TableCell align="right">
                      ${indicators.sma20?.toFixed(2) || "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={
                          data.close > indicators.sma20 ? "Bullish" : "Bearish"
                        }
                        size="small"
                        color={
                          data.close > indicators.sma20 ? "success" : "error"
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SMA 50</TableCell>
                    <TableCell align="right">
                      ${indicators.sma50?.toFixed(2) || "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={
                          data.close > indicators.sma50 ? "Bullish" : "Bearish"
                        }
                        size="small"
                        color={
                          data.close > indicators.sma50 ? "success" : "error"
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>MACD</TableCell>
                    <TableCell align="right">
                      {indicators.macd?.toFixed(4) || "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={indicators.macd > 0 ? "Bullish" : "Bearish"}
                        size="small"
                        color={indicators.macd > 0 ? "success" : "error"}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Volume Profile */}
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Volume Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#9c27b0"
                  fill="#9c27b0"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Performance Comparison Tab
const PerformanceTab = ({ data, historicalData, benchmarkData }) => {
  const performanceMetrics = useMemo(() => {
    if (!historicalData || historicalData.length < 2) return {};

    const returns = historicalData.slice(-30).map((item, index, arr) => {
      if (index === 0) return 0;
      return (item.close - arr[index - 1].close) / arr[index - 1].close;
    });

    return {
      totalReturn:
        ((data.close - historicalData[0].close) / historicalData[0].close) *
        100,
      sharpeRatio: calculateSharpeRatio(returns),
      maxDrawdown: calculateMaxDrawdown(historicalData),
      volatility: calculateVolatility(historicalData.map((d) => d.close)),
      avgReturn:
        (returns.reduce((sum, r) => sum + r, 0) / returns.length) * 100,
    };
  }, [data, historicalData]);

  return (
    <Grid container spacing={3}>
      {/* Performance Summary */}
      <Grid item xs={12}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Summary (30 Days)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main">
                    {performanceMetrics.totalReturn?.toFixed(2) || "0.00"}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Return
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {performanceMetrics.sharpeRatio?.toFixed(2) || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sharpe Ratio
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="error.main">
                    {performanceMetrics.maxDrawdown?.toFixed(2) || "0.00"}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Max Drawdown
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {performanceMetrics.avgReturn?.toFixed(2) || "0.00"}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Daily Return
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Chart */}
      <Grid item xs={12}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cumulative Returns
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={historicalData.slice(-30).map((item, index, arr) => ({
                  date: format(new Date(item.date), "MM/dd"),
                  cumReturn:
                    index === 0
                      ? 0
                      : ((item.close - arr[0].close) / arr[0].close) * 100,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cumReturn"
                  stroke="#1976d2"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Risk Metrics Tab
const RiskMetricsTab = ({ data, indicators, historicalData }) => {
  const riskMetrics = useMemo(() => {
    if (!historicalData || historicalData.length < 10) return {};

    const returns = historicalData.slice(-30).map((item, index, arr) => {
      if (index === 0) return 0;
      return (item.close - arr[index - 1].close) / arr[index - 1].close;
    });

    return {
      var95: calculateVaR(returns, 0.95),
      var99: calculateVaR(returns, 0.99),
      beta: calculateBeta(returns),
      downside: calculateDownsideDeviation(returns),
      calmar: calculateCalmarRatio(
        returns,
        calculateMaxDrawdown(historicalData)
      ),
    };
  }, [data, historicalData]);

  return (
    <Grid container spacing={3}>
      {/* Risk Overview */}
      <Grid item xs={12}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Analysis
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "error.light",
                    borderRadius: 1,
                    color: "error.contrastText",
                  }}
                >
                  <Typography variant="h6">Value at Risk (95%)</Typography>
                  <Typography variant="h4">
                    {(riskMetrics.var95 * 100)?.toFixed(2) || "N/A"}%
                  </Typography>
                  <Typography variant="body2">
                    Maximum expected loss (95% confidence)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "warning.light",
                    borderRadius: 1,
                    color: "warning.contrastText",
                  }}
                >
                  <Typography variant="h6">Downside Deviation</Typography>
                  <Typography variant="h4">
                    {(riskMetrics.downside * 100)?.toFixed(2) || "N/A"}%
                  </Typography>
                  <Typography variant="body2">
                    Volatility of negative returns
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Detailed Risk Metrics */}
      <Grid item xs={12}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Metrics Detail
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>VaR (99%)</TableCell>
                    <TableCell align="right">
                      {(riskMetrics.var99 * 100)?.toFixed(2) || "N/A"}%
                    </TableCell>
                    <TableCell>
                      Maximum expected loss (99% confidence)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Beta</TableCell>
                    <TableCell align="right">
                      {riskMetrics.beta?.toFixed(2) || "N/A"}
                    </TableCell>
                    <TableCell>Correlation with market movements</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Calmar Ratio</TableCell>
                    <TableCell align="right">
                      {riskMetrics.calmar?.toFixed(2) || "N/A"}
                    </TableCell>
                    <TableCell>Return vs maximum drawdown</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Volatility</TableCell>
                    <TableCell align="right">
                      {data.volatility?.toFixed(2) || "N/A"}%
                    </TableCell>
                    <TableCell>Daily price volatility</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Utility Functions
const formatVolume = (volume) => {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
  return volume?.toFixed(0) || "0";
};

const calculateLiquidityScore = (data) => {
  const volumeScore = Math.min((data.volumePercentile || 50) / 10, 5);
  const spreadScore = Math.max(5 - (data.volatility || 5), 1);
  return volumeScore + spreadScore;
};

const getVolatilityColor = (volatility) => {
  if (volatility > 5) return "error.main";
  if (volatility > 2) return "warning.main";
  return "success.main";
};

const getVolatilityRating = (volatility) => {
  if (volatility > 10) return "Extreme";
  if (volatility > 5) return "High";
  if (volatility > 2) return "Moderate";
  return "Low";
};

const getVolatilityChipColor = (volatility) => {
  if (volatility > 5) return "error";
  if (volatility > 2) return "warning";
  return "success";
};

// Technical Analysis Functions
const calculateSMA = (prices, period) => {
  if (!prices || prices.length < period) return null;

  const sums = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sums.push(sum / period);
  }
  return sums[sums.length - 1];
};

const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length < period + 1) return null;

  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map((change) => (change > 0 ? change : 0));
  const losses = changes.map((change) => (change < 0 ? -change : 0));

  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
};

const calculateMACD = (prices) => {
  if (!prices || prices.length < 26) return null;

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  if (!ema12 || !ema26) return null;
  return ema12 - ema26;
};

const calculateEMA = (prices, period) => {
  if (!prices || prices.length < period) return null;

  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
};

const calculateBollingerBands = (prices, period = 20) => {
  if (!prices || prices.length < period) return null;

  const sma = calculateSMA(prices, period);
  const squaredDiffs = prices
    .slice(-period)
    .map((price) => Math.pow(price - sma, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
  const stdDev = Math.sqrt(variance);

  return {
    upper: sma + stdDev * 2,
    middle: sma,
    lower: sma - stdDev * 2,
  };
};

const calculateVolumeProfile = (volumes) => {
  if (!volumes || volumes.length === 0) return null;

  const avg = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const max = Math.max(...volumes);
  const min = Math.min(...volumes);

  return { avg, max, min, current: volumes[volumes.length - 1] };
};

const calculateVolatility = (prices) => {
  if (!prices || prices.length < 2) return 0;

  const returns = prices
    .slice(1)
    .map((price, i) => (price - prices[i]) / prices[i]);
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
    returns.length;

  return Math.sqrt(variance) * 100;
};

const calculateSharpeRatio = (returns, riskFreeRate = 0.02 / 365) => {
  if (!returns || returns.length === 0) return null;

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const excessReturn = avgReturn - riskFreeRate;
  const stdDev = Math.sqrt(
    returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) /
      returns.length
  );

  return stdDev === 0 ? 0 : excessReturn / stdDev;
};

const calculateMaxDrawdown = (historicalData) => {
  if (!historicalData || historicalData.length < 2) return 0;

  let maxDrawdown = 0;
  let peak = historicalData[0].close;

  for (let i = 1; i < historicalData.length; i++) {
    const price = historicalData[i].close;
    if (price > peak) {
      peak = price;
    } else {
      const drawdown = (peak - price) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }

  return maxDrawdown * 100;
};

const calculateVaR = (returns, confidence) => {
  if (!returns || returns.length === 0) return null;

  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sortedReturns.length);

  return sortedReturns[index] || 0;
};

const calculateBeta = (returns, marketReturns = null) => {
  // Simplified beta calculation (would need market data for accurate calculation)
  if (!returns || returns.length === 0) return 1;

  const variance =
    returns.reduce((sum, ret, i, arr) => {
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      return sum + Math.pow(ret - mean, 2);
    }, 0) / returns.length;

  // Approximate beta based on volatility (1 = market volatility)
  const marketVolatility = 0.02; // Assume 2% daily market volatility
  const assetVolatility = Math.sqrt(variance);

  return assetVolatility / marketVolatility;
};

const calculateDownsideDeviation = (returns) => {
  if (!returns || returns.length === 0) return null;

  const negativeReturns = returns.filter((ret) => ret < 0);
  if (negativeReturns.length === 0) return 0;

  const mean =
    negativeReturns.reduce((a, b) => a + b, 0) / negativeReturns.length;
  const variance =
    negativeReturns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
    negativeReturns.length;

  return Math.sqrt(variance);
};

const calculateCalmarRatio = (returns, maxDrawdown) => {
  if (!returns || returns.length === 0 || !maxDrawdown || maxDrawdown === 0)
    return null;

  const annualizedReturn =
    (returns.reduce((a, b) => a + b, 0) / returns.length) * 365;
  return annualizedReturn / (maxDrawdown / 100);
};

const getRSISignal = (rsi) => {
  if (!rsi) return "N/A";
  if (rsi > 70) return "Overbought";
  if (rsi < 30) return "Oversold";
  return "Neutral";
};

const getRSISignalColor = (rsi) => {
  if (!rsi) return "default";
  if (rsi > 70) return "error";
  if (rsi < 30) return "success";
  return "default";
};

export default DataDashboard;
