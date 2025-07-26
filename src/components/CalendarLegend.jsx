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
  Card,
  CardContent,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Whatshot,
  Speed,
  Visibility,
  FiberManualRecord,
} from "@mui/icons-material";
import {
  RiThermometerLine,
  RiBarChartLine,
  RiDropLine,
  RiLineChartLine,
  RiTimeLine,
} from "react-icons/ri";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [isExpanded, setIsExpanded] = useState(!isCompact);

  // Modern color palette matching CalendarControls
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
    <Card
      sx={{
        background: colors.surface.glass,
        backdropFilter: "blur(20px)",
        border: `1px solid ${colors.surface.border}`,
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: colors.warning.gradient,
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(245, 158, 11, 0.15)",
          transition: "all 0.3s ease",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <RiThermometerLine size={20} style={{ color: colors.warning.main }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: colors.warning.main,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            Volatility Heatmap
          </Typography>
        </Box>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          {volatilityLegend.map((item, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: { xs: 14, sm: 16 },
                    height: { xs: 14, sm: 16 },
                    backgroundColor: item.color,
                    borderRadius: "6px",
                    border: `1px solid ${alpha(colors.warning.main, 0.3)}`,
                    boxShadow: `0 2px 8px ${alpha(item.color, 0.3)}`,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            fontStyle: "italic",
          }}
        >
          Background color intensity indicates volatility level
        </Typography>
      </CardContent>
    </Card>
  );

  const renderPerformanceSection = () => (
    <Card
      sx={{
        background: colors.surface.glass,
        backdropFilter: "blur(20px)",
        border: `1px solid ${colors.surface.border}`,
        borderRadius: "16px",
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
          transition: "all 0.3s ease",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <RiLineChartLine size={20} style={{ color: colors.success.main }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: colors.success.main,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            Performance Metrics
          </Typography>
        </Box>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          {performanceLegend.map((item, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 4,
                    height: { xs: 14, sm: 16 },
                    backgroundColor: item.color,
                    borderRadius: 1,
                    boxShadow: `0 2px 8px ${alpha(item.color, 0.3)}`,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "14px", sm: "16px" },
                    color: item.color,
                    fontWeight: 600,
                  }}
                >
                  {item.symbol}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            fontStyle: "italic",
          }}
        >
          Left border color and arrow show price direction
        </Typography>
      </CardContent>
    </Card>
  );

  const renderLiquiditySection = () => (
    <Card
      sx={{
        background: colors.surface.glass,
        backdropFilter: "blur(20px)",
        border: `1px solid ${colors.surface.border}`,
        borderRadius: "16px",
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
          transition: "all 0.3s ease",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <RiDropLine size={20} style={{ color: colors.secondary.main }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: colors.secondary.main,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            Liquidity Indicators
          </Typography>
        </Box>

        {/* Background Patterns */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              display: "block",
              mb: 1,
              color: colors.secondary.main,
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
            }}
          >
            Background Patterns:
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {liquidityPatterns.map((item, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: { xs: 14, sm: 16 },
                      height: { xs: 14, sm: 16 },
                      backgroundImage: `radial-gradient(circle at 2px 2px, ${
                        colors.secondary.main
                      }${Math.floor(item.intensity * 255)
                        .toString(16)
                        .padStart(2, "0")} 1px, transparent 1px)`,
                      backgroundSize: "4px 4px",
                      border: `1px solid ${alpha(colors.secondary.main, 0.3)}`,
                      borderRadius: "6px",
                      boxShadow: `0 2px 8px ${alpha(
                        colors.secondary.main,
                        0.2
                      )}`,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.75rem" },
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Volume Bars */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              display: "block",
              mb: 1,
              color: colors.secondary.main,
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
            }}
          >
            Volume Bars:
          </Typography>
          <Grid container spacing={1}>
            {volumeIndicators.map((item, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: `${item.width}px`,
                      height: { xs: 2, sm: 3 },
                      backgroundColor: colors.secondary.main,
                      opacity: item.opacity,
                      borderRadius: 1,
                      boxShadow: `0 2px 8px ${alpha(
                        colors.secondary.main,
                        item.opacity * 0.3
                      )}`,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.75rem" },
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            fontStyle: "italic",
          }}
        >
          Patterns and bars indicate trading volume levels
        </Typography>
      </CardContent>
    </Card>
  );

  const renderSpecialIndicators = () => (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        Special Indicators
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FiberManualRecord sx={{ fontSize: "8px", color: "#f44336" }} />
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
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.1) 0%, 
          rgba(255, 255, 255, 0.05) 100%)`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${colors.surface.border}`,
        borderRadius: { xs: "16px", sm: "20px" },
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
          borderRadius: { xs: "16px", sm: "20px" },
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
      {/* Modern Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: { xs: 2, sm: 3 },
          cursor: "pointer",
          position: "relative",
          zIndex: 2,
          borderRadius: { xs: "16px 16px 0 0", sm: "20px 20px 0 0" },
          "&:hover": {
            background: alpha(colors.primary.main, 0.05),
          },
          transition: "all 0.3s ease",
        }}
        onClick={toggleExpanded}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: "14px",
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
                borderRadius: "16px",
                opacity: 0.3,
                filter: "blur(8px)",
              },
            }}
          >
            <Visibility
              sx={{
                color: "white",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>
          <Box>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              sx={{
                fontWeight: 800,
                background: colors.primary.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.1rem", sm: "1.3rem" },
              }}
            >
              Data Visualization Guide
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.text.primary, 0.6),
                fontWeight: 500,
                mt: 0.5,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Understanding market indicators
            </Typography>
          </Box>
        </Box>

        <Tooltip title={isExpanded ? "Collapse Guide" : "Expand Guide"} arrow>
          <IconButton
            sx={{
              width: { xs: 36, sm: 44 },
              height: { xs: 36, sm: 44 },
              borderRadius: "12px",
              background: colors.surface.glass,
              backdropFilter: "blur(10px)",
              border: `1px solid ${colors.surface.border}`,
              color: colors.primary.main,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
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

      {/* Modern Content */}
      <Collapse in={isExpanded}>
        <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
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
              <Card
                sx={{
                  background: colors.surface.glass,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${colors.surface.border}`,
                  borderRadius: "16px",
                  mt: 1,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  {renderSpecialIndicators()}
                  {renderDataRanges()}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CalendarLegend;
