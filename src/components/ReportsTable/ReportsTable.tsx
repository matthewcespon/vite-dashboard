import React, { useState } from "react";
import styles from "./ReportsTable.module.css";
import { Eye, Loader as LoaderIcon } from "lucide-react";
import { Report } from "../../types/reports";
import Modal from "../Modal/Modal";
import { api } from "../../utils/api";
import { DetailedReport } from "../../utils/detailedReport";
import TabContent from "./TabContent";
import Status from "../Status/Status";

interface ReportsTableProps {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  pagination: { total: number; page: number; pages: number } | null;
  onPageChange: (page: number) => void;
  currentPage: number;
  PaginationComponent?: React.ReactNode;
}

export interface VisualizationData {
  summaryMetrics: {
    totalConsumption: number;
    totalCost: number;
    averageConsumption: number;
    peakConsumption: number;
    savingsOpportunity: number;
  };
  chartData: Array<{
    label: string;
    data: number[];
    labels: string[];
    _id: string;
  }>;
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  reports,
  isLoading,
  error,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingReportIds, setLoadingReportIds] = useState<string[]>([]);
  const [prefetchingReportIds, setPrefetchingReportIds] = useState<string[]>([]);
  const [modalError, setModalError] = useState<string | null>(null);
  const [reportDetail, setReportDetail] = useState<DetailedReport | null>(null);
  const [prefetchedReports, setPrefetchedReports] = useState<Record<string, DetailedReport>>({});

  const prefetchReport = async (id: string) => {
    if (prefetchedReports[id] || prefetchingReportIds.includes(id) || loadingReportIds.includes(id)) {
      return;
    }

    setPrefetchingReportIds((prev) => [...prev, id]);
    
    try {
      const { data } = await api.get<DetailedReport>(`/api/reports/${id}`);
      setPrefetchedReports((prev) => ({
        ...prev,
        [id]: data
      }));
    } catch (err) {
    } finally {
      setPrefetchingReportIds((prev) => prev.filter((reportId) => reportId !== id));
    }
  };

  const handleView = async (id: string) => {
    if (prefetchedReports[id]) {
      setReportDetail(prefetchedReports[id]);
      setModalOpen(true);
      return;
    }

    setLoadingReportIds((prev) => [...prev, id]);
    setModalError(null);

    try {
      const { data } = await api.get<DetailedReport>(`/api/reports/${id}`);
      setReportDetail(data);
      setModalOpen(true);
    } catch (err) {
      setModalError("Failed to fetch report details");
    } finally {
      setLoadingReportIds((prev) => prev.filter((reportId) => reportId !== id));
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.reportsTableWrapper}>
      {isLoading ? (
        <div className={styles.loading}>Loading reports...</div>
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : reports.length > 0 ? (
        <div className={styles.reportsTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Location</th>
                <th>Creator</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.title}</td>
                  <td>{report.description.substring(0, 50)}...</td>
                  <td>
                    <Status status={report.status} />
                  </td>
                  <td>{formatDate(report.date)}</td>
                  <td>{report.location}</td>
                  <td>{report.creator}</td>
                  <td>
                    <button
                      className={styles.eyeButton}
                      onClick={() => handleView(report.id)}
                      onMouseEnter={() => prefetchReport(report.id)}
                      title="View Report"
                      disabled={loadingReportIds.includes(report.id)}
                    >
                      {loadingReportIds.includes(report.id) ? (
                        <LoaderIcon
                          size={18}
                          className={styles.spinningLoader}
                        />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          No reports found. Create your first report to get started.
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalError ? (
          <div className={styles.errorMessage}>{modalError}</div>
        ) : reportDetail ? (
          <TabContent reportDetail={reportDetail} />
        ) : null}
      </Modal>
    </div>
  );
};

export default ReportsTable;
