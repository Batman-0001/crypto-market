import React from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Button,
  ButtonGroup,
  Switch,
  FormControlLabel,
  Divider,
  Slider,
  Tooltip,
} from "@mui/material";
import {
  FilterList,
  ZoomIn,
  ZoomOut,
  Refresh,
  DateRange,
  ShowChart,
  BarChart,
  TrendingUp,
} from "@mui/icons-material";
import { format } from "date-fns";

/**
 * Advanced filter and control panel for the calendar
 * @param {Object} props - Component props
 * @returns {React.Component} CalendarControls component
 */
const CalendarControls = ({
  // Filter props
  selectedSymbol = "BTCUSDT",
  availableSymbols = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "DOTUSDT"],
  onSymbolChange = () => {},

  // View props
  viewType = "daily",
  onViewTypeChange = () => {},

  // Date range props
  selectedDateRange = null,
  onDateRangeChange = () => {},
  onClearDateRange = () => {},

  // Feature toggles
  showVolatilityHeatmap = true,
  onToggleVolatilityHeatmap = () => {},
  showLiquidityIndicators = true,
  onToggleLiquidityIndicators = () => {},
  showPerformanceMetrics = true,
  onTogglePerformanceMetrics = () => {},

  // Zoom props
  zoomLevel = 1,
  onZoomChange = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},

  // Data props
  onRefreshData = () => {},
  isLoading = false,

  // Metric filter props
  volatilityThreshold = [0, 10],
  onVolatilityThresholdChange = () => {},
  volumeThreshold = [0, 100],
  onVolumeThresholdChange = () => {},

  // Layout props
  isCollapsed = false,
  onToggleCollapse = () => {},
}) => {
  // Symbol options with icons
  const symbolOptions = availableSymbols.map((symbol) => ({
    value: symbol,
    label: symbol,
    icon: symbol.includes("BTC")
      ? "₿"
      : symbol.includes("ETH")
      ? "Ξ"
      : symbol.includes("ADA")
      ? "₳"
      : "●",
  }));

  // View type options
  const viewTypeOptions = [
    { value: "daily", label: "Daily", icon: <DateRange fontSize="small" /> },
    { value: "weekly", label: "Weekly", icon: <ShowChart fontSize="small" /> },
    { value: "monthly", label: "Monthly", icon: <BarChart fontSize="small" /> },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FilterList sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Calendar Controls
          </Typography>
        </Box>

        {/* Refresh Button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<Refresh />}
          onClick={onRefreshData}
          disabled={isLoading}
          sx={{ minWidth: "auto" }}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </Box>

      {!isCollapsed && (
        <>
          {/* Primary Controls Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Symbol Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Cryptocurrency
              </Typography>
              <Select
                value={selectedSymbol}
                onChange={(e) => onSymbolChange(e.target.value)}
                displayEmpty
              >
                {symbolOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ mr: 1, fontWeight: "bold" }}>
                        {option.icon}
                      </Typography>
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* View Type Selector */}
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
              >
                Time Frame
              </Typography>
              <ButtonGroup size="small" variant="outlined">
                {viewTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      viewType === option.value ? "contained" : "outlined"
                    }
                    startIcon={option.icon}
                    onClick={() => onViewTypeChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            {/* Zoom Controls */}
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
              >
                Zoom Level
              </Typography>
              <ButtonGroup size="small" variant="outlined">
                <Button onClick={onZoomOut} disabled={zoomLevel <= 0.5}>
                  <ZoomOut fontSize="small" />
                </Button>
                <Button disabled sx={{ minWidth: 60 }}>
                  {Math.round(zoomLevel * 100)}%
                </Button>
                <Button onClick={onZoomIn} disabled={zoomLevel >= 2}>
                  <ZoomIn fontSize="small" />
                </Button>
              </ButtonGroup>
            </Box>
          </Box>

          {/* Date Range Selection */}
          {selectedDateRange && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
              >
                Selected Date Range
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={`${format(
                    selectedDateRange.start,
                    "MMM dd"
                  )} - ${format(selectedDateRange.end, "MMM dd")}`}
                  onDelete={onClearDateRange}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                  (
                  {Math.abs(selectedDateRange.end - selectedDateRange.start) /
                    (1000 * 60 * 60 * 24)}{" "}
                  days)
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Feature Toggles */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              📊 Display Features
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showVolatilityHeatmap}
                    onChange={(e) =>
                      onToggleVolatilityHeatmap(e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Volatility Heatmap"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showLiquidityIndicators}
                    onChange={(e) =>
                      onToggleLiquidityIndicators(e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Liquidity Indicators"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showPerformanceMetrics}
                    onChange={(e) =>
                      onTogglePerformanceMetrics(e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Performance Metrics"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Metric Filters */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
              🎯 Metric Filters
            </Typography>

            {/* Volatility Threshold */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Volatility Range: {volatilityThreshold[0]}% -{" "}
                {volatilityThreshold[1]}%
              </Typography>
              <Slider
                value={volatilityThreshold}
                onChange={(e, newValue) =>
                  onVolatilityThresholdChange(newValue)
                }
                valueLabelDisplay="auto"
                min={0}
                max={20}
                step={0.5}
                marks={[
                  { value: 0, label: "0%" },
                  { value: 5, label: "5%" },
                  { value: 10, label: "10%" },
                  { value: 20, label: "20%" },
                ]}
                sx={{ width: "100%", maxWidth: 300 }}
              />
            </Box>

            {/* Volume Threshold */}
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Volume Percentile: {volumeThreshold[0]}% - {volumeThreshold[1]}%
              </Typography>
              <Slider
                value={volumeThreshold}
                onChange={(e, newValue) => onVolumeThresholdChange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: "Low" },
                  { value: 50, label: "Medium" },
                  { value: 100, label: "High" },
                ]}
                sx={{ width: "100%", maxWidth: 300 }}
              />
            </Box>
          </Box>
        </>
      )}

      {/* Collapse Toggle */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          size="small"
          onClick={() => onToggleCollapse(!isCollapsed)}
          sx={{ fontSize: "0.7rem" }}
        >
          {isCollapsed ? "Show Controls" : "Hide Controls"}
        </Button>
      </Box>
    </Paper>
  );
};

export default CalendarControls;
