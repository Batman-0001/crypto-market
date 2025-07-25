import React, { useState, useEffect } from "react";
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
  Collapse,
  IconButton,
  useTheme,
  alpha,
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
  ExpandMore,
  ExpandLess,
  Settings,
  CalendarToday,
  Analytics,
} from "@mui/icons-material";
import {
  RiCurrencyLine,
  RiTimeLine,
  RiSearchLine,
  RiDropLine,
  RiBarChartLine,
  RiThermometerLine,
  RiLineChartLine,
} from "react-icons/ri";
import { HiOutlineFire } from "react-icons/hi";
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
  const theme = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  // Trigger animation on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Refined color palette - more subtle and professional
  const colorPalette = {
    primary: {
      main: "#4f46e5",
      light: "#6366f1",
      dark: "#3730a3",
      gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    },
    secondary: {
      main: "#06b6d4",
      light: "#22d3ee",
      dark: "#0891b2",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    },
    success: {
      main: "#059669",
      light: "#10b981",
      dark: "#047857",
      gradient: "linear-gradient(135deg, #059669 0%, #0891b2 100%)",
    },
    warning: {
      main: "#d97706",
      light: "#f59e0b",
      dark: "#b45309",
      gradient: "linear-gradient(135deg, #d97706 0%, #ea580c 100%)",
    },
    surface: {
      main: "#ffffff",
      elevated: "#f8fafc",
      dark: "#1e293b",
      glass: "rgba(255, 255, 255, 0.8)",
    },
  };
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
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        background: `linear-gradient(135deg, ${alpha(
          colorPalette.primary.main,
          0.03
        )} 0%, ${alpha(colorPalette.secondary.main, 0.03)} 100%)`,
        backdropFilter: "blur(8px)",
        border: `1px solid ${alpha(colorPalette.primary.main, 0.12)}`,
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isAnimating ? "translateY(0)" : "translateY(15px)",
        opacity: isAnimating ? 1 : 0,
        animation: "slideInUp 0.5s ease-out",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colorPalette.primary.gradient,
          opacity: 0.02,
          borderRadius: "20px",
        },
        "@keyframes slideInUp": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            animation: "fadeInLeft 0.8s ease-out",
            "@keyframes fadeInLeft": {
              "0%": { opacity: 0, transform: "translateX(-20px)" },
              "100%": { opacity: 1, transform: "translateX(0)" },
            },
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "10px",
              background: colorPalette.primary.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              boxShadow: `0 4px 12px ${alpha(colorPalette.primary.main, 0.25)}`,
              animation: "gentle-float 4s ease-in-out infinite",
              "@keyframes gentle-float": {
                "0%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-2px)" },
                "100%": { transform: "translateY(0px)" },
              },
            }}
          >
            <Settings sx={{ color: "white", fontSize: "1.5rem" }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: colorPalette.primary.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
                mb: 0.5,
              }}
            >
              Control Center
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: alpha(theme.palette.text.primary, 0.6),
                fontWeight: 500,
              }}
            >
              Customize your market view
            </Typography>
          </Box>
        </Box>

        {/* Enhanced Refresh Button */}
        <Tooltip title="Refresh market data" arrow>
          <Button
            variant="contained"
            size="medium"
            startIcon={<Refresh />}
            onClick={onRefreshData}
            disabled={isLoading}
            sx={{
              background: isLoading
                ? colorPalette.warning.gradient
                : colorPalette.success.gradient,
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              px: 3,
              py: 1,
              boxShadow: `0 4px 12px ${alpha(
                isLoading
                  ? colorPalette.warning.main
                  : colorPalette.success.main,
                0.25
              )}`,
              border: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: isLoading ? "gentle-pulse 2s infinite" : "none",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: `0 6px 16px ${alpha(
                  isLoading
                    ? colorPalette.warning.main
                    : colorPalette.success.main,
                  0.3
                )}`,
              },
              "& .MuiButton-startIcon": {
                animation: isLoading ? "spin 1s linear infinite" : "none",
              },
              "@keyframes gentle-pulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.8 },
                "100%": { opacity: 1 },
              },
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          >
            {isLoading ? "Syncing..." : "Refresh"}
          </Button>
        </Tooltip>
      </Box>

      <Collapse in={!isCollapsed} timeout={600}>
        <Box
          sx={{
            animation: !isCollapsed ? "fadeInUp 0.6s ease-out" : "none",
            "@keyframes fadeInUp": {
              "0%": { opacity: 0, transform: "translateY(20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Primary Controls Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 3,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            {/* Symbol Selector - Removed excessive hover effects */}
            <Box
              sx={{
                minWidth: 180,
                transition: "opacity 0.3s ease",
                "&:focus-within": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: colorPalette.primary.main,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.75rem",
                }}
              >
                <RiCurrencyLine
                  style={{
                    fontSize: "1rem",
                    marginRight: "8px",
                    color: colorPalette.primary.main,
                  }}
                />
                Cryptocurrency
              </Typography>
              <FormControl size="medium" sx={{ width: "100%" }}>
                <Select
                  value={selectedSymbol}
                  onChange={(e) => onSymbolChange(e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: "10px",
                    background: alpha(colorPalette.surface.main, 0.9),
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${alpha(
                      colorPalette.primary.main,
                      0.15
                    )}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: alpha(colorPalette.primary.main, 0.25),
                      boxShadow: `0 4px 15px ${alpha(
                        colorPalette.primary.main,
                        0.1
                      )}`,
                    },
                    "&.Mui-focused": {
                      borderColor: colorPalette.primary.main,
                      boxShadow: `0 0 0 2px ${alpha(
                        colorPalette.primary.main,
                        0.1
                      )}`,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: "16px",
                        mt: 1,
                        boxShadow: `0 20px 40px ${alpha(
                          theme.palette.common.black,
                          0.1
                        )}`,
                        border: `1px solid ${alpha(
                          colorPalette.primary.main,
                          0.1
                        )}`,
                        "& .MuiMenuItem-root": {
                          borderRadius: "8px",
                          mx: 1,
                          my: 0.5,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: alpha(colorPalette.primary.main, 0.1),
                            transform: "translateX(4px)",
                          },
                        },
                      },
                    },
                  }}
                >
                  {symbolOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            mr: 2,
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                          }}
                        >
                          {option.icon}
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {option.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* View Type Selector - Refined hover effects */}
            <Box
              sx={{
                transition: "opacity 0.3s ease",
                "&:focus-within": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: colorPalette.secondary.main,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.75rem",
                }}
              >
                <RiTimeLine
                  style={{
                    fontSize: "1rem",
                    marginRight: "8px",
                    color: colorPalette.secondary.main,
                  }}
                />
                Time Frame
              </Typography>
              <ButtonGroup
                size="medium"
                variant="outlined"
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: alpha(colorPalette.surface.main, 0.9),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${alpha(
                    colorPalette.secondary.main,
                    0.15
                  )}`,
                  "& .MuiButton-root": {
                    borderColor: "transparent",
                    fontWeight: 600,
                    py: 1.5,
                    px: 2,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: alpha(colorPalette.secondary.main, 0.08),
                    },
                  },
                }}
              >
                {viewTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      viewType === option.value ? "contained" : "outlined"
                    }
                    startIcon={option.icon}
                    onClick={() => onViewTypeChange(option.value)}
                    sx={{
                      background:
                        viewType === option.value
                          ? colorPalette.secondary.gradient
                          : "transparent",
                      color:
                        viewType === option.value
                          ? "white"
                          : colorPalette.secondary.main,
                      boxShadow:
                        viewType === option.value
                          ? `0 8px 16px ${alpha(
                              colorPalette.secondary.main,
                              0.3
                            )}`
                          : "none",
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            {/* Zoom Controls - Simplified interactions */}
            <Box
              sx={{
                transition: "opacity 0.3s ease",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: colorPalette.success.main,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.75rem",
                }}
              >
                <RiSearchLine
                  style={{
                    fontSize: "1rem",
                    marginRight: "8px",
                    color: colorPalette.success.main,
                  }}
                />
                Zoom Level
              </Typography>
              <ButtonGroup
                size="medium"
                variant="outlined"
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: alpha(colorPalette.surface.main, 0.9),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${alpha(colorPalette.success.main, 0.15)}`,
                  "& .MuiButton-root": {
                    borderColor: "transparent",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    "&:hover:not(:disabled)": {
                      background: alpha(colorPalette.success.main, 0.08),
                    },
                  },
                }}
              >
                <Tooltip title="Zoom Out" arrow>
                  <Button
                    onClick={onZoomOut}
                    disabled={zoomLevel <= 0.5}
                    sx={{
                      minWidth: 48,
                      color: colorPalette.success.main,
                    }}
                  >
                    <ZoomOut fontSize="small" />
                  </Button>
                </Tooltip>
                <Button
                  disabled
                  sx={{
                    minWidth: 80,
                    background: colorPalette.success.gradient,
                    color: "white !important",
                    fontWeight: 700,
                  }}
                >
                  {Math.round(zoomLevel * 100)}%
                </Button>
                <Tooltip title="Zoom In" arrow>
                  <Button
                    onClick={onZoomIn}
                    disabled={zoomLevel >= 2}
                    sx={{
                      minWidth: 48,
                      color: colorPalette.success.main,
                    }}
                  >
                    <ZoomIn fontSize="small" />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Box>
          </Box>

          {/* Enhanced Date Range Selection */}
          {selectedDateRange && (
            <Box
              sx={{
                mb: 4,
                animation: "slideInRight 0.5s ease-out",
                "@keyframes slideInRight": {
                  "0%": { opacity: 0, transform: "translateX(20px)" },
                  "100%": { opacity: 1, transform: "translateX(0)" },
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: colorPalette.warning.main,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.75rem",
                }}
              >
                <CalendarToday
                  style={{
                    fontSize: "1rem",
                    marginRight: "8px",
                    color: colorPalette.warning.main,
                  }}
                />
                Selected Range
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  label={`${format(
                    selectedDateRange.start,
                    "MMM dd"
                  )} - ${format(selectedDateRange.end, "MMM dd")}`}
                  onDelete={onClearDateRange}
                  color="primary"
                  variant="filled"
                  sx={{
                    background: colorPalette.warning.gradient,
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "12px",
                    px: 2,
                    py: 1,
                    height: "auto",
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                      "&:hover": {
                        color: "rgba(255,255,255,0.8)",
                      },
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.6),
                    fontWeight: 500,
                  }}
                >
                  (
                  {Math.abs(selectedDateRange.end - selectedDateRange.start) /
                    (1000 * 60 * 60 * 24)}{" "}
                  days)
                </Typography>
              </Box>
            </Box>
          )}

          {/* Subtle Divider */}
          <Box
            sx={{
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${alpha(
                colorPalette.primary.main,
                0.2
              )}, transparent)`,
              my: 4,
            }}
          />

          {/* Enhanced Feature Toggles */}
          <Box
            sx={{
              mb: 4,
              animation: "fadeInUp 0.8s ease-out",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                background: colorPalette.secondary.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FilterList style={{ fontSize: "1.2rem", marginRight: "8px" }} />
              Display Features
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {[
                {
                  key: "volatility",
                  label: "Volatility Heatmap",
                  checked: showVolatilityHeatmap,
                  onChange: onToggleVolatilityHeatmap,
                  color: colorPalette.primary.main,
                  icon: <HiOutlineFire size={20} />,
                },
                {
                  key: "liquidity",
                  label: "Liquidity Indicators",
                  checked: showLiquidityIndicators,
                  onChange: onToggleLiquidityIndicators,
                  color: colorPalette.success.main,
                  icon: <RiDropLine size={20} />,
                },
                {
                  key: "performance",
                  label: "Performance Metrics",
                  checked: showPerformanceMetrics,
                  onChange: onTogglePerformanceMetrics,
                  color: colorPalette.warning.main,
                  icon: <RiLineChartLine size={20} />,
                },
              ].map((feature) => (
                <Box
                  key={feature.key}
                  sx={{
                    background: alpha(feature.color, 0.04),
                    border: `1px solid ${alpha(feature.color, 0.12)}`,
                    borderRadius: "12px",
                    p: 2,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: alpha(feature.color, 0.2),
                      background: alpha(feature.color, 0.06),
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                  onClick={() => feature.onChange(!feature.checked)}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={feature.checked}
                        onChange={(e) => feature.onChange(e.target.checked)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: feature.color,
                            "& + .MuiSwitch-track": {
                              backgroundColor: feature.color,
                            },
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor: alpha(feature.color, 0.3),
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            color: feature.color,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          sx={{ fontWeight: 600, color: feature.color }}
                        >
                          {feature.label}
                        </Typography>
                      </Box>
                    }
                    sx={{ margin: 0 }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Subtle Divider */}
          <Box
            sx={{
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${alpha(
                colorPalette.secondary.main,
                0.2
              )}, transparent)`,
              my: 4,
            }}
          />

          {/* Enhanced Metric Filters */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                background: colorPalette.success.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Analytics style={{ fontSize: "1.2rem", marginRight: "8px" }} />
              Metric Filters
            </Typography>

            {/* Enhanced Volatility Threshold */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: colorPalette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <RiThermometerLine
                  style={{
                    fontSize: "1rem",
                    marginRight: "8px",
                    color: colorPalette.primary.main,
                  }}
                />
                Volatility Range: {volatilityThreshold[0]}% -{" "}
                {volatilityThreshold[1]}%
              </Typography>
              <Box
                sx={{
                  background: alpha(colorPalette.primary.main, 0.04),
                  borderRadius: "12px",
                  p: 3,
                  border: `1px solid ${alpha(colorPalette.primary.main, 0.12)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: alpha(colorPalette.primary.main, 0.06),
                  },
                }}
              >
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
                  sx={{
                    width: "100%",
                    height: 8,
                    "& .MuiSlider-track": {
                      background: colorPalette.primary.gradient,
                      border: "none",
                      height: 8,
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: alpha(colorPalette.primary.main, 0.2),
                      height: 8,
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: "white",
                      border: `3px solid ${colorPalette.primary.main}`,
                      width: 24,
                      height: 24,
                      boxShadow: `0 4px 12px ${alpha(
                        colorPalette.primary.main,
                        0.4
                      )}`,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: `0 6px 16px ${alpha(
                          colorPalette.primary.main,
                          0.6
                        )}`,
                        borderWidth: "4px",
                      },
                      "&:active": {
                        boxShadow: `0 2px 8px ${alpha(
                          colorPalette.primary.main,
                          0.8
                        )}`,
                      },
                    },
                    "& .MuiSlider-valueLabel": {
                      background: colorPalette.primary.gradient,
                      color: "white",
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Enhanced Volume Threshold */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: colorPalette.success.main,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <RiBarChartLine
                  style={{
                    fontSize: "1rem",
                    marginRight: "8px",
                    color: colorPalette.success.main,
                  }}
                />
                Volume Percentile: {volumeThreshold[0]}% - {volumeThreshold[1]}%
              </Typography>
              <Box
                sx={{
                  background: alpha(colorPalette.success.main, 0.04),
                  borderRadius: "12px",
                  p: 3,
                  border: `1px solid ${alpha(colorPalette.success.main, 0.12)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: alpha(colorPalette.success.main, 0.06),
                  },
                }}
              >
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
                  sx={{
                    width: "100%",
                    height: 8,
                    "& .MuiSlider-track": {
                      background: colorPalette.success.gradient,
                      border: "none",
                      height: 8,
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: alpha(colorPalette.success.main, 0.2),
                      height: 8,
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: "white",
                      border: `3px solid ${colorPalette.success.main}`,
                      width: 24,
                      height: 24,
                      boxShadow: `0 4px 12px ${alpha(
                        colorPalette.success.main,
                        0.4
                      )}`,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: `0 6px 16px ${alpha(
                          colorPalette.success.main,
                          0.6
                        )}`,
                        borderWidth: "4px",
                      },
                      "&:active": {
                        boxShadow: `0 2px 8px ${alpha(
                          colorPalette.success.main,
                          0.8
                        )}`,
                      },
                    },
                    "& .MuiSlider-valueLabel": {
                      background: colorPalette.success.gradient,
                      color: "white",
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Enhanced Collapse Toggle */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Tooltip
          title={isCollapsed ? "Show all controls" : "Hide controls"}
          arrow
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => onToggleCollapse(!isCollapsed)}
            startIcon={isCollapsed ? <ExpandMore /> : <ExpandLess />}
            sx={{
              borderRadius: "16px",
              px: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "none",
              background: alpha(colorPalette.primary.main, 0.04),
              border: `1px solid ${alpha(colorPalette.primary.main, 0.15)}`,
              color: colorPalette.primary.main,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: alpha(colorPalette.primary.main, 0.08),
                borderColor: alpha(colorPalette.primary.main, 0.25),
                transform: "translateY(-1px)",
              },
            }}
          >
            {isCollapsed ? "Show Advanced Controls" : "Hide Controls"}
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default CalendarControls;
