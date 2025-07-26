import React, { useState, useEffect, useRef } from "react";
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
  Slider,
  Tooltip,
  Collapse,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
  Chip,
  Card,
  CardContent,
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
  ExpandLess,
  Settings,
  TrendingUp,
  Visibility,
  VisibilityOff,
  AutoGraph,
  Speed,
  Whatshot,
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
import gsap from "gsap";

/**
 * Modern Calendar Controls with GSAP Animations
 * Sleek, professional design with smooth interactions
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Refs for GSAP animations
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const toggleRef = useRef(null);

  // State
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Modern color palette
  const colors = {
    primary: {
      main: "#6366f1",
      light: "#8b5cf6",
      dark: "#4f46e5",
      gradient:
        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
      glow: "0 0 20px rgba(99, 102, 241, 0.3)",
    },
    secondary: {
      main: "#06b6d4",
      light: "#0ea5e9",
      dark: "#0284c7",
      gradient:
        "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #3b82f6 100%)",
    },
    success: {
      main: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    warning: {
      main: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    danger: {
      main: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
    surface: {
      glass: "rgba(255, 255, 255, 0.1)",
      backdrop: "rgba(255, 255, 255, 0.05)",
      border: "rgba(255, 255, 255, 0.2)",
    },
  };

  // GSAP Animations
  useEffect(() => {
    if (containerRef.current) {
      // Initial entrance animation
      gsap.fromTo(
        containerRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Stagger animation for cards
      gsap.fromTo(
        cardsRef.current,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Toggle animation
  useEffect(() => {
    if (toggleRef.current) {
      gsap.to(toggleRef.current, {
        rotation: isCollapsed ? 180 : 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isCollapsed]);

  // Collapse animation
  useEffect(() => {
    if (contentRef.current) {
      if (isCollapsed) {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        });
      } else {
        gsap.set(contentRef.current, { height: "auto" });
        gsap.from(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    }
  }, [isCollapsed]);

  // Card hover animations
  const handleCardHover = (index, isHovering) => {
    const card = cardsRef.current[index];
    if (!card) return;

    if (isHovering) {
      gsap.to(card, {
        y: -5,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
      });
      setHoveredCard(index);
    } else {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      });
      setHoveredCard(null);
    }
  };

  // Button click animation
  const handleButtonClick = (element) => {
    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
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
      ref={containerRef}
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
        ref={headerRef}
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
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-2px",
                background: colors.primary.gradient,
                borderRadius: "18px",
                opacity: 0.3,
                filter: "blur(8px)",
              },
            }}
          >
            <Settings
              sx={{
                color: "white",
                fontSize: "1.5rem",
                position: "relative",
                zIndex: 1,
              }}
            />
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
            ref={toggleRef}
            onClick={() => {
              handleButtonClick(toggleRef.current);
              setTimeout(() => {
                console.log(
                  "Toggle clicked! Current state:",
                  isCollapsed,
                  "-> New state:",
                  !isCollapsed
                );
                onToggleCollapse(!isCollapsed);
              }, 100);
            }}
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: colors.surface.glass,
              backdropFilter: "blur(10px)",
              border: `1px solid ${colors.surface.border}`,
              color: colors.primary.main,
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
      <Box
        ref={contentRef}
        sx={{
          overflow: "hidden",
          display: isCollapsed ? "none" : "block",
        }}
      >
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
            ref={(el) => (cardsRef.current[0] = el)}
            onMouseEnter={() => handleCardHover(0, true)}
            onMouseLeave={() => handleCardHover(0, false)}
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
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
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
                      boxShadow: `0 0 0 2px ${alpha(colors.primary.main, 0.2)}`,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: "16px",
                        background: colors.surface.glass,
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${colors.surface.border}`,
                        mt: 1,
                        maxHeight: { xs: "60vh", sm: "40vh" },
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
                        minHeight: { xs: "48px", sm: "auto" },
                        "&:hover": {
                          background: alpha(option.color, 0.1),
                        },
                      }}
                    >
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
            ref={(el) => (cardsRef.current[1] = el)}
            onMouseEnter={() => handleCardHover(1, true)}
            onMouseLeave={() => handleCardHover(1, false)}
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
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
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

              <ButtonGroup
                variant="outlined"
                size={isMobile ? "medium" : "small"}
                sx={{
                  width: "100%",
                  "& .MuiButton-root": {
                    flex: 1,
                    borderRadius: "10px",
                    border: `1px solid ${colors.surface.border}`,
                    minHeight: { xs: "44px", sm: "auto" },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: alpha(colors.secondary.main, 0.1),
                      borderColor: colors.secondary.main,
                      transform: "translateY(-1px)",
                    },
                    "&.active": {
                      background: colors.secondary.gradient,
                      color: "white",
                      borderColor: "transparent",
                      boxShadow: `0 4px 15px ${alpha(
                        colors.secondary.main,
                        0.4
                      )}`,
                    },
                  },
                }}
              >
                {viewTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    className={viewType === option.value ? "active" : ""}
                    onClick={() => onViewTypeChange(option.value)}
                    startIcon={!isMobile ? option.icon : null}
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
            </CardContent>
          </Card>

          {/* Feature Toggles Card */}
          <Card
            ref={(el) => (cardsRef.current[2] = el)}
            onMouseEnter={() => handleCardHover(2, true)}
            onMouseLeave={() => handleCardHover(2, false)}
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
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box sx={{ color: toggle.color }}>{toggle.icon}</Box>
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
                    onClick={(e) => {
                      handleButtonClick(e.currentTarget);
                      setTimeout(btn.action, 100);
                    }}
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
            onClick={(e) => {
              handleButtonClick(e.currentTarget);
              setTimeout(onRefreshData, 100);
            }}
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
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                background: colors.primary.gradient,
                transform: "translateY(-2px)",
                boxShadow: `0 8px 25px ${alpha(colors.primary.main, 0.4)}`,
              },
              "&:disabled": {
                background: alpha(colors.primary.main, 0.3),
                color: "white",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                transition: "left 0.5s",
              },
              "&:hover::before": {
                left: "100%",
              },
            }}
          >
            {isLoading ? "Syncing..." : "Refresh Data"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CalendarControls;
