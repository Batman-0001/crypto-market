import React, { useState } from "react";
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
} from "@mui/material";
import InteractiveCalendar from "./components/InteractiveCalendar";
import { DEFAULT_SYMBOL, VIEW_TYPES } from "./constants";

// Create Material-UI theme
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
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            py: 3,
            mb: 0,
            borderRadius: 0,
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white",
          }}
        >
          <Container maxWidth="xl">
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              🚀 Crypto Market Calendar
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Interactive cryptocurrency market data visualization with
              volatility heatmaps, liquidity indicators, and performance metrics
            </Typography>
          </Container>
        </Paper>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 0 }}>
          <InteractiveCalendar
            initialSymbol={DEFAULT_SYMBOL}
            initialViewType={VIEW_TYPES.DAILY}
            onDateSelect={handleDateSelect}
            onDateRangeSelect={handleDateRangeSelect}
            onDataUpdate={handleDataUpdate}
            showLegend={true}
            showTooltips={true}
            showControls={true}
            enableKeyboardNav={true}
            enableSelection={true}
            enableZoom={true}
            showVolatilityHeatmap={true}
            showLiquidityIndicators={true}
            showPerformanceMetrics={true}
            availableSymbols={[
              "BTCUSDT",
              "ETHUSDT",
              "ADAUSDT",
              "DOTUSDT",
              "BNBUSDT",
              "SOLUSDT",
              "LINKUSDT",
              "AVAXUSDT",
            ]}
          />
        </Container>

        {/* Selected Date Info */}
        {selectedDate && selectedData && (
          <Paper
            elevation={3}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              p: 2,
              maxWidth: 300,
              zIndex: 1000,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              📅 {selectedDate.toDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Close Price:</strong> $
              {selectedData.close?.toFixed(2) || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Price Change:</strong>{" "}
              {selectedData.priceChange?.toFixed(2) || 0}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Volatility:</strong>{" "}
              {selectedData.volatility?.toFixed(2) || 0}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Volume:</strong>{" "}
              {selectedData.volume?.toLocaleString() || "N/A"}
            </Typography>
          </Paper>
        )}

        {/* Selected Date Range Info */}
        {selectedDateRange && (
          <Paper
            elevation={3}
            sx={{
              position: "fixed",
              bottom: 20,
              left: 20,
              p: 2,
              maxWidth: 350,
              zIndex: 1000,
              backgroundColor: "primary.light",
              color: "white",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: "white" }}>
              📊 Date Range Selected
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              <strong>From:</strong>{" "}
              {selectedDateRange.start.toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              <strong>To:</strong> {selectedDateRange.end.toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              <strong>Duration:</strong>{" "}
              {Math.ceil(
                (selectedDateRange.end - selectedDateRange.start) /
                  (1000 * 60 * 60 * 24)
              ) + 1}{" "}
              days
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.8)", fontStyle: "italic" }}
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

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: 4,
            py: 2,
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Powered by Binance API • Real-time cryptocurrency market data
            visualization
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
