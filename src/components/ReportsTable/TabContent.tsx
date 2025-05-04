import React, { useState } from "react";
import { Divider, Box, Tabs, Tab } from "@mui/material";
import { DetailedReport } from "../../utils/detailedReport";
import styles from "./ReportsTable.module.css";
import Status from "../Status/Status";

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    <>
      <h2>{reportDetail.title}</h2>

      {sections.map((section, index) => (
        <React.Fragment key={`section-${index}`}>
          <Divider style={{ marginTop: 24, marginBottom: 24 }} textAlign="left">
            <h3>{section.title}</h3>
          </Divider>
          {section.content(reportDetail, formatDate)}
        </React.Fragment>
      ))}
    </>
  );

  const renderFindingsContent = () => (
    <>
      <h2>Findings</h2>
      {reportDetail.findings.map((finding, index) => (
        <React.Fragment key={`finding-${index}`}>
          <Divider style={{ marginTop: 24, marginBottom: 24 }} textAlign="left">
            <h3>{finding.title}</h3>
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
    </>
  );

  const renderRecommendationsContent = () => (
    <>
      <h2>Recommendations</h2>
      {reportDetail.recommendations.map((recommendation, index) => (
        <React.Fragment key={`recommendation-${index}`}>
          <Divider style={{ marginTop: 24, marginBottom: 24 }} textAlign="left">
            <h3>{recommendation.title}</h3>
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
    </>
  );

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="report tabs"
        >
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Findings" {...a11yProps(1)} />
          <Tab label="Recommendations" {...a11yProps(2)} />
          <Tab label="Additional Content" {...a11yProps(3)} />
        </Tabs>
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
        {/* This tab is intentionally left empty for future content */}
        <div>Additional content will be displayed here</div>
      </CustomTabPanel>
    </div>
  );
};

export default TabContent;
