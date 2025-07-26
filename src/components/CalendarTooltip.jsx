import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  useTheme,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart,
  BarChart,
  Timeline,
  AccessTime,
  LocalFireDepartment,
  WaterDrop,
} from "@mui/icons-material";
import { format } from "date-fns";

/**
 * Enhanced tooltip component for calendar cells with detailed metrics
 * @param {Object} props - Component props
 * @returns {React.Component} CalendarTooltip component
 */
const CalendarTooltip = ({
  date,
  cellData,
  symbol = "BTCUSDT",
  isOpen = false,
  anchorEl = null,
  onClose = () => {},
}) => {
  const theme = useTheme();

  if (!cellData || !isOpen) return null;

  const {
    open = 0,
    high = 0,
    low = 0,
    close = 0,
    volume = 0,
    volatility = 0,
    performance = {},
    liquidity = {},
  } = cellData;

  const priceChange = performance.priceChange || 0;
  const direction = performance.direction || "neutral";

  // Modern color palette
  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    neutral: "#6b7280",
    purple: "#8b5cf6",
    blue: "#3b82f6",
    background: {
      primary: `linear-gradient(135deg, 
        ${alpha(theme.palette.background.paper, 0.98)} 0%, 
        ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
      accent: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.08)} 0%, 
        ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
    },
  };

  // Price change indicator with enhanced colors
  const PriceIcon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
      ? TrendingDown
      : TrendingFlat;

  const priceColor =
    direction === "up"
      ? colors.success
      : direction === "down"
      ? colors.error
      : colors.neutral;

  // Enhanced volatility level with modern colors
  const getVolatilityLevel = (vol) => {
    if (vol < 2)
      return {
        label: "Low",
        color: colors.success,
        icon: WaterDrop,
        bgColor: alpha(colors.success, 0.1),
      };
    if (vol < 5)
      return {
        label: "Medium",
        color: colors.warning,
        icon: ShowChart,
        bgColor: alpha(colors.warning, 0.1),
      };
    return {
      label: "High",
      color: colors.error,
      icon: LocalFireDepartment,
      bgColor: alpha(colors.error, 0.1),
    };
  };

  const volatilityInfo = getVolatilityLevel(volatility);

  // Enhanced volume classification
  const getVolumeLevel = (vol) => {
    if (vol < 1000000)
      return {
        label: "Low",
        color: colors.neutral,
        bgColor: alpha(colors.neutral, 0.1),
      };
    if (vol < 10000000)
      return {
        label: "Medium",
        color: colors.blue,
        bgColor: alpha(colors.blue, 0.1),
      };
    return {
      label: "High",
      color: colors.success,
      bgColor: alpha(colors.success, 0.1),
    };
  };

  const volumeInfo = getVolumeLevel(volume);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "absolute",
        zIndex: 9999,
        minWidth: 360,
        maxWidth: 420,
        background: colors.background.primary,
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: `
          0 20px 60px ${alpha("#000000", 0.15)},
          0 8px 32px ${alpha("#000000", 0.1)},
          inset 0 1px 0 ${alpha("#ffffff", 0.2)}
        `,
        transform: "translateY(-8px) scale(0.95)",
        animation:
          "tooltipEntry 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, 
            ${colors.success} 0%, 
            ${colors.blue} 33%, 
            ${colors.purple} 66%, 
            ${colors.warning} 100%)`,
          backgroundSize: "200% 100%",
          animation: "gradientShift 3s ease-in-out infinite",
        },
        "@keyframes tooltipEntry": {
          "0%": {
            opacity: 0,
            transform: "translateY(-16px) scale(0.8) rotateX(-10deg)",
            filter: "blur(4px)",
          },
          "60%": {
            transform: "translateY(-6px) scale(1.02) rotateX(2deg)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(-8px) scale(1) rotateX(0deg)",
            filter: "blur(0px)",
          },
        },
        "@keyframes gradientShift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      }}
    >
      {/* Animated Header */}
      <Box
        sx={{
          background: colors.background.accent,
          p: 3,
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "80px",
            height: "80px",
            background: `radial-gradient(circle, 
              ${alpha(theme.palette.primary.main, 0.1)} 0%, 
              transparent 70%)`,
            borderRadius: "50%",
            transform: "translate(30px, -30px)",
            animation: "float 4s ease-in-out infinite",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `conic-gradient(from 0deg, 
              transparent 0deg, 
              ${alpha(theme.palette.primary.main, 0.03)} 45deg, 
              transparent 90deg, 
              ${alpha(theme.palette.secondary.main, 0.03)} 135deg, 
              transparent 180deg)`,
            animation: "rotate 8s linear infinite",
          },
          "@keyframes float": {
            "0%, 100%": { transform: "translate(30px, -30px) scale(1)" },
            "50%": { transform: "translate(35px, -25px) scale(1.1)" },
          },
          "@keyframes rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.success}, ${colors.blue})`,
              mr: 1.5,
              boxShadow: `0 0 12px ${alpha(colors.success, 0.4)}`,
              animation: "pulse 2s ease-in-out infinite",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: "-2px",
                left: "-2px",
                right: "-2px",
                bottom: "-2px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.success}, ${colors.blue})`,
                opacity: 0.3,
                animation: "ripple 2s ease-in-out infinite",
                zIndex: -1,
              },
              "@keyframes pulse": {
                "0%, 100%": {
                  boxShadow: `0 0 12px ${alpha(colors.success, 0.4)}`,
                  transform: "scale(1)",
                },
                "50%": {
                  boxShadow: `0 0 20px ${alpha(colors.success, 0.6)}`,
                  transform: "scale(1.1)",
                },
              },
              "@keyframes ripple": {
                "0%": {
                  transform: "scale(1)",
                  opacity: 0.3,
                },
                "100%": {
                  transform: "scale(2)",
                  opacity: 0,
                },
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              background: `linear-gradient(135deg, 
                ${theme.palette.text.primary} 0%, 
                ${theme.palette.primary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "textGlow 3s ease-in-out infinite alternate",
              "@keyframes textGlow": {
                "0%": {
                  filter: "brightness(1)",
                  textShadow: "none",
                },
                "100%": {
                  filter: "brightness(1.2)",
                  textShadow: `0 0 10px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                },
              },
            }}
          >
            {symbol.replace("USDT", "/USD")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTime
            sx={{
              fontSize: 14,
              color: alpha(theme.palette.text.secondary, 0.7),
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.text.secondary, 0.8),
              fontWeight: 500,
              fontSize: "0.85rem",
            }}
          >
            {format(date, "EEEE, MMM dd, yyyy")}
          </Typography>
        </Box>
      </Box>

      {/* Price Information with Modern Cards */}
      <Box sx={{ p: 3, pt: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: "0.9rem",
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ShowChart sx={{ fontSize: 16, color: theme.palette.primary.main }} />
          Price Data
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: "Open", value: open, color: colors.neutral },
            { label: "Close", value: close, color: colors.blue },
            { label: "High", value: high, color: colors.success },
            { label: "Low", value: low, color: colors.error },
          ].map((item, index) => (
            <Grid item xs={6} key={item.label}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, 
                    ${alpha(item.color, 0.08)} 0%, 
                    ${alpha(item.color, 0.04)} 100%)`,
                  border: `1px solid ${alpha(item.color, 0.12)}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation: `cardSlideIn 0.6s ease-out ${index * 0.1}s both`,
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: `
                      0 8px 25px ${alpha(item.color, 0.25)},
                      0 0 20px ${alpha(item.color, 0.1)}
                    `,
                    "& .price-value": {
                      transform: "scale(1.1)",
                    },
                    "&::after": {
                      opacity: 1,
                    },
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(90deg, 
                      transparent, 
                      ${alpha(item.color, 0.1)}, 
                      transparent)`,
                    transition: "all 0.5s ease",
                    opacity: 0,
                  },
                  "&:hover::after": {
                    left: "100%",
                    opacity: 1,
                  },
                  "@keyframes cardSlideIn": {
                    "0%": {
                      opacity: 0,
                      transform: "translateX(-20px) rotateY(-15deg)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateX(0) rotateY(0deg)",
                    },
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.8),
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: item.color,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    mt: 0.5,
                    transition: "all 0.3s ease",
                  }}
                  className="price-value"
                >
                  ${item.value.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Price Change Badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            animation:
              "bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.4s both",
            "@keyframes bounceIn": {
              "0%": {
                opacity: 0,
                transform: "scale(0.3) rotate(-10deg)",
              },
              "50%": {
                transform: "scale(1.05) rotate(2deg)",
              },
              "70%": {
                transform: "scale(0.9) rotate(-1deg)",
              },
              "100%": {
                opacity: 1,
                transform: "scale(1) rotate(0deg)",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: "24px",
              background: `linear-gradient(135deg, 
                ${alpha(priceColor, 0.15)} 0%, 
                ${alpha(priceColor, 0.08)} 100%)`,
              border: `1px solid ${alpha(priceColor, 0.2)}`,
              boxShadow: `0 4px 12px ${alpha(priceColor, 0.2)}`,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: `0 6px 20px ${alpha(priceColor, 0.3)}`,
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: `linear-gradient(90deg, 
                  transparent, 
                  ${alpha("#ffffff", 0.2)}, 
                  transparent)`,
                animation: "shine 2s ease-in-out infinite",
              },
              "@keyframes shine": {
                "0%": { left: "-100%" },
                "50%": { left: "100%" },
                "100%": { left: "100%" },
              },
            }}
          >
            <PriceIcon
              sx={{
                color: priceColor,
                fontSize: 18,
                animation:
                  direction !== "neutral"
                    ? "iconBounce 1s ease-in-out infinite"
                    : "none",
                "@keyframes iconBounce": {
                  "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
                  "50%": { transform: "translateY(-2px) rotate(5deg)" },
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: priceColor,
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              {priceChange > 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </Typography>
          </Box>
        </Box>

        {/* Market Metrics */}
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: "0.9rem",
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BarChart sx={{ fontSize: 16, color: theme.palette.primary.main }} />
          Market Metrics
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Volatility */}
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              background: volatilityInfo.bgColor,
              border: `1px solid ${alpha(volatilityInfo.color, 0.2)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              animation: "slideInLeft 0.6s ease-out 0.6s both",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateX(4px)",
                boxShadow: `0 4px 15px ${alpha(volatilityInfo.color, 0.2)}`,
              },
              "@keyframes slideInLeft": {
                "0%": {
                  opacity: 0,
                  transform: "translateX(-30px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateX(0)",
                },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <volatilityInfo.icon
                sx={{
                  color: volatilityInfo.color,
                  fontSize: 20,
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  Volatility
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.8),
                  }}
                >
                  24h price swing
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: volatilityInfo.color,
                  fontSize: "1rem",
                }}
              >
                {volatility.toFixed(2)}%
              </Typography>
              <Chip
                label={volatilityInfo.label}
                size="small"
                sx={{
                  backgroundColor: volatilityInfo.color,
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  height: 24,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Volume */}
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              background: volumeInfo.bgColor,
              border: `1px solid ${alpha(volumeInfo.color, 0.2)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              animation: "slideInRight 0.6s ease-out 0.7s both",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateX(-4px)",
                boxShadow: `0 4px 15px ${alpha(volumeInfo.color, 0.2)}`,
              },
              "@keyframes slideInRight": {
                "0%": {
                  opacity: 0,
                  transform: "translateX(30px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateX(0)",
                },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <BarChart
                sx={{
                  color: volumeInfo.color,
                  fontSize: 20,
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  Trading Volume
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.8),
                  }}
                >
                  24h total trades
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: volumeInfo.color,
                  fontSize: "0.85rem",
                }}
              >
                {(volume / 1000000).toFixed(1)}M
              </Typography>
              <Chip
                label={volumeInfo.label}
                size="small"
                sx={{
                  backgroundColor: volumeInfo.color,
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  height: 24,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Liquidity Score */}
          {liquidity.volumeNormalized && (
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                background: alpha(colors.purple, 0.08),
                border: `1px solid ${alpha(colors.purple, 0.2)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                animation: "fadeInUp 0.6s ease-out 0.8s both",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px) scale(1.02)",
                  boxShadow: `0 6px 20px ${alpha(colors.purple, 0.25)}`,
                },
                "@keyframes fadeInUp": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Timeline
                  sx={{
                    color: colors.purple,
                    fontSize: 20,
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Liquidity Score
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha(theme.palette.text.secondary, 0.8),
                    }}
                  >
                    Market depth indicator
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: colors.purple,
                  fontSize: "1rem",
                }}
              >
                {liquidity.volumeNormalized.toFixed(2)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer with subtle animation */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            textAlign: "center",
            animation: "slideUp 0.6s ease-out 1s both",
            "@keyframes slideUp": {
              "0%": {
                opacity: 0,
                transform: "translateY(10px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.text.secondary, 0.7),
              fontStyle: "italic",
              fontSize: "0.75rem",
              background: `linear-gradient(90deg, 
                ${alpha(theme.palette.text.secondary, 0.7)} 0%, 
                ${alpha(theme.palette.primary.main, 0.8)} 50%, 
                ${alpha(theme.palette.text.secondary, 0.7)} 100%)`,
              backgroundSize: "200% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s ease-in-out infinite",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                animationDuration: "2s",
              },
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }}
          >
            💡 Click for detailed analysis • Drag to select range
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CalendarTooltip;
