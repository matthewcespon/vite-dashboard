import React, { useState } from 'react';
import styles from './ReportsTable.module.css';
import { Eye } from 'lucide-react';
import { Report } from '../../types/reports';
import Modal from '../Modal/Modal';
import { api } from '../../utils/api';
import { DetailedReport } from '../../utils/detailedReport';

interface ReportsTableProps {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  pagination: { total: number; page: number; pages: number } | null;
  onPageChange: (page: number) => void;
  currentPage: number;
  PaginationComponent?: React.ReactNode;
}

// --- New interfaces for detailed report structure ---
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
  pagination,
  onPageChange,
  currentPage,
  PaginationComponent,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [reportDetail, setReportDetail] = useState<DetailedReport | null>(null);

  const handleView = async (id: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setReportDetail(null);
    try {
      const { data } = await api.get<DetailedReport>(`/api/reports/${id}`);
      setReportDetail(data);
    } catch (err) {
      setModalError('Failed to fetch report details');
    } finally {
      setModalLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.title}</td>
                  <td>{report.description.substring(0, 50)}...</td>
                  <td>{report.status}</td>
                  <td>{formatDate(report.date)}</td>
                  <td>{report.location}</td>
                  <td>{report.creator}</td>
                  <td>
                    <button className={styles.eyeButton} onClick={() => handleView(report.id)} title="View Report">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {PaginationComponent}
        </div>
      ) : (
        <div className={styles.emptyState}>
          No reports found. Create your first report to get started.
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalLoading ? (
          <div className={styles.skeleton}>
            <div className={styles.skeletonRow}>
              <div className={`${styles.skeletonBox} ${styles.long}`}></div>
            </div>
            <div className={styles.skeletonRow}>
              <div className={`${styles.skeletonBox} ${styles.medium}`}></div>
              <div className={`${styles.skeletonBox} ${styles.short}`}></div>
            </div>
            <div className={styles.skeletonRow}>
              <div className={`${styles.skeletonBox} ${styles.medium}`}></div>
              <div className={`${styles.skeletonBox} ${styles.short}`}></div>
            </div>
            <div className={styles.skeletonRow}>
              <div className={`${styles.skeletonBox} ${styles.long}`}></div>
            </div>
            <div className={styles.skeletonRow}>
              <div className={`${styles.skeletonBox} ${styles.medium}`}></div>
              <div className={`${styles.skeletonBox} ${styles.short}`}></div>
            </div>
            <div className={styles.skeletonRow}>
              <div className={`${styles.skeletonBox} ${styles.long}`}></div>
            </div>
          </div>
        ) : modalError ? (
          <div className={styles.errorMessage}>{modalError}</div>
        ) : reportDetail ? (
          <div>
            <h2>{reportDetail.title}</h2>
            <p><strong>Description:</strong> {reportDetail.description}</p>
            <p><strong>State:</strong> {reportDetail.state}</p>
            <p><strong>Created By:</strong> {reportDetail.createdBy.name} ({reportDetail.createdBy.email})</p>
            {reportDetail.approvedBy && (
              <p><strong>Approved By:</strong> {reportDetail.approvedBy.name} ({reportDetail.approvedBy.email})</p>
            )}
            {reportDetail.approvedDate && (
              <p><strong>Approved Date:</strong> {formatDate(reportDetail.approvedDate)}</p>
            )}
            <p><strong>Created At:</strong> {formatDate(reportDetail.createdAt)}</p>
            <p><strong>Updated At:</strong> {formatDate(reportDetail.updatedAt)}</p>
            <h3 style={{marginTop: 24}}>Parameters</h3>
            <table className={styles.detailTable}>
              <tbody>
                <tr>
                  <th>Date Range</th>
                  <td>{formatDate(reportDetail.parameters.dateRange.start)} - {formatDate(reportDetail.parameters.dateRange.end)}</td>
                </tr>
                <tr>
                  <th>Sectors</th>
                  <td>{reportDetail.parameters.sectors.join(', ')}</td>
                </tr>
                <tr>
                  <th>Locations</th>
                  <td>{reportDetail.parameters.locations.join(', ')}</td>
                </tr>
              </tbody>
            </table>
            <h3 style={{marginTop: 24}}>Scheduled Report</h3>
            <table className={styles.detailTable}>
              <tbody>
                <tr>
                  <th>Is Scheduled</th>
                  <td>{reportDetail.scheduledReport.isScheduled ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <th>Frequency</th>
                  <td>{reportDetail.scheduledReport.frequency}</td>
                </tr>
                <tr>
                  <th>Recipients</th>
                  <td>{reportDetail.scheduledReport.recipients.join(', ')}</td>
                </tr>
              </tbody>
            </table>
            <h3 style={{marginTop: 24}}>Findings</h3>
            <table className={styles.detailTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Importance</th>
                </tr>
              </thead>
              <tbody>
                {reportDetail.findings.map(f => (
                  <tr key={f._id}>
                    <td>{f.title}</td>
                    <td>{f.description}</td>
                    <td>{f.importance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 style={{marginTop: 24}}>Recommendations</h3>
            <table className={styles.detailTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Estimated Savings</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {reportDetail.recommendations.map(r => (
                  <tr key={r._id}>
                    <td>{r.title}</td>
                    <td>{r.description}</td>
                    <td>${r.estimatedSavings}</td>
                    <td>{r.implementationDifficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Visualization data will be implemented later */}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ReportsTable;
