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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

      pdf.setFontSize(16);
      pdf.text(reportDetail.title, margin, margin + 10);
      pdf.setFontSize(12);
      let yPosition = margin + 20;

      const sections = [
        { name: "Details", ref: detailsRef, title: "Report Details" },
        { name: "Findings", ref: findingsRef, title: "Findings" },
        {
          name: "Recommendations",
          ref: recommendationsRef,
          title: "Recommendations",
        },
        { name: "Metrics", ref: metricsRef, title: "Metrics & Visualization" },
      ];

      const originalTab = tabValue;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];

        setTabValue(i);
        setGenerationProgress(
          `Capturing ${section.title} (${i + 1}/${sections.length})...`
        );

        const waitTime = i === 3 ? 1000 : 300;
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        if (section.ref.current) {
          const canvas = await html2canvas(section.ref.current, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
          });

          const imgData = canvas.toDataURL("image/jpeg", 0.9);

          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (i > 0 || yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin + 10;

            pdf.setFontSize(14);
            pdf.text(section.title, margin, yPosition);
            pdf.setFontSize(12);
            yPosition += 10;
          }

          pdf.addImage(imgData, "JPEG", margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
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
              <th>State</th>
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

    // Chart options
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
