import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import styles from './Reports.module.css';

interface DateRange {
  start: string;
  end: string;
}

interface ScheduledReport {
  isScheduled: boolean;
  frequency: string;
  recipients: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  state: string;
  parameters?: {
    dateRange?: DateRange;
    sectors?: string[];
    locations?: string[];
  };
  scheduledReport?: ScheduledReport;
  createdBy?: User;
  approvedBy?: User;
  approvedDate?: string;
}

interface ReportsResponse {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface CachedReportsData {
  [key: string]: {
    reports: Report[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
    timestamp: number;
  };
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<{ total: number; page: number; pages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cache for storing previously fetched pages
  const reportsCache = useRef<CachedReportsData>({});
  // Cache expiration time in milliseconds (5 minutes)
  const CACHE_EXPIRATION = 5 * 60 * 1000;

  // Fetch reports data
  useEffect(() => {
    const fetchReports = async () => {
      // Create a cache key based on the page and limit
      const cacheKey = `${currentPage}-${pageSize}`;
      
      // Check if we have cached data that's not expired
      const cachedData = reportsCache.current[cacheKey];
      const now = Date.now();
      
      if (cachedData && (now - cachedData.timestamp) < CACHE_EXPIRATION) {
        // Use cached data
        setReports(cachedData.reports);
        setPagination(cachedData.pagination);
        return;
      }
      
      // No valid cache, need to fetch
      setIsLoading(true);
      setError(null);
      
      try {
        const { data } = await api.get<ReportsResponse>(`/api/reports?page=${currentPage}&limit=${pageSize}`);
        setReports(data.reports);
        setPagination(data.pagination);
        
        // Cache the fetched data
        reportsCache.current[cacheKey] = {
          reports: data.reports,
          pagination: data.pagination,
          timestamp: now
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reports');
        console.error('Error fetching reports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function to get status badge class
  const getStatusClass = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') return styles.approved;
    if (statusLower === 'pending approval') return styles.pendingApproval;
    if (statusLower === 'rejected') return styles.rejected;
    if (statusLower === 'draft') return styles.draft;
    return '';
  };

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reports</h1>
          <p className={styles.subtitle}>View and manage your energy reports</p>
        </div>
      </div>
      
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Your Reports</h2>
          
          {/* Pagination controls at the top */}
          {!isLoading && !error && pagination && (
            <div className={styles.paginationControls}>
              <div className={styles.paginationInfo}>
                Showing page {pagination.page} of {pagination.pages} ({pagination.total} reports total)
              </div>
              <div className={styles.paginationButtons}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                
                {/* Generate page number buttons */}
                {pagination.pages && Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === pagination.pages || 
                    (page >= currentPage - 1 && page <= currentPage + 1))
                  .map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`${styles.paginationButton} ${currentPage === page ? styles.activeButton : ''}`}
                    >
                      {page}
                    </button>
                  ))
                }
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= (pagination.pages || 1)}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

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
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td>{report.title}</td>
                    <td>{report.description.substring(0, 50)}...</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(report.state)}`}>
                        {report.state}
                      </span>
                    </td>
                    <td>{formatDate(report.createdAt)}</td>
                    <td>{report.parameters?.locations?.join(', ') || 'N/A'}</td>
                    <td>{report.createdBy?.name || 'Unknown'}</td>
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
      </div>
    </div>
  );
};

export default Reports;