import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

/**
 * Export Utilities for Interactive Crypto Calendar
 * Provides PDF, CSV, and image export functionality
 */

// Export calendar data as PDF
export const exportToPDF = async (data, options = {}) => {
  const {
    title = "Crypto Market Calendar",
    dateRange = null,
    symbol = "BTCUSDT",
    includeCharts = true,
    orientation = "landscape",
    filename = `crypto-calendar-${symbol}-${
      new Date().toISOString().split("T")[0]
    }.pdf`,
  } = options;

  try {
    // Validate data
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error(
        "No data available for export. Please ensure calendar data is loaded."
      );
    }

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: "a4",
    });

    // Add header
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, 20, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Symbol: ${symbol}`, 20, 30);

    if (dateRange && dateRange.start && dateRange.end) {
      pdf.text(
        `Period: ${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`,
        20,
        36
      );
    }

    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 42);

    // Add summary statistics
    const summaryData = calculateSummaryStats(data);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Market Summary", 20, 55);

    const summaryTable = [
      ["Metric", "Value"],
      ["Average Price", `$${summaryData.avgPrice.toFixed(2)}`],
      [
        "Price Range",
        `$${summaryData.priceRange.min.toFixed(
          2
        )} - $${summaryData.priceRange.max.toFixed(2)}`,
      ],
      ["Total Volume", `$${(summaryData.totalVolume / 1e9).toFixed(2)}B`],
      ["Avg Volatility", `${summaryData.avgVolatility.toFixed(2)}%`],
      [
        "Best Day",
        `${summaryData.bestDay.date} (+${summaryData.bestDay.change.toFixed(
          2
        )}%)`,
      ],
      [
        "Worst Day",
        `${summaryData.worstDay.date} (${summaryData.worstDay.change.toFixed(
          2
        )}%)`,
      ],
    ];

    autoTable(pdf, {
      head: [summaryTable[0]],
      body: summaryTable.slice(1),
      startY: 60,
      theme: "striped",
      headStyles: { fillColor: [25, 118, 210] },
      styles: { fontSize: 10 },
    });

    // Add detailed data table
    const finalY = pdf.lastAutoTable.finalY + 10;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Daily Data", 20, finalY);

    const tableData = data.map((item) => [
      item.date,
      `$${item.open?.toFixed(2) || "N/A"}`,
      `$${item.high?.toFixed(2) || "N/A"}`,
      `$${item.low?.toFixed(2) || "N/A"}`,
      `$${item.close?.toFixed(2) || "N/A"}`,
      `${item.changePercent?.toFixed(2) || "N/A"}%`,
      `${(item.volume / 1e6).toFixed(2)}M`,
      `${item.volatility?.toFixed(2) || "N/A"}%`,
    ]);

    autoTable(pdf, {
      head: [
        [
          "Date",
          "Open",
          "High",
          "Low",
          "Close",
          "Change %",
          "Volume",
          "Volatility",
        ],
      ],
      body: tableData,
      startY: finalY + 5,
      theme: "striped",
      headStyles: { fillColor: [25, 118, 210] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
      },
    });

    // Save the PDF
    const fileName = `crypto-calendar-${symbol}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error("PDF export failed:", error);
    return { success: false, error: error.message };
  }
};

// Export calendar data as CSV
export const exportToCSV = (data, options = {}) => {
  const {
    filename = `crypto-calendar-${new Date().toISOString().split("T")[0]}.csv`,
    symbol = "BTCUSDT",
  } = options;

  try {
    // Validate data
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error(
        "No data available for export. Please ensure calendar data is loaded."
      );
    }
    // Define CSV headers
    const headers = [
      "Date",
      "Symbol",
      "Open",
      "High",
      "Low",
      "Close",
      "Volume",
      "Change %",
      "Volatility %",
      "Liquidity Score",
      "Market Sentiment",
    ];

    // Convert data to CSV format
    const csvData = data.map((item) => [
      item.date || "",
      symbol,
      item.open?.toFixed(2) || "",
      item.high?.toFixed(2) || "",
      item.low?.toFixed(2) || "",
      item.close?.toFixed(2) || "",
      item.volume?.toFixed(0) || "",
      item.changePercent?.toFixed(2) || "",
      item.volatility?.toFixed(2) || "",
      item.liquidityScore?.toFixed(2) || "",
      item.sentiment || "",
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    // Create and download blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);

    return { success: true, filename };
  } catch (error) {
    console.error("CSV export failed:", error);
    return { success: false, error: error.message };
  }
};

// Export calendar as image
export const exportToImage = async (elementId, options = {}) => {
  const {
    filename = `crypto-calendar-${new Date().toISOString().split("T")[0]}.png`,
    format = "png",
    quality = 1.0,
    backgroundColor = "#ffffff",
    scale = 2,
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Convert to blob and download
    canvas.toBlob(
      (blob) => {
        saveAs(blob, filename);
      },
      `image/${format}`,
      quality
    );

    return { success: true, filename };
  } catch (error) {
    console.error("Image export failed:", error);
    return { success: false, error: error.message };
  }
};

// Calculate summary statistics for PDF export
const calculateSummaryStats = (data) => {
  if (!data || data.length === 0) return {};

  const prices = data.map((item) => item.close).filter(Boolean);
  const volumes = data.map((item) => item.volume).filter(Boolean);
  const volatilities = data.map((item) => item.volatility).filter(Boolean);
  const changes = data.map((item) => item.changePercent).filter(Boolean);

  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const totalVolume = volumes.reduce((a, b) => a + b, 0);
  const avgVolatility =
    volatilities.reduce((a, b) => a + b, 0) / volatilities.length;

  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };

  const bestDayIndex = changes.indexOf(Math.max(...changes));
  const worstDayIndex = changes.indexOf(Math.min(...changes));

  const bestDay = {
    date: data[bestDayIndex]?.date || "N/A",
    change: changes[bestDayIndex] || 0,
  };

  const worstDay = {
    date: data[worstDayIndex]?.date || "N/A",
    change: changes[worstDayIndex] || 0,
  };

  return {
    avgPrice,
    priceRange,
    totalVolume,
    avgVolatility,
    bestDay,
    worstDay,
  };
};

// Export configuration for different formats
export const exportFormats = {
  PDF: "pdf",
  CSV: "csv",
  PNG: "png",
  JPEG: "jpeg",
};

// Default export options
export const defaultExportOptions = {
  pdf: {
    orientation: "landscape",
    includeCharts: true,
    includeAnalysis: true,
  },
  csv: {
    includeHeaders: true,
    dateFormat: "YYYY-MM-DD",
  },
  image: {
    format: "png",
    quality: 1.0,
    scale: 2,
    backgroundColor: "#ffffff",
  },
};
