import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  TrendingUp,
  CalendarToday,
  Analytics,
  Info,
  Close,
  Palette,
  Notifications,
  GetApp,
  Compare,
  Timeline,
} from "@mui/icons-material";
import InteractiveCalendar from "./components/InteractiveCalendar";
import ErrorBoundary from "./components/ErrorBoundary";
import { DEFAULT_SYMBOL, VIEW_TYPES } from "./constants";

// Import new feature systems
import {
  colorThemes,
  applyTheme,
  getSavedTheme,
  getThemeNames,
} from "./utils/colorThemes";
import {
  alertManager,
  showBrowserNotification,
  requestNotificationPermission,
} from "./utils/alertSystem";
import { exportToPDF, exportToCSV, exportToImage } from "./utils/exportUtils";
import { initializeAnimations } from "./utils/animations";
import { cryptoAPI } from "./services/cryptoAPI";

// Create Material-UI theme with responsive design
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Responsive typography
    h3: {
      fontSize: "2.5rem",
      "@media (max-width:768px)": {
        fontSize: "2rem",
      },
      "@media (max-width:480px)": {
        fontSize: "1.75rem",
      },
    },
    h6: {
      fontSize: "1.25rem",
      "@media (max-width:768px)": {
        fontSize: "1.1rem",
      },
      "@media (max-width:480px)": {
        fontSize: "1rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      "@media (max-width:480px)": {
        fontSize: "0.8rem",
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1200,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "@media (max-width:768px)": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (max-width:768px)": {
            paddingLeft: "16px",
            paddingRight: "16px",
          },
          "@media (max-width:480px)": {
            paddingLeft: "8px",
            paddingRight: "8px",
          },
        },
      },
    },
    // Touch-friendly buttons for mobile
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: "44px", // Touch-friendly minimum size
          "@media (max-width:768px)": {
            minHeight: "48px",
            fontSize: "0.9rem",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "@media (max-width:768px)": {
            padding: "12px",
          },
        },
      },
    },
  },
});

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [calendarData, setCalendarData] = useState([]); // Store calendar data for exports
  const [currentSymbol, setCurrentSymbol] = useState(DEFAULT_SYMBOL);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // New feature states
  const [currentTheme, setCurrentTheme] = useState(getSavedTheme());
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);

  // Responsive breakpoint detection
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Touch detection for mobile optimizations
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
      );
    };
    checkTouch();

    // Handle orientation changes for mobile
    const handleOrientationChange = () => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    return () =>
      window.removeEventListener("orientationchange", handleOrientationChange);
  }, []);

  // Initialize new feature systems
  useEffect(() => {
    // Initialize animations
    initializeAnimations();

    // Apply saved theme
    applyTheme(currentTheme);

    // Request notification permission for alerts
    if (alertsEnabled) {
      requestNotificationPermission();
    }

    // Subscribe to alerts
    const handleAlert = (alert) => {
      setAlertHistory((prev) => [alert, ...prev.slice(0, 99)]); // Keep last 100 alerts

      // Show browser notification
      if (alertsEnabled) {
        showBrowserNotification(alert);
      }

      // Show in-app notification
      setNotification({
        open: true,
        message: alert.message,
        severity: alert.severity === "critical" ? "error" : "warning",
      });
    };

    alertManager.subscribe(handleAlert);

    return () => {
      alertManager.unsubscribe(handleAlert);
    };
  }, [currentTheme, alertsEnabled]);

  // Handle date selection
  const handleDateSelect = (date, data) => {
    setSelectedDate(date);
    setSelectedData(data);

    if (data) {
      setNotification({
        open: true,
        message: `Selected ${date.toLocaleDateString()}: ${
          data.priceChange > 0 ? "+" : ""
        }${data.priceChange?.toFixed(2)}% change`,
        severity: data.priceChange >= 0 ? "success" : "error",
      });
    }
  };

  // Handle date range selection
  const handleDateRangeSelect = (range) => {
    setSelectedDateRange(range);

    if (range) {
      const days =
        Math.ceil((range.end - range.start) / (1000 * 60 * 60 * 24)) + 1;
      setNotification({
        open: true,
        message: `Selected date range: ${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()} (${days} days)`,
        severity: "info",
      });
    }
  };

  // Handle data updates
  const handleDataUpdate = (data, ranges) => {
    console.log("Market data updated:", { dataPoints: data.length, ranges });
    setCalendarData(data); // Store data for exports
  };

  // Handle symbol changes
  const handleSymbolChange = (symbol) => {
    setCurrentSymbol(symbol);
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Handle info dialog
  const handleInfoDialogOpen = () => {
    setInfoDialogOpen(true);
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };

  // New feature handlers
  const handleThemeChange = (themeId) => {
    const newTheme = applyTheme(themeId);
    setCurrentTheme(themeId);
    setThemeMenuAnchor(null);

    setNotification({
      open: true,
      message: `Theme changed to ${newTheme.name}`,
      severity: "success",
    });
  };

  const handleExport = async (format, element) => {
    try {
      setNotification({
        open: true,
        message: `Exporting as ${format.toUpperCase()}...`,
        severity: "info",
      });

      let result;
      switch (format) {
        case "pdf":
          result = await exportToPDF(calendarData, {
            filename: `crypto-calendar-${currentSymbol}-${
              new Date().toISOString().split("T")[0]
            }.pdf`,
            symbol: currentSymbol,
            title: `${currentSymbol} Market Analysis`,
            dateRange: selectedDateRange,
          });
          break;
        case "csv":
          result = await exportToCSV(calendarData, {
            filename: `crypto-calendar-${currentSymbol}-${
              new Date().toISOString().split("T")[0]
            }.csv`,
            symbol: currentSymbol,
          });
          break;
        case "image":
          result = await exportToImage(element || "calendar-container", {
            filename: `crypto-calendar-${currentSymbol}-${
              new Date().toISOString().split("T")[0]
            }.png`,
          });
          break;
        default:
          throw new Error("Unsupported export format");
      }

      setNotification({
        open: true,
        message: `Successfully exported as ${format.toUpperCase()}!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Export failed:", error);
      setNotification({
        open: true,
        message: `Export failed: ${error.message}`,
        severity: "error",
      });
    }
    setExportMenuAnchor(null);
  };

  const toggleAlerts = () => {
    if (alertsEnabled) {
      alertManager.disableAlerts();
    } else {
      alertManager.enableAlerts();
    }
    setAlertsEnabled(!alertsEnabled);

    setNotification({
      open: true,
      message: `Alerts ${!alertsEnabled ? "enabled" : "disabled"}`,
      severity: "info",
    });
  };

  return (
    <ErrorBoundary fallbackMessage="Sorry, something went wrong with the cryptocurrency calendar. Please try refreshing the page.">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
            // Prevent zoom on double-tap for mobile
            touchAction: "manipulation",
            // Improve scrolling performance on mobile
            WebkitOverflowScrolling: "touch",
            overflowX: "hidden", // Prevent horizontal scroll
          }}
        >
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              py: { xs: 2, sm: 3, md: 4 }, // Responsive padding
              mb: 0,
              borderRadius: 0,
              background:
                "linear-gradient(135deg, #0d47a1 0%, #1565c0 25%, #1976d2 50%, #1e88e5 75%, #42a5f5 100%)",
              backgroundSize: "400% 400%",
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: {
                xs: "0 4px 16px rgba(25, 118, 210, 0.2)",
                md: "0 8px 32px rgba(25, 118, 210, 0.3)",
              },
              animation:
                "gradientShift 8s ease-in-out infinite, headerPulse 4s ease-in-out infinite",
              // Touch-optimized animations for mobile
              "@media (max-width:768px)": {
                "&::before": {
                  animation: "float 4s ease-in-out infinite", // Faster on mobile
                },
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
                opacity: 0.7,
                animation: "float 6s ease-in-out infinite",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                animation: "shimmer 3s infinite",
              },
              "@keyframes gradientShift": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
              "@keyframes headerPulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.002)" },
                "100%": { transform: "scale(1)" },
              },
              "@keyframes float": {
                "0%": { transform: "translateY(0px) rotate(0deg)" },
                "33%": { transform: "translateY(-10px) rotate(1deg)" },
                "66%": { transform: "translateY(5px) rotate(-1deg)" },
                "100%": { transform: "translateY(0px) rotate(0deg)" },
              },
              "@keyframes shimmer": {
                "0%": { left: "-100%" },
                "100%": { left: "100%" },
              },
            }}
          >
            <Container
              maxWidth="xl"
              sx={{
                position: "relative",
                zIndex: 2,
                animation: "slideInUp 1s ease-out",
                "@keyframes slideInUp": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: "800",
                  textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  letterSpacing: "-0.5px",
                  background:
                    "linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "titleGlow 3s ease-in-out infinite alternate",
                  transform: "translateY(0)",
                  transition: "all 0.3s ease",
                  // Responsive text alignment
                  textAlign: { xs: "center", md: "left" },
                  // Mobile-optimized hover effects
                  "&:hover": {
                    transform: {
                      xs: "translateY(-1px)", // Subtle on mobile
                      md: "translateY(-2px) scale(1.02)", // Full effect on desktop
                    },
                    textShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
                  },
                  "@keyframes titleGlow": {
                    "0%": {
                      filter:
                        "brightness(1) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
                    },
                    "100%": {
                      filter:
                        "brightness(1.1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
                    },
                  },
                }}
              >
                <TrendingUp
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.2rem", md: "2.5rem" },
                    mr: { xs: 1, sm: 2 },
                    verticalAlign: "middle",
                  }}
                />
                Crypto Market Calendar
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  opacity: 0.95,
                  fontWeight: "400",
                  lineHeight: 1.6,
                  maxWidth: { xs: "100%", sm: "90%", md: "800px" },
                  margin: "0 auto",
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  animation: "fadeInSlide 1.5s ease-out 0.3s both",
                  transform: "translateY(0)",
                  transition: "all 0.3s ease",
                  // Responsive padding for readability
                  px: { xs: 2, sm: 0 },
                  "&:hover": {
                    opacity: 1,
                    transform: "translateY(-1px)",
                  },
                  "@keyframes fadeInSlide": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(20px)",
                    },
                    "100%": {
                      opacity: 0.95,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                Interactive cryptocurrency market data visualization with
                volatility heatmaps, liquidity indicators, and performance
                metrics
              </Typography>
            </Container>
          </Paper>

          {/* Main Content */}
          <Container
            id="calendar-container"
            maxWidth="xl"
            sx={{
              py: { xs: 2, sm: 3, md: 4 }, // Responsive padding
              mt: { xs: 1, sm: 2 },
              mb: { xs: 2, sm: 3 },
              px: { xs: 1, sm: 2, md: 3 }, // Responsive horizontal padding
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)",
              backdropFilter: "blur(10px)",
              borderRadius: { xs: "16px 16px 0 0", md: "24px 24px 0 0" },
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: "40px", md: "60px" },
                height: { xs: "3px", md: "4px" },
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                borderRadius: "2px",
                opacity: 0.7,
              },
            }}
          >
            <InteractiveCalendar
              initialSymbol={DEFAULT_SYMBOL}
              initialViewType={VIEW_TYPES.DAILY}
              onDateSelect={handleDateSelect}
              onDateRangeSelect={handleDateRangeSelect}
              onDataUpdate={handleDataUpdate}
              onSymbolChange={handleSymbolChange}
              showLegend={true} // Show legend on all screen sizes with responsive design
              showTooltips={true}
              showControls={true}
              enableKeyboardNav={!isTouchDevice} // Disable keyboard nav on touch devices
              enableSelection={true}
              enableZoom={true}
              showVolatilityHeatmap={true}
              showLiquidityIndicators={!isMobile} // Simplify mobile view
              showPerformanceMetrics={true}
              // Responsive symbol list - fewer options on mobile
              availableSymbols={
                isMobile
                  ? ["BTCUSDT", "ETHUSDT", "ADAUSDT", "BNBUSDT"]
                  : [
                      "BTCUSDT",
                      "ETHUSDT",
                      "ADAUSDT",
                      "DOTUSDT",
                      "BNBUSDT",
                      "SOLUSDT",
                      "LINKUSDT",
                      "AVAXUSDT",
                    ]
              }
              // Touch-optimized settings
              isMobile={isMobile}
              isTouchDevice={isTouchDevice}
            />
          </Container>

          {/* Selected Date Info - Responsive positioning */}
          {selectedDate && selectedData && (
            <Paper
              elevation={8}
              sx={{
                position: "fixed",
                // Responsive positioning - avoid overlapping with range info
                ...(isMobile && selectedDateRange
                  ? {
                      top: 90, // Position at top when range is also shown
                      left: 10,
                      right: 10,
                      bottom: "auto",
                    }
                  : {
                      bottom: { xs: 10, sm: 20 },
                      right: { xs: 10, sm: 20 },
                      left: { xs: 10, sm: "auto" },
                    }),
                p: { xs: 2, sm: 3 },
                maxWidth: { xs: "calc(100vw - 20px)", sm: 320 },
                zIndex: 1000,
                borderRadius: { xs: "12px", sm: "16px" },
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: {
                  xs: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  sm: "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                },
                animation:
                  "slideInFromRight 0.5s ease-out, floatAnimation 3s ease-in-out infinite",
                transition: "all 0.3s ease",
                // Touch-friendly hover effects
                "&:hover": {
                  transform: {
                    xs: "translateY(-2px)", // Subtle on mobile
                    sm: "translateY(-4px) scale(1.02)", // Full effect on desktop
                  },
                  boxShadow: {
                    xs: "0 6px 24px rgba(0, 0, 0, 0.12)",
                    sm: "0 12px 40px rgba(0, 0, 0, 0.15)",
                  },
                },
                "@keyframes slideInFromRight": {
                  "0%": {
                    opacity: 0,
                    transform: "translateX(100px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                },
                "@keyframes floatAnimation": {
                  "0%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-2px)" },
                  "100%": { transform: "translateY(0px)" },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: "700",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  animation: "textShimmer 2s ease-in-out infinite alternate",
                  "@keyframes textShimmer": {
                    "0%": { opacity: 0.8 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                <CalendarToday
                  sx={{
                    fontSize: { xs: "1.3rem", sm: "1.5rem" },
                    mr: 1,
                    verticalAlign: "middle",
                  }}
                />
                {selectedDate.toDateString()}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  animation: "fadeInUp 0.6s ease-out 0.1s both",
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(10px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <strong>Close Price:</strong> $
                {selectedData.close?.toFixed(2) || "N/A"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  animation: "fadeInUp 0.6s ease-out 0.2s both",
                }}
              >
                <strong>Price Change:</strong>{" "}
                {selectedData.priceChange?.toFixed(2) || 0}%
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  animation: "fadeInUp 0.6s ease-out 0.3s both",
                }}
              >
                <strong>Volatility:</strong>{" "}
                {selectedData.volatility?.toFixed(2) || 0}%
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  animation: "fadeInUp 0.6s ease-out 0.4s both",
                }}
              >
                <strong>Volume:</strong>{" "}
                {selectedData.volume?.toLocaleString() || "N/A"}
              </Typography>
            </Paper>
          )}

          {/* Selected Date Range Info - Responsive positioning */}
          {selectedDateRange && (
            <Paper
              elevation={8}
              sx={{
                position: "fixed",
                // Smart positioning based on device and other panels
                ...(isMobile
                  ? selectedDate && selectedData
                    ? {
                        bottom: 10, // Bottom position when date info is at top
                        left: 10,
                        right: 10,
                      }
                    : {
                        bottom: 10, // Default bottom position on mobile
                        left: 10,
                        right: 10,
                      }
                  : {
                      bottom: 20,
                      left: 20,
                      right: "auto",
                    }),
                p: { xs: 2, sm: 3 },
                maxWidth: { xs: "calc(100vw - 20px)", sm: 380 },
                zIndex: 1000,
                borderRadius: { xs: "12px", sm: "16px" },
                background:
                  "linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)",
                color: "white",
                backdropFilter: "blur(10px)",
                boxShadow: {
                  xs: "0 4px 20px rgba(25, 118, 210, 0.25)",
                  sm: "0 8px 32px rgba(25, 118, 210, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                },
                animation:
                  "slideInFromLeft 0.5s ease-out, pulseGlow 4s ease-in-out infinite",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: {
                    xs: "translateY(-2px)",
                    sm: "translateY(-4px) scale(1.02)",
                  },
                  boxShadow: {
                    xs: "0 6px 24px rgba(25, 118, 210, 0.35)",
                    sm: "0 12px 40px rgba(25, 118, 210, 0.4)",
                  },
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
                  borderRadius: "16px",
                  opacity: 0.6,
                },
                "@keyframes slideInFromLeft": {
                  "0%": {
                    opacity: 0,
                    transform: "translateX(-100px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                },
                "@keyframes pulseGlow": {
                  "0%": { boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)" },
                  "50%": { boxShadow: "0 8px 32px rgba(25, 118, 210, 0.5)" },
                  "100%": { boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)" },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  color: "white",
                  fontWeight: "700",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  animation: "titleFadeIn 0.8s ease-out",
                  "@keyframes titleFadeIn": {
                    "0%": { opacity: 0, transform: "translateY(-10px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Analytics
                  sx={{
                    fontSize: { xs: "1.3rem", sm: "1.5rem" },
                    mr: 1,
                    verticalAlign: "middle",
                  }}
                />
                Date Range Selected
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.95)",
                  mb: 1,
                  animation: "fadeInUp 0.6s ease-out 0.1s both",
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(10px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <strong>From:</strong>{" "}
                {selectedDateRange.start.toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.95)",
                  mb: 1,
                  animation: "fadeInUp 0.6s ease-out 0.2s both",
                }}
              >
                <strong>To:</strong>{" "}
                {selectedDateRange.end.toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.95)",
                  mb: 2,
                  animation: "fadeInUp 0.6s ease-out 0.3s both",
                }}
              >
                <strong>Duration:</strong>{" "}
                {Math.ceil(
                  (selectedDateRange.end - selectedDateRange.start) /
                    (1000 * 60 * 60 * 24)
                ) + 1}{" "}
                days
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontStyle: "italic",
                  animation:
                    "fadeInUp 0.6s ease-out 0.4s both, subtleGlow 3s ease-in-out infinite",
                  "@keyframes subtleGlow": {
                    "0%": { opacity: 0.8 },
                    "50%": { opacity: 1 },
                    "100%": { opacity: 0.8 },
                  },
                }}
              >
                Use this range for custom analysis
              </Typography>
            </Paper>
          )}

          {/* Notifications */}
          <Snackbar
            open={notification.open}
            autoHideDuration={3000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleNotificationClose}
              severity={notification.severity}
              variant="filled"
            >
              {notification.message}
            </Alert>
          </Snackbar>

          {/* Info Dialog */}
          <Dialog
            open={infoDialogOpen}
            onClose={handleInfoDialogClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "16px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(25, 118, 210, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: "1.3rem",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUp sx={{ mr: 1, fontSize: 28 }} />
                Dashboard Features Guide
              </Box>
              <IconButton
                onClick={handleInfoDialogClose}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.6,
                  color: "text.secondary",
                  fontSize: "1.1rem",
                }}
              >
                Explore advanced cryptocurrency market analysis with our
                interactive calendar dashboard featuring real-time data
                visualization and comprehensive technical indicators.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      border: "1px solid rgba(25, 118, 210, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
                    >
                      📅 Interactive Calendar
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                      Navigate through dates with intuitive controls. Click any
                      date to view detailed market data and analysis.
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        label="Date Selection"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="Range Picker"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="Keyboard Navigation"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                      border: "1px solid rgba(255, 152, 0, 0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 2, color: "#f57c00" }}
                    >
                      🔥 Volatility Heatmap
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                      Visual representation of market volatility with
                      color-coded intensity indicators.
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        label="Color Coding"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="Intensity Scale"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="Real-time Updates"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                      border: "1px solid rgba(76, 175, 80, 0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 2, color: "#388e3c" }}
                    >
                      💧 Liquidity Indicators
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                      Track market liquidity and trading volume patterns across
                      different timeframes.
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        label="Volume Analysis"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="Liquidity Metrics"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="Flow Patterns"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                      border: "1px solid rgba(156, 39, 176, 0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 2, color: "#7b1fa2" }}
                    >
                      📊 Performance Metrics
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                      Comprehensive performance analysis with advanced technical
                      indicators and trend analysis.
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        label="Technical Analysis"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="Trend Indicators"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label="Performance Stats"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                  border: "1px solid rgba(33, 150, 243, 0.2)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}
                >
                  🚀 Getting Started
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                  1. Select a cryptocurrency symbol from the dropdown menu
                  <br />
                  2. Choose your preferred view (Daily, Weekly, Monthly)
                  <br />
                  3. Click on any date to view detailed analysis
                  <br />
                  4. Use date range selection for comparative analysis
                  <br />
                  5. Explore the scientific dashboard for advanced insights
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={handleInfoDialogClose}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: "8px",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Got it!
              </Button>
            </DialogActions>
          </Dialog>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              mt: 6,
              py: 3,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)",
              backdropFilter: "blur(5px)",
              borderTop: "1px solid rgba(25, 118, 210, 0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.5), transparent)",
                animation: "lineShimmer 3s infinite",
              },
              "@keyframes lineShimmer": {
                "0%": { left: "-100%" },
                "100%": { left: "100%" },
              },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                animation: "fadeInUp 1s ease-out",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "primary.main",
                  transform: "translateY(-1px)",
                },
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(10px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              Powered by Binance API • Real-time cryptocurrency market data
              visualization
            </Typography>
          </Box>

          {/* Floating Action Buttons - FAB Style */}
          <Box
            sx={{
              position: "fixed",
              bottom: { xs: 24, md: 32 },
              right: { xs: 24, md: 32 },
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Theme Selection Button */}
            <IconButton
              onClick={(event) => setThemeMenuAnchor(event.currentTarget)}
              sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                backgroundColor: "secondary.main",
                color: "white",
                boxShadow: "0 6px 20px rgba(220, 0, 78, 0.4)",
                "&:hover": {
                  backgroundColor: "secondary.dark",
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: "0 8px 24px rgba(220, 0, 78, 0.6)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Palette />
            </IconButton>

            {/* Export Menu Button */}
            <IconButton
              onClick={(event) => setExportMenuAnchor(event.currentTarget)}
              sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                backgroundColor: "success.main",
                color: "white",
                boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                "&:hover": {
                  backgroundColor: "success.dark",
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: "0 8px 24px rgba(76, 175, 80, 0.6)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <GetApp />
            </IconButton>

            {/* Alerts Toggle Button */}
            <IconButton
              onClick={toggleAlerts}
              sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                backgroundColor: alertsEnabled ? "warning.main" : "grey.500",
                color: "white",
                boxShadow: `0 6px 20px rgba(${
                  alertsEnabled ? "255, 152, 0" : "158, 158, 158"
                }, 0.4)`,
                "&:hover": {
                  backgroundColor: alertsEnabled ? "warning.dark" : "grey.600",
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: `0 8px 24px rgba(${
                    alertsEnabled ? "255, 152, 0" : "158, 158, 158"
                  }, 0.6)`,
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Notifications />
            </IconButton>

            {/* Info Button */}
            <IconButton
              onClick={handleInfoDialogOpen}
              sx={{
                width: { xs: 56, md: 64 },
                height: { xs: 56, md: 64 },
                backgroundColor: "primary.main",
                color: "white",
                boxShadow: "0 8px 24px rgba(25, 118, 210, 0.4)",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  transform: "translateY(-4px) scale(1.05)",
                  boxShadow: "0 12px 32px rgba(25, 118, 210, 0.6)",
                },
                "&:active": {
                  transform: "translateY(-2px) scale(1.02)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                // Subtle bounce animation
                animation: "fabFloat 4s ease-in-out infinite",
                "@keyframes fabFloat": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-4px)" },
                },
                // Pulse effect on hover
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(0)",
                  transition: "transform 0.3s ease",
                },
                "&:hover::before": {
                  transform: "scale(1)",
                },
                // Add a subtle glow
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(45deg, rgba(25, 118, 210, 0.2), rgba(66, 165, 245, 0.2))",
                  opacity: 0,
                  zIndex: -1,
                  transition: "opacity 0.3s ease",
                },
                "&:hover::after": {
                  opacity: 1,
                },
              }}
            >
              <Info sx={{ fontSize: { xs: 28, md: 32 } }} />
            </IconButton>
          </Box>

          {/* Theme Selection Menu */}
          <Menu
            anchorEl={themeMenuAnchor}
            open={Boolean(themeMenuAnchor)}
            onClose={() => setThemeMenuAnchor(null)}
            transformOrigin={{ horizontal: "right", vertical: "bottom" }}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
          >
            {getThemeNames().map((theme) => (
              <MenuItem
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                selected={currentTheme === theme.id}
              >
                <ListItemIcon>
                  <Palette
                    color={currentTheme === theme.id ? "primary" : "inherit"}
                  />
                </ListItemIcon>
                <ListItemText primary={theme.name} />
              </MenuItem>
            ))}
          </Menu>

          {/* Export Menu */}
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => setExportMenuAnchor(null)}
            transformOrigin={{ horizontal: "right", vertical: "bottom" }}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
          >
            <MenuItem onClick={() => handleExport("pdf")}>
              <ListItemIcon>
                <GetApp />
              </ListItemIcon>
              <ListItemText primary="Export as PDF" />
            </MenuItem>
            <MenuItem onClick={() => handleExport("csv")}>
              <ListItemIcon>
                <GetApp />
              </ListItemIcon>
              <ListItemText primary="Export as CSV" />
            </MenuItem>
            <MenuItem onClick={() => handleExport("image")}>
              <ListItemIcon>
                <GetApp />
              </ListItemIcon>
              <ListItemText primary="Export as Image" />
            </MenuItem>
          </Menu>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
