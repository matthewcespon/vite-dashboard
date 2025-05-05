import React, { useState, useRef } from "react";
import {
  Divider,
  Box,
  Tabs,
  Tab,
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DetailedReport } from "../../utils/detailedReport";
import styles from "./ReportsTable.module.css";
import Status from "../Status/Status";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "../Button/Button";
import { formatDate } from "../../utils/date-util";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TabContentProps {
  reportDetail: DetailedReport;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `report-tab-${index}`,
    "aria-controls": `report-tabpanel-${index}`,
  };
}

type TabSection = {
  title: string;
  content: (
    report: DetailedReport,
    formatDate: (date: string) => string
  ) => React.ReactNode;
};

const TabContent: React.FC<TabContentProps> = ({ reportDetail }) => {
  const [tabValue, setTabValue] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");

  const detailsRef = useRef<HTMLDivElement>(null);
  const findingsRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDownload = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    setGenerationProgress("Preparing document...");

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      let yPosition = margin;

      pdf.setFont("helvetica");

      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text(reportDetail.title, margin, yPosition + 10);
      yPosition += 20;

      const addTableRow = (
        label: string,
        value: string,
        x: number,
        y: number,
        maxWidth: number
      ): number => {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(label, x, y);

        pdf.setFont("helvetica", "normal");
        const valueX = x + 40;
        const valueWidth = maxWidth - 45;
        const valueLines = pdf.splitTextToSize(value, valueWidth);
        pdf.text(valueLines, valueX, y);

        const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;
        const rowHeight = Math.max(
          lineHeight + 2,
          valueLines.length * lineHeight
        );

        return y + rowHeight + 2;
      };

      const addSectionHeader = (
        title: string,
        x: number,
        y: number
      ): number => {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, x, y);
        pdf.setFont("helvetica", "normal");
        return y + 10;
      };

      const checkNewPage = (requiredSpace: number): void => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin + 10;
        }
      };

      const originalTab = tabValue;
      const availableWidth = pageWidth - 2 * margin;

      setTabValue(0);
      setGenerationProgress("Processing Report Details...");
      await new Promise((resolve) => setTimeout(resolve, 100));

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("General Information", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      yPosition += 8;

      checkNewPage(60);
      yPosition = addTableRow(
        "Description",
        reportDetail.description,
        margin,
        yPosition + 2,
        availableWidth
      );
      yPosition = addTableRow(
        "State",
        reportDetail.state,
        margin,
        yPosition,
        availableWidth
      );
      yPosition = addTableRow(
        "Created By",
        `${reportDetail.createdBy.name} (${reportDetail.createdBy.email})`,
        margin,
        yPosition,
        availableWidth
      );

      if (reportDetail.approvedBy) {
        yPosition = addTableRow(
          "Approved By",
          `${reportDetail.approvedBy.name} (${reportDetail.approvedBy.email})`,
          margin,
          yPosition,
          availableWidth
        );
      }

      if (reportDetail.approvedDate) {
        yPosition = addTableRow(
          "Approved Date",
          formatDate(reportDetail.approvedDate),
          margin,
          yPosition,
          availableWidth
        );
      }

      yPosition = addTableRow(
        "Created At",
        formatDate(reportDetail.createdAt),
        margin,
        yPosition,
        availableWidth
      );
      yPosition = addTableRow(
        "Updated At",
        formatDate(reportDetail.updatedAt),
        margin,
        yPosition,
        availableWidth
      );

      checkNewPage(50);
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Parameters", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      yPosition += 8;

      yPosition = addTableRow(
        "Date Range",
        `${formatDate(reportDetail.parameters.dateRange.start)} - ${formatDate(
          reportDetail.parameters.dateRange.end
        )}`,
        margin,
        yPosition,
        availableWidth
      );
      yPosition = addTableRow(
        "Sectors",
        reportDetail.parameters.sectors.join(", "),
        margin,
        yPosition,
        availableWidth
      );
      yPosition = addTableRow(
        "Locations",
        reportDetail.parameters.locations.join(", "),
        margin,
        yPosition,
        availableWidth
      );

      checkNewPage(50);
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Scheduled Report", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      yPosition += 8;

      yPosition = addTableRow(
        "Is Scheduled",
        reportDetail.scheduledReport.isScheduled ? "Yes" : "No",
        margin,
        yPosition,
        availableWidth
      );
      yPosition = addTableRow(
        "Frequency",
        reportDetail.scheduledReport.frequency,
        margin,
        yPosition,
        availableWidth
      );
      yPosition = addTableRow(
        "Recipients",
        reportDetail.scheduledReport.recipients.join(", "),
        margin,
        yPosition,
        availableWidth
      );

      pdf.addPage();
      yPosition = margin + 10;
      setTabValue(1);
      setGenerationProgress("Processing Findings...");
      await new Promise((resolve) => setTimeout(resolve, 100));

      yPosition = addSectionHeader("Findings", margin, yPosition);

      if (reportDetail.findings.length === 0) {
        pdf.setFontSize(11);
        pdf.text("No findings available for this report.", margin, yPosition);
        yPosition += 10;
      } else {
        for (const finding of reportDetail.findings) {
          checkNewPage(70);

          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(finding.title, margin, yPosition);
          pdf.setFont("helvetica", "normal");
          yPosition += 8;

          yPosition = addTableRow(
            "Description",
            finding.description,
            margin,
            yPosition,
            availableWidth
          );
          yPosition = addTableRow(
            "Importance",
            finding.importance.charAt(0).toUpperCase() +
              finding.importance.slice(1),
            margin,
            yPosition,
            availableWidth
          );

          yPosition += 10;
        }
      }

      pdf.addPage();
      yPosition = margin + 10;
      setTabValue(2);
      setGenerationProgress("Processing Recommendations...");
      await new Promise((resolve) => setTimeout(resolve, 100));

      yPosition = addSectionHeader("Recommendations", margin, yPosition);

      if (reportDetail.recommendations.length === 0) {
        pdf.setFontSize(11);
        pdf.text(
          "No recommendations available for this report.",
          margin,
          yPosition
        );
        yPosition += 10;
      } else {
        for (const recommendation of reportDetail.recommendations) {
          checkNewPage(70);

          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(recommendation.title, margin, yPosition);
          pdf.setFont("helvetica", "normal");
          yPosition += 8;

          yPosition = addTableRow(
            "Description",
            recommendation.description,
            margin,
            yPosition,
            availableWidth
          );
          yPosition = addTableRow(
            "Estimated Savings",
            `$${recommendation.estimatedSavings.toFixed(2)}`,
            margin,
            yPosition,
            availableWidth
          );
          yPosition = addTableRow(
            "Implementation",
            recommendation.implementationDifficulty.charAt(0).toUpperCase() +
              recommendation.implementationDifficulty.slice(1),
            margin,
            yPosition,
            availableWidth
          );

          yPosition += 10;
        }
      }

      pdf.addPage();
      yPosition = margin + 10;
      setTabValue(3);
      setGenerationProgress("Processing Metrics & Visualization...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      yPosition = addSectionHeader(
        "Metrics & Visualization",
        margin,
        yPosition
      );

      const { visualizationData } = reportDetail;

      if (
        !visualizationData ||
        !visualizationData.chartData ||
        visualizationData.chartData.length === 0
      ) {
        pdf.setFontSize(11);
        pdf.text(
          "No visualization data available for this report.",
          margin,
          yPosition
        );
        yPosition += 10;
      } else {
        try {
          setGenerationProgress("Capturing chart...");

          let chartElement = document.querySelector(
            ".chartjs-render-monitor"
          ) as HTMLElement;

          if (!chartElement) {
            chartElement = metricsRef.current?.querySelector(
              'div[style*="height: 400px"]'
            ) as HTMLElement;
          }

          if (chartElement) {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const canvas = await html2canvas(chartElement, {
              scale: 2,
              logging: false,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png", 1.0);

            const imgWidth = pageWidth - 2 * margin;
            const imgHeight = Math.min(
              (canvas.height * imgWidth) / canvas.width,
              100
            );

            pdf.addImage(
              imgData,
              "PNG",
              margin,
              yPosition,
              imgWidth,
              imgHeight
            );
            yPosition += imgHeight + 15;
          } else {
            pdf.setFontSize(11);
            pdf.text("Chart could not be captured.", margin, yPosition);
            yPosition += 10;
          }
        } catch (error) {
          console.error("Error capturing chart:", error);
          pdf.setFontSize(11);
          pdf.text("Error capturing chart visualization.", margin, yPosition);
          yPosition += 10;
        }

        checkNewPage(70);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Summary Metrics", margin, yPosition);
        pdf.setFont("helvetica", "normal");
        yPosition += 8;

        const { summaryMetrics } = visualizationData;

        yPosition = addTableRow(
          "Total Consumption",
          `${summaryMetrics.totalConsumption} kWh`,
          margin,
          yPosition,
          availableWidth
        );
        yPosition = addTableRow(
          "Total Cost",
          `$${summaryMetrics.totalCost.toFixed(2)}`,
          margin,
          yPosition,
          availableWidth
        );
        yPosition = addTableRow(
          "Average Consumption",
          `${summaryMetrics.averageConsumption} kWh`,
          margin,
          yPosition,
          availableWidth
        );
        yPosition = addTableRow(
          "Peak Consumption",
          `${summaryMetrics.peakConsumption} kWh`,
          margin,
          yPosition,
          availableWidth
        );
        yPosition = addTableRow(
          "Savings Opportunity",
          `$${summaryMetrics.savingsOpportunity.toFixed(2)}`,
          margin,
          yPosition,
          availableWidth
        );
      }

      setGenerationProgress("Finalizing document...");
      setTabValue(originalTab);

      pdf.save(
        `${reportDetail.title.replace(/[^a-zA-Z0-9]/g, "_")}_report.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
      setGenerationProgress("");
    }
  };

  const sections: TabSection[] = [
    {
      title: "General Information",
      content: (report, formatDate) => (
        <table className={styles.detailTable}>
          <tbody>
            <tr>
              <th>Description</th>
              <td>{report.description}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <Status status={report.state} />
              </td>
            </tr>
            <tr>
              <th>Created By</th>
              <td>
                {report.createdBy.name} ({report.createdBy.email})
              </td>
            </tr>
            {report.approvedBy && (
              <tr>
                <th>Approved By</th>
                <td>
                  {report.approvedBy.name} ({report.approvedBy.email})
                </td>
              </tr>
            )}
            {report.approvedDate && (
              <tr>
                <th>Approved Date</th>
                <td>{formatDate(report.approvedDate)}</td>
              </tr>
            )}
            <tr>
              <th>Created At</th>
              <td>{formatDate(report.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated At</th>
              <td>{formatDate(report.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      ),
    },
    {
      title: "Parameters",
      content: (report, formatDate) => (
        <table className={styles.detailTable}>
          <tbody>
            <tr>
              <th>Date Range</th>
              <td>
                {formatDate(report.parameters.dateRange.start)} -{" "}
                {formatDate(report.parameters.dateRange.end)}
              </td>
            </tr>
            <tr>
              <th>Sectors</th>
              <td>{report.parameters.sectors.join(", ")}</td>
            </tr>
            <tr>
              <th>Locations</th>
              <td>{report.parameters.locations.join(", ")}</td>
            </tr>
          </tbody>
        </table>
      ),
    },
    {
      title: "Scheduled Report",
      content: (report) => (
        <table className={styles.detailTable}>
          <tbody>
            <tr>
              <th>Is Scheduled</th>
              <td>{report.scheduledReport.isScheduled ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th>Frequency</th>
              <td>{report.scheduledReport.frequency}</td>
            </tr>
            <tr>
              <th>Recipients</th>
              <td>{report.scheduledReport.recipients.join(", ")}</td>
            </tr>
          </tbody>
        </table>
      ),
    },
  ];

  const renderDetailsContent = () => (
    <div ref={detailsRef}>
      <h2>{reportDetail.title}</h2>

      {sections.map((section, index) => (
        <React.Fragment key={`section-${index}`}>
          <Divider style={{ marginTop: 24, marginBottom: 24 }} textAlign="left">
            <h3 className={styles.dividerTitle}>{section.title}</h3>
          </Divider>
          {section.content(reportDetail, formatDate)}
        </React.Fragment>
      ))}
    </div>
  );

  const renderFindingsContent = () => (
    <div ref={findingsRef}>
      <h2>Findings</h2>
      {reportDetail.findings.map((finding, index) => (
        <React.Fragment key={`finding-${index}`}>
          <Divider style={{ marginTop: 24, marginBottom: 24 }} textAlign="left">
            <h3 className={styles.dividerTitle}>{finding.title}</h3>
          </Divider>
          <table className={styles.detailTable}>
            <tbody>
              <tr>
                <th>Description</th>
                <td>{finding.description}</td>
              </tr>
              <tr>
                <th>Importance</th>
                <td style={{ textTransform: "capitalize" }}>
                  {finding.importance}
                </td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      ))}
      {reportDetail.findings.length === 0 && (
        <p>No findings available for this report.</p>
      )}
    </div>
  );

  const renderRecommendationsContent = () => (
    <div ref={recommendationsRef}>
      <h2>Recommendations</h2>
      {reportDetail.recommendations.map((recommendation, index) => (
        <React.Fragment key={`recommendation-${index}`}>
          <Divider style={{ marginTop: 24, marginBottom: 24 }} textAlign="left">
            <h3 className={styles.dividerTitle}>{recommendation.title}</h3>
          </Divider>
          <table className={styles.detailTable}>
            <tbody>
              <tr>
                <th>Description</th>
                <td>{recommendation.description}</td>
              </tr>
              <tr>
                <th>Estimated Savings</th>
                <td>${recommendation.estimatedSavings.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Implementation Difficulty</th>
                <td style={{ textTransform: "capitalize" }}>
                  {recommendation.implementationDifficulty}
                </td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      ))}
      {reportDetail.recommendations.length === 0 && (
        <p>No recommendations available for this report.</p>
      )}
    </div>
  );

  const renderMetricsContent = () => {
    const { visualizationData } = reportDetail;

    if (
      !visualizationData ||
      !visualizationData.chartData ||
      visualizationData.chartData.length === 0
    ) {
      return <p>No visualization data available for this report.</p>;
    }

    const chartColors = ["#3E92CC", "#FF9F1C", "#00B2A9", "#6D63FF"];

    const chartData = {
      labels: visualizationData.chartData[0].labels,
      datasets: visualizationData.chartData.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: chartColors[index % chartColors.length],
        backgroundColor: `${chartColors[index % chartColors.length]}20`,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
        fill: true,
      })),
    };

    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: "end",
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
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "#F3F4F6",
          },
          ticks: {
            color: "#9CA3AF",
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    };

    const { summaryMetrics } = visualizationData;

    return (
      <div ref={metricsRef}>
        <h2>Metrics & Visualization</h2>

        <div style={{ height: "400px", marginBottom: "30px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        <Divider style={{ marginTop: 24, marginBottom: 24 }} textAlign="left">
          <h3 className={styles.dividerTitle}>Summary Metrics</h3>
        </Divider>

        <table className={styles.detailTable}>
          <tbody>
            <tr>
              <th>Total Consumption</th>
              <td>{summaryMetrics.totalConsumption} kWh</td>
            </tr>
            <tr>
              <th>Total Cost</th>
              <td>${summaryMetrics.totalCost.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Average Consumption</th>
              <td>{summaryMetrics.averageConsumption} kWh</td>
            </tr>
            <tr>
              <th>Peak Consumption</th>
              <td>{summaryMetrics.peakConsumption} kWh</td>
            </tr>
            <tr>
              <th>Savings Opportunity</th>
              <td>${summaryMetrics.savingsOpportunity.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="report tabs"
          sx={{ flex: 1 }}
          className={styles.reportTabs}
        >
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Findings" {...a11yProps(1)} />
          <Tab label="Recommendations" {...a11yProps(2)} />
          <Tab label="Metrics" {...a11yProps(3)} />
        </Tabs>
        <Button
          size="small"
          variant="text"
          onClick={handleDownload}
          disabled={isGeneratingPDF}
        >
          <DownloadIcon />
          Download PDF
        </Button>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        {renderDetailsContent()}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        {renderFindingsContent()}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        {renderRecommendationsContent()}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={3}>
        {renderMetricsContent()}
      </CustomTabPanel>

      {/* Loading overlay for PDF generation */}
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
          flexDirection: "column",
          gap: 2,
        }}
        open={isGeneratingPDF}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6">
          {generationProgress || "Generating PDF..."}
        </Typography>
      </Backdrop>
    </div>
  );
};

export default TabContent;
