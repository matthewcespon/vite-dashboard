import { ChartOptions } from "chart.js";

export const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#111827",
      bodyColor: "#374151",
      borderColor: "#E5E7EB",
      borderWidth: 1,
      padding: 8,
      boxPadding: 4,
      titleFont: {
        size: 13,
        weight: "normal",
        family: "'Inter', sans-serif",
      },
      bodyFont: {
        size: 12,
        family: "'Inter', sans-serif",
      },
      cornerRadius: 4,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#9CA3AF",
        font: {
          size: 10,
          family: "'Inter', sans-serif",
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#F3F4F6",
      },
      ticks: {
        color: "#9CA3AF",
        font: {
          size: 10,
          family: "'Inter', sans-serif",
        },
      },
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  elements: {
    line: {
      borderJoinStyle: "miter",
      capBezierPoints: false,
    },
  },
};
