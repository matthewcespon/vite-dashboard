import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../utils/api';
import styles from './Reports.module.css';
import Footer from '../../components/Footer/Footer';
import Pagination from '../../components/Pagination/Pagination';
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import { CachedReportsData, ReportsResponse, Report } from '../../types/reports';

const Reports: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<{ total: number; page: number; pages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const reportsCache = useRef<CachedReportsData>({});
  const CACHE_EXPIRATION = 5 * 60 * 1000;

  useEffect(() => {
    const fetchReports = async () => {
      const cacheKey = `${currentPage}-${pageSize}`;
      
      const cachedData = reportsCache.current[cacheKey];
      const now = Date.now();
      
      if (cachedData && (now - cachedData.timestamp) < CACHE_EXPIRATION) {
        setReports(cachedData.reports);
        setPagination(cachedData.pagination);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data } = await api.get<ReportsResponse>(`/api/reports/table?page=${currentPage}&limit=${pageSize}`);
        setReports(data.reports);
        setPagination(data.pagination);
        
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

  const getStatusClass = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') return styles.approved;
    if (statusLower === 'pending') return styles.pending;
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
          {!error && pagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              onPageChange={handlePageChange}
              itemName="reports"
            />
          )}
        </div>
        <ReportsTable
          reports={reports}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          PaginationComponent={
            !error && pagination ? (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                onPageChange={handlePageChange}
                itemName="reports"
              />
            ) : null
          }
        />
      </div>
      <Footer />
    </div>
  );
};

export default Reports;