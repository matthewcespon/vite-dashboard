import React from "react";
import { Divider } from "@mui/material";
import { DetailedReport } from "../../utils/detailedReport";
import styles from "./ReportsTable.module.css";
import Status from "../Status/Status";

interface TabContentProps {
  reportDetail: DetailedReport;
}

type TabSection = {
  title: string;
  content: (
    report: DetailedReport,
    formatDate: (date: string) => string
  ) => React.ReactNode;
};

const TabContent: React.FC<TabContentProps> = ({ reportDetail }) => {
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

  return (
    <div>
      <h2>{reportDetail.title}</h2>

      {sections.map((section, index) => (
        <React.Fragment key={`section-${index}`}>
          <Divider style={{ marginTop: 24, marginBottom: 24 }} textAlign="left">
            <h3>{section.title}</h3>
          </Divider>
          {section.content(reportDetail, formatDate)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TabContent;
