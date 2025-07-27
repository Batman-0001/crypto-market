import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Dashboard,
  TouchApp,
  Keyboard,
  DateRange,
  Analytics,
  TrendingUp,
  BarChart,
  Timeline,
  Assessment,
} from "@mui/icons-material";

/**
 * Dashboard Features Guide component
 * Shows users how to use the new Data Dashboard Panel
 */
const DashboardFeaturesGuide = ({ onDemoClick = () => {} }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const features = [
    {
      icon: TouchApp,
      title: "Double-Click to Open",
      description: "Double-click any date cell to open the detailed dashboard",
      color: theme.palette.primary.main,
    },
    {
      icon: Keyboard,
      title: "Keyboard Shortcuts",
      description: "Press Ctrl+D to open dashboard for selected date",
      color: theme.palette.secondary.main,
    },
    {
      icon: DateRange,
      title: "Date Range Analysis",
      description:
        "Select date range and press Ctrl+Shift+D for period analysis",
      color: theme.palette.success.main,
    },
    {
      icon: Analytics,
      title: "Technical Indicators",
      description: "View RSI, MACD, Bollinger Bands, and moving averages",
      color: theme.palette.warning.main,
    },
    {
      icon: TrendingUp,
      title: "Performance Metrics",
      description: "Compare daily, weekly, monthly, and yearly performance",
      color: theme.palette.info.main,
    },
    {
      icon: Assessment,
      title: "Benchmark Comparison",
      description:
        "Analyze correlation, beta, alpha, and Sharpe ratio vs S&P 500",
      color: theme.palette.error.main,
    },
  ];

  const shortcuts = [
    { key: "Double-click", action: "Open dashboard for date" },
    { key: "Ctrl + D", action: "Open dashboard for selected date" },
    { key: "Ctrl + Shift + D", action: "Open dashboard for date range" },
    { key: "Escape", action: "Close dashboard" },
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.02)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Dashboard
          sx={{
            color: theme.palette.primary.main,
            fontSize: 28,
            mr: 1.5,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
          📊 New Data Dashboard Panel
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {expanded ? "Hide Details" : "Learn More"}
        </Button>
      </Box>

      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          mb: 2,
          fontSize: "1rem",
        }}
      >
        🚀 Experience comprehensive market analysis with our new interactive
        dashboard featuring{" "}
        <strong>
          technical indicators, volatility analysis, performance metrics, and
          benchmark comparisons!
        </strong>
      </Typography>

      {expanded && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            ✨ Key Features
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 2,
              mb: 3,
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha(feature.color, 0.08),
                  border: `1px solid ${alpha(feature.color, 0.12)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${alpha(feature.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <feature.icon
                    sx={{
                      color: feature.color,
                      fontSize: 20,
                      mr: 1,
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.85rem",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            ⌨️ Keyboard Shortcuts
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 1,
            }}
          >
            {shortcuts.map((shortcut, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: 1.5,
                  background: alpha(theme.palette.background.paper, 0.6),
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                }}
              >
                <Chip
                  label={shortcut.key}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.8rem",
                    ml: 1,
                  }}
                >
                  {shortcut.action}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, 
                ${alpha(theme.palette.success.main, 0.1)} 0%, 
                ${alpha(theme.palette.info.main, 0.1)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                mb: 1,
              }}
            >
              🎯 Pro Tip:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.9rem",
              }}
            >
              Try double-clicking on different dates to see how market
              conditions change over time. Use the dashboard to identify
              patterns in volatility, volume, and technical indicators that
              could inform your trading strategies!
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default DashboardFeaturesGuide;
