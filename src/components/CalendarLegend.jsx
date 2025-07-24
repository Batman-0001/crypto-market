import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Grid,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart,
  BarChart,
  Circle,
} from "@mui/icons-material";
import {
  getVolatilityLegend,
  getPerformanceLegend,
  COLOR_PALETTES,
} from "../utils/colorUtils";

/**
 * Calendar legend component showing data visualization explanations
 * @param {Object} props - Component props
 * @returns {React.Component} CalendarLegend component
 */
const CalendarLegend = ({
  showVolatilityHeatmap = true,
  showLiquidityIndicators = true,
  showPerformanceMetrics = true,
  isCompact = false,
  dataRanges = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(!isCompact);

  // Get legend data
  const volatilityLegend = getVolatilityLegend();
  const performanceLegend = getPerformanceLegend();

  // Liquidity patterns
  const liquidityPatterns = [
    { pattern: "dots", label: "Low Volume", intensity: 0.3 },
    { pattern: "dots", label: "Medium Volume", intensity: 0.6 },
    { pattern: "dots", label: "High Volume", intensity: 1.0 },
  ];

  // Volume indicator examples
  const volumeIndicators = [
    { width: 5, opacity: 0.3, label: "Low" },
    { width: 10, opacity: 0.6, label: "Medium" },
    { width: 15, opacity: 1.0, label: "High" },
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderVolatilitySection = () => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <ShowChart sx={{ mr: 1, fontSize: "18px", color: "#1976d2" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          Volatility Heatmap
        </Typography>
      </Box>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {volatilityLegend.map((item, index) => (
          <Grid item xs={4} key={index}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: item.color,
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                }}
              />
              <Typography variant="caption">{item.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" color="text.secondary">
        Background color intensity indicates volatility level
      </Typography>
    </Box>
  );

  const renderPerformanceSection = () => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <TrendingUp sx={{ mr: 1, fontSize: "18px", color: "#4caf50" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          Performance Metrics
        </Typography>
      </Box>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {performanceLegend.map((item, index) => (
          <Grid item xs={4} key={index}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 3,
                  height: 16,
                  backgroundColor: item.color,
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="caption" sx={{ fontSize: "16px" }}>
                {item.symbol}
              </Typography>
              <Typography variant="caption">{item.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" color="text.secondary">
        Left border color and arrow show price direction
      </Typography>
    </Box>
  );

  const renderLiquiditySection = () => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <BarChart sx={{ mr: 1, fontSize: "18px", color: "#2196f3" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          Liquidity Indicators
        </Typography>
      </Box>

      {/* Dot patterns */}
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
        >
          Background Patterns:
        </Typography>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {liquidityPatterns.map((item, index) => (
            <Grid item xs={4} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundImage: `radial-gradient(circle at 2px 2px, #2196f3${Math.floor(
                      item.intensity * 255
                    )
                      .toString(16)
                      .padStart(2, "0")} 1px, transparent 1px)`,
                    backgroundSize: "4px 4px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="caption">{item.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Volume bars */}
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
        >
          Volume Bars:
        </Typography>
        <Grid container spacing={1}>
          {volumeIndicators.map((item, index) => (
            <Grid item xs={4} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: `${item.width}px`,
                    height: 3,
                    backgroundColor: "#2196f3",
                    opacity: item.opacity,
                    borderRadius: 1,
                  }}
                />
                <Typography variant="caption">{item.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography variant="caption" color="text.secondary">
        Dot density and bar width show trading volume
      </Typography>
    </Box>
  );

  const renderSpecialIndicators = () => (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        Special Indicators
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Circle sx={{ fontSize: "8px", color: "#f44336" }} />
            <Typography variant="caption">Today</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                border: "2px solid #1976d2",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Focused</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const renderDataRanges = () => {
    if (!dataRanges) return null;

    return (
      <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
          Current Data Ranges
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="caption" display="block">
              Volatility: {dataRanges.volatilityRange.min.toFixed(1)}% -{" "}
              {dataRanges.volatilityRange.max.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" display="block">
              Volume: {dataRanges.volumeRange.min.toLocaleString()} -{" "}
              {dataRanges.volumeRange.max.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Paper
      elevation={1}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderRadius: 0,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
        }}
        onClick={toggleExpanded}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          Legend & Data Visualization Guide
        </Typography>
        <IconButton size="small">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Content */}
      <Collapse in={isExpanded}>
        <Box sx={{ padding: "16px" }}>
          <Grid container spacing={3}>
            {/* Volatility Section */}
            {showVolatilityHeatmap && (
              <Grid item xs={12} md={4}>
                {renderVolatilitySection()}
              </Grid>
            )}

            {/* Performance Section */}
            {showPerformanceMetrics && (
              <Grid item xs={12} md={4}>
                {renderPerformanceSection()}
              </Grid>
            )}

            {/* Liquidity Section */}
            {showLiquidityIndicators && (
              <Grid item xs={12} md={4}>
                {renderLiquiditySection()}
              </Grid>
            )}

            {/* Special Indicators */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              {renderSpecialIndicators()}
              {renderDataRanges()}
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CalendarLegend;
