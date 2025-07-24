import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  BarChart,
  Timeline,
  Close,
} from "@mui/icons-material";
import { format, differenceInDays } from "date-fns";

/**
 * Detailed breakdown modal/panel for specific dates
 * @param {Object} props - Component props
 * @returns {React.Component} DateDetailPanel component
 */
const DateDetailPanel = ({
  date,
  cellData,
  symbol = "BTCUSDT",
  isOpen = false,
  onClose = () => {},
  historicalData = [],
}) => {
  if (!isOpen || !cellData) return null;

  const {
    open = 0,
    high = 0,
    low = 0,
    close = 0,
    volume = 0,
    volatility = 0,
    performance = {},
    liquidity = {},
  } = cellData;

  const priceChange = performance.priceChange || 0;
  const direction = performance.direction || "neutral";

  // Calculate additional metrics
  const priceRange = high - low;
  const midPrice = (high + low) / 2;
  const openCloseRange = Math.abs(close - open);
  const bodyPercentage = (openCloseRange / priceRange) * 100;

  // Get recent performance for comparison
  const getRecentPerformance = () => {
    if (historicalData.length < 7) return null;

    const recentData = historicalData.slice(-7);
    const weeklyChange =
      ((close - recentData[0].close) / recentData[0].close) * 100;
    const avgVolatility =
      recentData.reduce((sum, d) => sum + (d.volatility || 0), 0) /
      recentData.length;

    return {
      weeklyChange,
      avgVolatility,
      trend:
        weeklyChange > 0 ? "bullish" : weeklyChange < 0 ? "bearish" : "neutral",
    };
  };

  const recentPerformance = getRecentPerformance();

  // Support and resistance levels
  const getSupportResistance = () => {
    if (historicalData.length < 20) return null;

    const prices = historicalData.slice(-20).map((d) => d.close);
    const highs = historicalData.slice(-20).map((d) => d.high);
    const lows = historicalData.slice(-20).map((d) => d.low);

    const resistance = Math.max(...highs);
    const support = Math.min(...lows);

    return { support, resistance };
  };

  const levels = getSupportResistance();

  // Market sentiment based on price action
  const getMarketSentiment = () => {
    const bodySize = bodyPercentage;
    const wickSize = 100 - bodySize;

    if (direction === "up" && bodySize > 70)
      return { label: "Very Bullish", color: "#4caf50" };
    if (direction === "up" && bodySize > 40)
      return { label: "Bullish", color: "#8bc34a" };
    if (direction === "down" && bodySize > 70)
      return { label: "Very Bearish", color: "#f44336" };
    if (direction === "down" && bodySize > 40)
      return { label: "Bearish", color: "#ff5722" };
    if (wickSize > 60) return { label: "Indecisive", color: "#ff9800" };
    return { label: "Neutral", color: "#9e9e9e" };
  };

  const sentiment = getMarketSentiment();

  return (
    <Paper
      elevation={12}
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: 800,
        maxHeight: "90vh",
        overflow: "auto",
        zIndex: 10000,
        backgroundColor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {symbol} Detailed Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {format(date, "EEEE, MMMM dd, yyyy")}
          </Typography>
        </Box>
        <Box
          onClick={onClose}
          sx={{
            cursor: "pointer",
            p: 1,
            borderRadius: 1,
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <Close />
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Price Action Panel */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                📈 Price Action
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Open
                  </Typography>
                  <Typography variant="h6">${open.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Close
                  </Typography>
                  <Typography variant="h6">${close.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    High
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    ${high.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Low
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    ${low.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Daily Change
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  {direction === "up" ? (
                    <TrendingUp color="success" />
                  ) : direction === "down" ? (
                    <TrendingDown color="error" />
                  ) : (
                    <ShowChart color="disabled" />
                  )}
                  <Typography
                    variant="h5"
                    sx={{
                      ml: 1,
                      color:
                        direction === "up"
                          ? "success.main"
                          : direction === "down"
                          ? "error.main"
                          : "text.secondary",
                      fontWeight: "bold",
                    }}
                  >
                    {priceChange > 0 ? "+" : ""}
                    {priceChange.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Price Range
                </Typography>
                <Typography variant="body1">
                  ${priceRange.toFixed(2)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={bodyPercentage}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Body: {bodyPercentage.toFixed(1)}% | Wicks:{" "}
                  {(100 - bodyPercentage).toFixed(1)}%
                </Typography>
              </Box>
            </Paper>

            {/* Market Sentiment */}
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                🎯 Market Sentiment
              </Typography>
              <Chip
                label={sentiment.label}
                sx={{
                  backgroundColor: sentiment.color,
                  color: "white",
                  fontWeight: "bold",
                  mb: 2,
                }}
              />

              {levels && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Support & Resistance
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="caption" color="error.main">
                        Support
                      </Typography>
                      <Typography variant="body2">
                        ${levels.support.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="success.main">
                        Resistance
                      </Typography>
                      <Typography variant="body2">
                        ${levels.resistance.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Volume & Liquidity Panel */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                📊 Volume & Liquidity
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Trading Volume
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {volume.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Volume/Price Ratio
                </Typography>
                <Typography variant="h6">
                  {liquidity.volumeNormalized?.toFixed(2) || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Volatility
                </Typography>
                <Typography variant="h6">{volatility.toFixed(2)}%</Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(volatility * 10, 100)}
                  color={
                    volatility < 2
                      ? "success"
                      : volatility < 5
                      ? "warning"
                      : "error"
                  }
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </Box>
            </Paper>

            {/* Recent Performance */}
            {recentPerformance && (
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  📈 Recent Performance
                </Typography>

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Timeline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="7-Day Change"
                      secondary={`${
                        recentPerformance.weeklyChange > 0 ? "+" : ""
                      }${recentPerformance.weeklyChange.toFixed(2)}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ShowChart fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Avg Volatility"
                      secondary={`${recentPerformance.avgVolatility.toFixed(
                        2
                      )}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {recentPerformance.trend === "bullish" ? (
                        <TrendingUp fontSize="small" color="success" />
                      ) : recentPerformance.trend === "bearish" ? (
                        <TrendingDown fontSize="small" color="error" />
                      ) : (
                        <ShowChart fontSize="small" color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Trend"
                      secondary={
                        recentPerformance.trend.charAt(0).toUpperCase() +
                        recentPerformance.trend.slice(1)
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DateDetailPanel;
