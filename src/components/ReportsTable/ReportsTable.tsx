import React, { useState } from "react";
import styles from "./ReportsTable.module.css";
import { Eye, Loader as LoaderIcon } from "lucide-react";
import { Report } from "../../types/reports";
import Modal from "../Modal/Modal";
import { api } from "../../utils/api";
import { DetailedReport } from "../../utils/detailedReport";
import TabContent from "./TabContent";
import Status from "../Status/Status";
import { formatDate } from "../../utils/date-util";

interface ReportsTableProps {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  pagination: { total: number; page: number; pages: number } | null;
  onPageChange: (page: number) => void;
  currentPage: number;
  PaginationComponent?: React.ReactNode;
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
      // Silent fail for prefetch
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <LoaderIcon className={styles.loadingIcon} />
          <span>Loading reports...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error loading reports: {error}</p>
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          No reports found. Create your first report to get started.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Title</div>
        <div className={styles.headerCell}>Description</div>
        <div className={styles.headerCell}>Status</div>
        <div className={styles.headerCell}>Date</div>
        <div className={styles.headerCell}>Location</div>
        <div className={styles.headerCell}>Creator</div>
        <div className={styles.headerCell}>View</div>
      </div>
      
      <div className={styles.tableBody}>
        {reports.map((report) => (
          <div key={report.id} className={styles.row}>
            <div className={styles.cell} title={report.title}>{report.title}</div>
            <div className={styles.cell} title={report.description}>
              {report.description.substring(0, 50)}...
            </div>
            <div className={styles.cell}>
              <Status status={report.status} />
            </div>
            <div className={styles.cell}>{formatDate(report.date)}</div>
            <div className={styles.cell}>{report.location}</div>
            <div className={styles.cell}>{report.creator}</div>
            <div className={styles.cell}>
              <button
                className={styles.eyeButton}
                onClick={() => handleView(report.id)}
                onMouseEnter={() => prefetchReport(report.id)}
                title="View Report"
                disabled={loadingReportIds.includes(report.id)}
              >
                {loadingReportIds.includes(report.id) ? (
                  <LoaderIcon size={18} className={styles.spinningLoader} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

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
