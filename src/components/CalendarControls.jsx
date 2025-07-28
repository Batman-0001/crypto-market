import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
  Card,
  CardContent,
  Slider,
  Chip,
  Badge,
  Divider,
} from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  Refresh,
  DateRange,
  ShowChart,
  BarChart,
  ExpandMore,
  Settings,
  TrendingUp,
  Visibility,
  Whatshot,
  Speed,
  BarChart as BarChartIcon,
  Compare,
  Timeline,
  Pattern,
  Analytics,
} from "@mui/icons-material";
import {
  RiCurrencyLine,
  RiTimeLine,
  RiDropLine,
  RiThermometerLine,
  RiBarChartLine,
} from "react-icons/ri";

// Import new feature utilities
import { getPatternIcon, getPatternColor } from "../utils/patternRecognition";
import { formatComparisonValue } from "../utils/comparisonUtils";

// Import visualization dialogs
import PatternAnalysisDialog from "./PatternAnalysisDialog";
import ComparisonAnalysisDialog from "./ComparisonAnalysisDialog";

/**
 * Simple Calendar Controls without GSAP animations
 * Clean, functional design that always renders properly
 */
const CalendarControls = ({
  // Filter props
  selectedSymbol = "BTCUSDT",
  availableSymbols = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "DOTUSDT"],
  onSymbolChange = () => {},

  // View props
  viewType = "daily",
  onViewTypeChange = () => {},

  // Feature toggles
  showVolatilityHeatmap = true,
  onToggleVolatilityHeatmap = () => {},
  showLiquidityIndicators = true,
  onToggleLiquidityIndicators = () => {},
  showPerformanceMetrics = true,
  onTogglePerformanceMetrics = () => {},

  // Zoom props
  onZoomIn = () => {},
  onZoomOut = () => {},

  // Data props
  onRefreshData = () => {},
  isLoading = false,
  data = [], // Add data prop for analysis

  // Metric filter props
  volatilityThreshold = [0, 10],
  onVolatilityThresholdChange = () => {},
  volumeThreshold = [0, 100],
  onVolumeThresholdChange = () => {},

  // Layout props
  isCollapsed = false,
  onToggleCollapse = () => {},

  // New feature props
  patternAnalysis = null,
  comparisonData = null,
  onComparisonRequest = () => {},
  alertCount = 0,
  onShowAlerts = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Dialog states
  const [patternDialogOpen, setPatternDialogOpen] = useState(false);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [comparisonType, setComparisonType] = useState("timePeriod");

  // Modern color palette
  const colors = {
    primary: {
      main: "#6366f1",
      gradient:
        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
      glow: "0 0 20px rgba(99, 102, 241, 0.3)",
    },
    secondary: {
      main: "#06b6d4",
      gradient:
        "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #3b82f6 100%)",
    },
    success: {
      main: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    warning: {
      main: "#f59e0b",
    },
    surface: {
      glass: "rgba(255, 255, 255, 0.1)",
      backdrop: "rgba(255, 255, 255, 0.05)",
      border: "rgba(255, 255, 255, 0.2)",
    },
    card: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    accent: {
      main: "#6366f1",
    },
  };

  const symbolOptions = availableSymbols.map((symbol) => ({
    value: symbol,
    label: symbol.replace("USDT", "/USDT"),
    icon: symbol.includes("BTC")
      ? "₿"
      : symbol.includes("ETH")
      ? "Ξ"
      : symbol.includes("ADA")
      ? "₳"
      : "●",
    color: symbol.includes("BTC")
      ? "#f7931a"
      : symbol.includes("ETH")
      ? "#627eea"
      : symbol.includes("ADA")
      ? "#0033ad"
      : colors.primary.main,
  }));

  const viewTypeOptions = [
    {
      value: "daily",
      label: "Daily",
      icon: <DateRange />,
      color: colors.primary.main,
    },
    {
      value: "weekly",
      label: "Weekly",
      icon: <ShowChart />,
      color: colors.secondary.main,
    },
    {
      value: "monthly",
      label: "Monthly",
      icon: <BarChart />,
      color: colors.success.main,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.1) 0%, 
          rgba(255, 255, 255, 0.05) 100%)`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${colors.surface.border}`,
        borderRadius: { xs: "20px", sm: "24px" },
        p: { xs: 3, sm: 4 },
        mb: 3,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.primary.gradient,
          opacity: 0.03,
          borderRadius: { xs: "20px", sm: "24px" },
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: colors.primary.gradient,
          opacity: 0.5,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "16px",
              background: colors.primary.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: colors.primary.glow,
            }}
          >
            <Settings sx={{ color: "white", fontSize: "1.5rem" }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: colors.primary.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.3rem", sm: "1.5rem" },
              }}
            >
              Market Controls
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.text.primary, 0.6),
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              Customize your trading view
            </Typography>
          </Box>
        </Box>

        <Tooltip
          title={isCollapsed ? "Expand Controls" : "Collapse Controls"}
          arrow
        >
          <IconButton
            onClick={() => onToggleCollapse(!isCollapsed)}
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: colors.surface.glass,
              backdropFilter: "blur(10px)",
              border: `1px solid ${colors.surface.border}`,
              color: colors.primary.main,
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: alpha(colors.primary.main, 0.1),
                borderColor: colors.primary.main,
              },
            }}
          >
            <ExpandMore />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content */}
      {!isCollapsed && (
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Symbol Selector Card */}
            <Card
              sx={{
                background: colors.surface.glass,
                backdropFilter: "blur(20px)",
                border: `1px solid ${colors.surface.border}`,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: colors.primary.gradient,
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(99, 102, 241, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <RiCurrencyLine
                    size={20}
                    style={{ color: colors.primary.main }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: colors.primary.main,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Cryptocurrency
                  </Typography>
                </Box>

                <FormControl fullWidth size="medium">
                  <Select
                    value={selectedSymbol}
                    onChange={(e) => onSymbolChange(e.target.value)}
                    sx={{
                      borderRadius: "12px",
                      background: colors.surface.backdrop,
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${colors.surface.border}`,
                      minHeight: { xs: "48px", sm: "auto" },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      },
                      "&:hover": {
                        borderColor: alpha(colors.primary.main, 0.5),
                      },
                      "&.Mui-focused": {
                        borderColor: colors.primary.main,
                        boxShadow: `0 0 0 2px ${alpha(
                          colors.primary.main,
                          0.2
                        )}`,
                      },
                    }}
                  >
                    {symbolOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "1.2rem", color: option.color }}
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
              </CardContent>
            </Card>

            {/* View Type Card */}
            <Card
              sx={{
                background: colors.surface.glass,
                backdropFilter: "blur(20px)",
                border: `1px solid ${colors.surface.border}`,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: colors.secondary.gradient,
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(6, 182, 212, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <RiTimeLine
                    size={20}
                    style={{ color: colors.secondary.main }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: colors.secondary.main,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Time Frame
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  {viewTypeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        viewType === option.value ? "contained" : "outlined"
                      }
                      size={isMobile ? "medium" : "small"}
                      onClick={() => onViewTypeChange(option.value)}
                      startIcon={!isMobile ? option.icon : null}
                      sx={{
                        flex: 1,
                        borderRadius: "12px",
                        minHeight: { xs: "48px", sm: "40px" },
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        fontWeight: 600,
                        textTransform: "none",
                        border: `1px solid ${colors.surface.border}`,
                        transition: "all 0.3s ease",
                        ...(viewType === option.value
                          ? {
                              background: colors.secondary.gradient,
                              color: "white",
                              borderColor: "transparent",
                              boxShadow: `0 4px 15px ${alpha(
                                colors.secondary.main,
                                0.3
                              )}`,
                              "&:hover": {
                                background: colors.secondary.gradient,
                                transform: "translateY(-1px)",
                                boxShadow: `0 6px 20px ${alpha(
                                  colors.secondary.main,
                                  0.4
                                )}`,
                              },
                            }
                          : {
                              background: colors.surface.backdrop,
                              color: colors.secondary.main,
                              borderColor: alpha(colors.secondary.main, 0.3),
                              "&:hover": {
                                background: alpha(colors.secondary.main, 0.1),
                                borderColor: colors.secondary.main,
                                transform: "translateY(-1px)",
                                boxShadow: `0 4px 12px ${alpha(
                                  colors.secondary.main,
                                  0.2
                                )}`,
                              },
                            }),
                      }}
                    >
                      {isMobile ? option.label.charAt(0) : option.label}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Feature Toggles Card */}
            <Card
              sx={{
                background: colors.surface.glass,
                backdropFilter: "blur(20px)",
                border: `1px solid ${colors.surface.border}`,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                gridColumn: { xs: "1", lg: "1 / -1" },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: colors.success.gradient,
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(16, 185, 129, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Visibility
                    sx={{ color: colors.success.main, fontSize: "1.25rem" }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: colors.success.main,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Display Options
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 2,
                  }}
                >
                  {[
                    {
                      key: "volatility",
                      label: "Volatility Heatmap",
                      icon: <Whatshot />,
                      checked: showVolatilityHeatmap,
                      onChange: onToggleVolatilityHeatmap,
                      color: colors.warning.main,
                    },
                    {
                      key: "liquidity",
                      label: "Liquidity Indicators",
                      icon: <RiDropLine />,
                      checked: showLiquidityIndicators,
                      onChange: onToggleLiquidityIndicators,
                      color: colors.secondary.main,
                    },
                    {
                      key: "performance",
                      label: "Performance Metrics",
                      icon: <TrendingUp />,
                      checked: showPerformanceMetrics,
                      onChange: onTogglePerformanceMetrics,
                      color: colors.success.main,
                    },
                  ].map((toggle) => (
                    <Box
                      key={toggle.key}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        background: alpha(toggle.color, 0.05),
                        border: `1px solid ${alpha(toggle.color, 0.2)}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: alpha(toggle.color, 0.1),
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={toggle.checked}
                            onChange={(e) => toggle.onChange(e.target.checked)}
                            sx={{
                              "& .MuiSwitch-thumb": {
                                background: toggle.checked
                                  ? toggle.color
                                  : "#ccc",
                              },
                              "& .MuiSwitch-track": {
                                backgroundColor: alpha(toggle.color, 0.3),
                              },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ color: toggle.color }}>
                              {toggle.icon}
                            </Box>
                            <Typography
                              fontSize={isMobile ? "0.8rem" : "0.875rem"}
                              fontWeight={600}
                            >
                              {isMobile
                                ? toggle.label.split(" ")[0]
                                : toggle.label}
                            </Typography>
                          </Box>
                        }
                        sx={{ margin: 0, width: "100%" }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Metric Filters Section */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Volatility Filter */}
            <Card
              sx={{
                background: colors.surface.glass,
                backdropFilter: "blur(20px)",
                border: `1px solid ${colors.surface.border}`,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: colors.warning.main,
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(245, 158, 11, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <RiThermometerLine
                    size={20}
                    style={{ color: colors.warning.main }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: colors.warning.main,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Volatility Filter
                  </Typography>
                  <Chip
                    label={`${volatilityThreshold[0]}% - ${volatilityThreshold[1]}%`}
                    size="small"
                    sx={{
                      ml: "auto",
                      background: alpha(colors.warning.main, 0.1),
                      color: colors.warning.main,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>

                <Box sx={{ px: 1 }}>
                  <Slider
                    value={volatilityThreshold}
                    onChange={(_, newValue) =>
                      onVolatilityThresholdChange(newValue)
                    }
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                    min={0}
                    max={20}
                    step={0.5}
                    sx={{
                      color: colors.warning.main,
                      height: 8,
                      "& .MuiSlider-track": {
                        background: `linear-gradient(90deg, ${colors.warning.main}, #f97316)`,
                        border: "none",
                        height: 6,
                      },
                      "& .MuiSlider-rail": {
                        background: alpha(colors.warning.main, 0.2),
                        height: 6,
                      },
                      "& .MuiSlider-thumb": {
                        height: { xs: 24, sm: 20 },
                        width: { xs: 24, sm: 20 },
                        background: colors.warning.main,
                        border: "2px solid white",
                        boxShadow: `0 4px 12px ${alpha(
                          colors.warning.main,
                          0.3
                        )}`,
                        "&:hover": {
                          boxShadow: `0 6px 16px ${alpha(
                            colors.warning.main,
                            0.4
                          )}`,
                        },
                        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                          boxShadow: `0 6px 16px ${alpha(
                            colors.warning.main,
                            0.4
                          )}`,
                        },
                      },
                      "& .MuiSlider-valueLabel": {
                        background: colors.warning.main,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      px: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Low Risk
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      High Risk
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Volume Filter */}
            <Card
              sx={{
                background: colors.surface.glass,
                backdropFilter: "blur(20px)",
                border: `1px solid ${colors.surface.border}`,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: colors.success.gradient,
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(16, 185, 129, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <RiBarChartLine
                    size={20}
                    style={{ color: colors.success.main }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: colors.success.main,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Volume Filter
                  </Typography>
                  <Chip
                    label={`${volumeThreshold[0]}% - ${volumeThreshold[1]}%`}
                    size="small"
                    sx={{
                      ml: "auto",
                      background: alpha(colors.success.main, 0.1),
                      color: colors.success.main,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>

                <Box sx={{ px: 1 }}>
                  <Slider
                    value={volumeThreshold}
                    onChange={(_, newValue) =>
                      onVolumeThresholdChange(newValue)
                    }
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                    min={0}
                    max={100}
                    step={5}
                    sx={{
                      color: colors.success.main,
                      height: 8,
                      "& .MuiSlider-track": {
                        background: colors.success.gradient,
                        border: "none",
                        height: 6,
                      },
                      "& .MuiSlider-rail": {
                        background: alpha(colors.success.main, 0.2),
                        height: 6,
                      },
                      "& .MuiSlider-thumb": {
                        height: { xs: 24, sm: 20 },
                        width: { xs: 24, sm: 20 },
                        background: colors.success.main,
                        border: "2px solid white",
                        boxShadow: `0 4px 12px ${alpha(
                          colors.success.main,
                          0.3
                        )}`,
                        "&:hover": {
                          boxShadow: `0 6px 16px ${alpha(
                            colors.success.main,
                            0.4
                          )}`,
                        },
                        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                          boxShadow: `0 6px 16px ${alpha(
                            colors.success.main,
                            0.4
                          )}`,
                        },
                      },
                      "& .MuiSlider-valueLabel": {
                        background: colors.success.main,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      px: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Low Volume
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      High Volume
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Action Bar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              p: 3,
              borderRadius: "16px",
              background: colors.surface.glass,
              backdropFilter: "blur(20px)",
              border: `1px solid ${colors.surface.border}`,
            }}
          >
            {/* Zoom Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: colors.primary.main,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.75rem",
                }}
              >
                Zoom Level
              </Typography>
              <ButtonGroup size="small">
                {[
                  { icon: <ZoomOut />, action: onZoomOut, tooltip: "Zoom Out" },
                  { icon: <ZoomIn />, action: onZoomIn, tooltip: "Zoom In" },
                ].map((btn, index) => (
                  <Tooltip key={index} title={btn.tooltip}>
                    <IconButton
                      onClick={btn.action}
                      sx={{
                        width: { xs: 44, sm: 36 },
                        height: { xs: 44, sm: 36 },
                        borderRadius: "8px",
                        background: colors.surface.backdrop,
                        border: `1px solid ${colors.surface.border}`,
                        color: colors.primary.main,
                        "&:hover": {
                          background: alpha(colors.primary.main, 0.1),
                          borderColor: colors.primary.main,
                        },
                      }}
                    >
                      {btn.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </ButtonGroup>
            </Box>

            {/* Refresh Button */}
            <Button
              variant="contained"
              size={isMobile ? "large" : "medium"}
              startIcon={<Refresh />}
              onClick={onRefreshData}
              disabled={isLoading}
              sx={{
                background: colors.primary.gradient,
                borderRadius: "12px",
                px: 3,
                py: { xs: 1.5, sm: 1 },
                minHeight: { xs: "48px", sm: "auto" },
                fontWeight: 700,
                textTransform: "none",
                fontSize: { xs: "0.9rem", sm: "0.875rem" },
                boxShadow: colors.primary.glow,
                border: "none",
                "&:hover": {
                  background: colors.primary.gradient,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 25px ${alpha(colors.primary.main, 0.4)}`,
                },
                "&:disabled": {
                  background: alpha(colors.primary.main, 0.3),
                  color: "white",
                },
              }}
            >
              {isLoading ? "Syncing..." : "Refresh Data"}
            </Button>
          </Box>

          {/* Pattern Analysis Card */}
          <Card
            elevation={0}
            sx={{
              background: colors.card.background,
              border: colors.card.border,
              borderRadius: "16px",
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: colors.text.primary,
                }}
              >
                <Timeline sx={{ color: colors.accent.main }} />
                Pattern Analysis
                {patternAnalysis && patternAnalysis.totalPatterns > 0 && (
                  <Chip
                    label={patternAnalysis.totalPatterns}
                    size="small"
                    sx={{
                      ml: 1,
                      backgroundColor: colors.accent.main,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Typography>

              {patternAnalysis &&
              patternAnalysis.patterns &&
              patternAnalysis.patterns.length > 0 ? (
                <Box>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {patternAnalysis.patterns
                      .slice(0, 3)
                      .map((pattern, index) => {
                        // Safety check for pattern object
                        if (!pattern || !pattern.type) return null;

                        const patternIcon = getPatternIcon(pattern);
                        const patternColor = getPatternColor(pattern);

                        return (
                          <Chip
                            key={index}
                            label={`${patternIcon} ${pattern.type
                              .replace("_", " ")
                              .toUpperCase()}`}
                            size="small"
                            sx={{
                              backgroundColor: alpha(patternColor, 0.1),
                              color: patternColor,
                              border: `1px solid ${alpha(patternColor, 0.3)}`,
                              fontWeight: 500,
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: alpha(patternColor, 0.2),
                                transform: "translateY(-1px)",
                              },
                            }}
                            onClick={() => setPatternDialogOpen(true)}
                          />
                        );
                      })}
                    {patternAnalysis.patterns.length > 3 && (
                      <Chip
                        label={`+${patternAnalysis.patterns.length - 3} more`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(colors.text.secondary, 0.1),
                          color: colors.text.secondary,
                        }}
                      />
                    )}
                  </Box>

                  {patternAnalysis.summary && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {Object.entries(patternAnalysis.summary)
                        .filter(([_, count]) => count > 0)
                        .map(
                          ([type, count]) =>
                            `${count} ${type.replace("_", " ")}`
                        )
                        .join(", ")}
                    </Typography>
                  )}

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Analytics />}
                    onClick={() => setPatternDialogOpen(true)}
                    sx={{
                      borderColor: colors.accent.main,
                      color: colors.accent.main,
                      "&:hover": {
                        backgroundColor: alpha(colors.accent.main, 0.1),
                        borderColor: colors.accent.main,
                      },
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {patternAnalysis === null
                      ? "Loading pattern analysis..."
                      : "No patterns detected in current dataset. Patterns will appear as market data loads."}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {/* Show sample pattern types */}
                    <Chip
                      label="📈 Trends"
                      size="small"
                      variant="outlined"
                      sx={{ opacity: 0.5 }}
                    />
                    <Chip
                      label="⚡ Volatility"
                      size="small"
                      variant="outlined"
                      sx={{ opacity: 0.5 }}
                    />
                    <Chip
                      label="📊 Volume"
                      size="small"
                      variant="outlined"
                      sx={{ opacity: 0.5 }}
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Comparison Tools Card */}
          <Card
            elevation={0}
            sx={{
              background: colors.card.background,
              border: colors.card.border,
              borderRadius: "16px",
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: colors.text.primary,
                }}
              >
                <Compare sx={{ color: colors.accent.main }} />
                Comparison Tools
                {alertCount > 0 && (
                  <Badge badgeContent={alertCount} color="error" sx={{ ml: 1 }}>
                    <IconButton
                      size="small"
                      onClick={onShowAlerts}
                      sx={{
                        backgroundColor: alpha("#f44336", 0.1),
                        color: "#f44336",
                        "&:hover": {
                          backgroundColor: alpha("#f44336", 0.2),
                        },
                      }}
                    >
                      <Whatshot />
                    </IconButton>
                  </Badge>
                )}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DateRange />}
                  onClick={() => {
                    setComparisonType("timePeriod");
                    setComparisonDialogOpen(true);
                  }}
                  sx={{
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                    justifyContent: "flex-start",
                    "&:hover": {
                      backgroundColor: alpha(colors.primary.main, 0.1),
                      borderColor: colors.primary.main,
                    },
                  }}
                >
                  Compare Time Periods
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShowChart />}
                  onClick={() => {
                    setComparisonType("cryptocurrencies");
                    setComparisonDialogOpen(true);
                  }}
                  sx={{
                    borderColor: colors.secondary.main,
                    color: colors.secondary.main,
                    justifyContent: "flex-start",
                    "&:hover": {
                      backgroundColor: alpha(colors.secondary.main, 0.1),
                      borderColor: colors.secondary.main,
                    },
                  }}
                >
                  Compare Cryptocurrencies
                </Button>

                {comparisonData && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      backgroundColor: alpha(colors.accent.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Last Comparison:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {comparisonData.symbol || "Multiple Assets"}
                    </Typography>
                    {comparisonData.differences &&
                      comparisonData.differences.returnDifference && (
                        <Typography variant="caption" color="text.secondary">
                          Return Diff:{" "}
                          {formatComparisonValue(
                            comparisonData.differences.returnDifference,
                            "percent"
                          )}
                        </Typography>
                      )}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Analysis Dialogs */}
      <PatternAnalysisDialog
        open={patternDialogOpen}
        onClose={() => setPatternDialogOpen(false)}
        patternAnalysis={patternAnalysis}
        symbol={selectedSymbol}
      />

      <ComparisonAnalysisDialog
        open={comparisonDialogOpen}
        onClose={() => setComparisonDialogOpen(false)}
        data={data}
        availableSymbols={availableSymbols}
        currentSymbol={selectedSymbol}
        type={comparisonType}
      />
    </Paper>
  );
};

export default CalendarControls;
