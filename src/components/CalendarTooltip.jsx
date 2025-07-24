import React from "react";
import { Box, Typography, Paper, Divider, Chip, Grid } from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart,
  BarChart,
  Timeline,
} from "@mui/icons-material";
import { format } from "date-fns";

/**
 * Enhanced tooltip component for calendar cells with detailed metrics
 * @param {Object} props - Component props
 * @returns {React.Component} CalendarTooltip component
 */
const CalendarTooltip = ({
  date,
  cellData,
  symbol = "BTCUSDT",
  isOpen = false,
  anchorEl = null,
  onClose = () => {},
}) => {
  if (!cellData || !isOpen) return null;

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

  // Price change indicator
  const PriceIcon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
      ? TrendingDown
      : TrendingFlat;
  const priceColor =
    direction === "up"
      ? "#4caf50"
      : direction === "down"
      ? "#f44336"
      : "#9e9e9e";

  // Volatility level
  const getVolatilityLevel = (vol) => {
    if (vol < 2) return { label: "Low", color: "#4caf50" };
    if (vol < 5) return { label: "Medium", color: "#ff9800" };
    return { label: "High", color: "#f44336" };
  };

  const volatilityInfo = getVolatilityLevel(volatility);

  // Volume classification
  const getVolumeLevel = (vol) => {
    if (vol < 1000000) return { label: "Low", color: "#9e9e9e" };
    if (vol < 10000000) return { label: "Medium", color: "#2196f3" };
    return { label: "High", color: "#4caf50" };
  };

  const volumeInfo = getVolumeLevel(volume);

  return (
    <Paper
      elevation={8}
      sx={{
        position: "absolute",
        zIndex: 9999,
        p: 2,
        minWidth: 320,
        maxWidth: 400,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[8],
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {symbol}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {format(date, "EEEE, MMMM dd, yyyy")}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Price Information */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
          📈 Price Information
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Open
            </Typography>
            <Typography variant="body2">${open.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Close
            </Typography>
            <Typography variant="body2">${close.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              High
            </Typography>
            <Typography variant="body2" color="success.main">
              ${high.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Low
            </Typography>
            <Typography variant="body2" color="error.main">
              ${low.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        {/* Price Change */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <PriceIcon sx={{ color: priceColor, mr: 0.5, fontSize: 16 }} />
          <Typography
            variant="body2"
            sx={{ color: priceColor, fontWeight: "bold" }}
          >
            {priceChange > 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Market Metrics */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
          📊 Market Metrics
        </Typography>

        {/* Volatility */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ShowChart
              sx={{ mr: 0.5, fontSize: 16, color: "text.secondary" }}
            />
            <Typography variant="body2">Volatility</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">{volatility.toFixed(2)}%</Typography>
            <Chip
              label={volatilityInfo.label}
              size="small"
              sx={{
                backgroundColor: volatilityInfo.color,
                color: "white",
                fontSize: "0.7rem",
                height: 20,
              }}
            />
          </Box>
        </Box>

        {/* Volume */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BarChart sx={{ mr: 0.5, fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">Volume</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">{volume.toLocaleString()}</Typography>
            <Chip
              label={volumeInfo.label}
              size="small"
              sx={{
                backgroundColor: volumeInfo.color,
                color: "white",
                fontSize: "0.7rem",
                height: 20,
              }}
            />
          </Box>
        </Box>

        {/* Liquidity Score */}
        {liquidity.volumeNormalized && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Timeline
                sx={{ mr: 0.5, fontSize: 16, color: "text.secondary" }}
              />
              <Typography variant="body2">Liquidity Score</Typography>
            </Box>
            <Typography variant="body2">
              {liquidity.volumeNormalized.toFixed(2)}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Additional Info */}
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Click for detailed analysis • Drag to select range
        </Typography>
      </Box>
    </Paper>
  );
};

export default CalendarTooltip;
