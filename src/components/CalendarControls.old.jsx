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
  useMediaQuery,
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
 * Responsive Calendar Controls Component
 * Optimized for all device sizes with touch-friendly interactions
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

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // Trigger animation on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Refined color palette - mobile optimized
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
    {
      value: "daily",
      label: isMobile ? "Daily" : "Daily View",
      icon: <DateRange fontSize="small" />,
    },
    {
      value: "weekly",
      label: isMobile ? "Weekly" : "Weekly View",
      icon: <ShowChart fontSize="small" />,
    },
    {
      value: "monthly",
      label: isMobile ? "Monthly" : "Monthly View",
      icon: <BarChart fontSize="small" />,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 }, // Responsive padding
        mb: { xs: 2, sm: 3 },
        background: `linear-gradient(135deg, ${alpha(
          colorPalette.primary.main,
          0.03
        )} 0%, ${alpha(colorPalette.secondary.main, 0.03)} 100%)`,
        backdropFilter: "blur(8px)",
        border: `1px solid ${alpha(colorPalette.primary.main, 0.12)}`,
        borderRadius: { xs: "16px", sm: "20px" },
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isAnimating ? "translateY(0)" : "translateY(15px)",
        opacity: isAnimating ? 1 : 0,
        animation: "slideInUp 0.5s ease-out",
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
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              background: alpha(colorPalette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "iconPulse 2s ease-in-out infinite alternate",
              "@keyframes iconPulse": {
                "0%": { transform: "scale(1)" },
                "100%": { transform: "scale(1.05)" },
              },
            }}
          >
            <Settings
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                color: colorPalette.primary.main,
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: colorPalette.primary.gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              animation: "textShine 3s ease-in-out infinite",
              "@keyframes textShine": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          >
            Calendar Controls
          </Typography>
        </Box>

        {/* Collapse Toggle - Touch-friendly */}
        <Tooltip title={isCollapsed ? "Show Controls" : "Hide Controls"}>
          <IconButton
            onClick={() => {
              console.log("Toggle clicked! Current state:", isCollapsed, "-> New state:", !isCollapsed);
              onToggleCollapse(!isCollapsed);
            }}
            size="medium"
            sx={{
              backgroundColor: alpha(colorPalette.primary.main, 0.08),
              color: colorPalette.primary.main,
              borderRadius: "12px",
              transition: "all 0.2s ease",
              minHeight: { xs: "48px", sm: "auto" }, // Touch-friendly size
              minWidth: { xs: "48px", sm: "auto" },
              "&:hover": {
                backgroundColor: alpha(colorPalette.primary.main, 0.15),
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.95)", // Touch feedback
              },
            }}
          >
            {isCollapsed ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={!isCollapsed} timeout={300}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Single column on mobile
              sm: "1fr 1fr", // Two columns on tablet
              lg: "repeat(3, 1fr)", // Three columns on desktop
            },
            gap: { xs: 2, sm: 3 },
            animation: "fadeInUp 0.5s ease-out",
            "@keyframes fadeInUp": {
              "0%": { opacity: 0, transform: "translateY(10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Symbol Selector */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                color: colorPalette.primary.main,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
            <FormControl
              size={isMobile ? "medium" : "small"}
              sx={{ width: "100%" }}
            >
              <Select
                value={selectedSymbol}
                onChange={(e) => onSymbolChange(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  background: alpha(colorPalette.surface.main, 0.9),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${alpha(colorPalette.primary.main, 0.15)}`,
                  minHeight: { xs: "48px", sm: "auto" }, // Touch-friendly height
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: alpha(colorPalette.primary.main, 0.25),
                    boxShadow: `0 4px 15px ${alpha(
                      colorPalette.primary.main,
                      0.1
                    )}`,
                  },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
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
                      maxHeight: { xs: "60vh", sm: "40vh" }, // Mobile-friendly menu height
                    },
                  },
                }}
              >
                {symbolOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      borderRadius: "8px",
                      mx: 1,
                      my: 0.5,
                      minHeight: { xs: "48px", sm: "auto" }, // Touch-friendly
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: alpha(colorPalette.primary.main, 0.08),
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "1.2rem" }}>
                        {option.icon}
                      </Typography>
                      <Typography>{option.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* View Type Selector */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                color: colorPalette.primary.main,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              <RiTimeLine
                style={{
                  fontSize: "1rem",
                  marginRight: "8px",
                  color: colorPalette.primary.main,
                }}
              />
              Time Frame
            </Typography>
            <ButtonGroup
              variant="outlined"
              size={isMobile ? "medium" : "small"}
              sx={{
                width: "100%",
                "& .MuiButton-root": {
                  flex: 1,
                  borderRadius: { xs: "8px", sm: "10px" },
                  border: `1px solid ${alpha(colorPalette.primary.main, 0.15)}`,
                  minHeight: { xs: "48px", sm: "auto" }, // Touch-friendly
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: alpha(colorPalette.primary.main, 0.08),
                    borderColor: alpha(colorPalette.primary.main, 0.25),
                  },
                  "&.MuiButton-contained": {
                    background: colorPalette.primary.gradient,
                    color: "white",
                    "&:hover": {
                      background: colorPalette.primary.gradient,
                      opacity: 0.9,
                    },
                  },
                },
              }}
            >
              {viewTypeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={viewType === option.value ? "contained" : "outlined"}
                  onClick={() => onViewTypeChange(option.value)}
                  startIcon={!isMobile ? option.icon : null} // Hide icons on mobile for space
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* Feature Toggles */}
          <Box sx={{ gridColumn: { xs: "1", lg: "1 / -1" } }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                color: colorPalette.primary.main,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              <RiSearchLine
                style={{
                  fontSize: "1rem",
                  marginRight: "8px",
                  color: colorPalette.primary.main,
                }}
              />
              Display Options
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: { xs: 1, sm: 2 },
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={showVolatilityHeatmap}
                    onChange={(e) =>
                      onToggleVolatilityHeatmap(e.target.checked)
                    }
                    sx={{
                      "& .MuiSwitch-thumb": {
                        background: colorPalette.warning.gradient,
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: alpha(colorPalette.warning.main, 0.3),
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HiOutlineFire size={16} />
                    <Typography fontSize={isMobile ? "0.85rem" : "0.875rem"}>
                      {isMobile ? "Volatility" : "Volatility Heatmap"}
                    </Typography>
                  </Box>
                }
                sx={{ margin: 0 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showLiquidityIndicators}
                    onChange={(e) =>
                      onToggleLiquidityIndicators(e.target.checked)
                    }
                    sx={{
                      "& .MuiSwitch-thumb": {
                        background: colorPalette.secondary.gradient,
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: alpha(
                          colorPalette.secondary.main,
                          0.3
                        ),
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RiDropLine size={16} />
                    <Typography fontSize={isMobile ? "0.85rem" : "0.875rem"}>
                      {isMobile ? "Liquidity" : "Liquidity Indicators"}
                    </Typography>
                  </Box>
                }
                sx={{ margin: 0 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showPerformanceMetrics}
                    onChange={(e) =>
                      onTogglePerformanceMetrics(e.target.checked)
                    }
                    sx={{
                      "& .MuiSwitch-thumb": {
                        background: colorPalette.success.gradient,
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: alpha(colorPalette.success.main, 0.3),
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RiLineChartLine size={16} />
                    <Typography fontSize={isMobile ? "0.85rem" : "0.875rem"}>
                      {isMobile ? "Performance" : "Performance Metrics"}
                    </Typography>
                  </Box>
                }
                sx={{ margin: 0 }}
              />
            </Box>
          </Box>

          {/* Zoom Controls and Refresh Button */}
          <Box
            sx={{
              gridColumn: { xs: "1", sm: "1 / -1" },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 3 },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            {/* Zoom Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: colorPalette.primary.main,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              >
                Zoom
              </Typography>
              <ButtonGroup size={isMobile ? "medium" : "small"}>
                <Tooltip title="Zoom Out">
                  <IconButton
                    onClick={onZoomOut}
                    sx={{
                      minWidth: { xs: "48px", sm: "auto" },
                      minHeight: { xs: "48px", sm: "auto" },
                      border: `1px solid ${alpha(
                        colorPalette.primary.main,
                        0.15
                      )}`,
                      "&:hover": {
                        background: alpha(colorPalette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ZoomOut fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Zoom In">
                  <IconButton
                    onClick={onZoomIn}
                    sx={{
                      minWidth: { xs: "48px", sm: "auto" },
                      minHeight: { xs: "48px", sm: "auto" },
                      border: `1px solid ${alpha(
                        colorPalette.primary.main,
                        0.15
                      )}`,
                      "&:hover": {
                        background: alpha(colorPalette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ZoomIn fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </Box>

            {/* Refresh Button */}
            <Tooltip title="Refresh market data">
              <Button
                variant="contained"
                size={isMobile ? "large" : "medium"}
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
                  py: { xs: 1.5, sm: 1 },
                  minHeight: { xs: "48px", sm: "auto" }, // Touch-friendly
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
                  "&:active": {
                    transform: "scale(0.98)", // Touch feedback
                  },
                  "@keyframes gentle-pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.8 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                {isLoading ? "Syncing..." : "Refresh Data"}
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CalendarControls;
