import React, { useState, useEffect } from 'react';
import { Eye, Loader as LoaderIcon, FileText } from 'lucide-react';
import { api } from '../../utils/api';
import { Report } from '../../types/reports';
import Button from '../Button/Button';
import Status from '../Status/Status';
import Modal from '../Modal/Modal';
import TabContent from '../ReportsTable/TabContent';
import { DetailedReport } from '../../utils/detailedReport';
import styles from './RecentReports.module.css';
import { Box, Tabs, Tab } from '@mui/material';

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
      id={`recent-reports-tabpanel-${index}`}
      aria-labelledby={`recent-reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `recent-reports-tab-${index}`,
    'aria-controls': `recent-reports-tabpanel-${index}`,
  };
}

const RecentReports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingReportIds, setLoadingReportIds] = useState<string[]>([]);
  const [modalError, setModalError] = useState<string | null>(null);
  const [reportDetail, setReportDetail] = useState<DetailedReport | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchRecentReports = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data } = await api.get<{ reports: Report[] }>('/api/reports/table?page=1&limit=10');
        setReports(data.reports);
        console.log('Fetched reports:', data.reports);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent reports');
        console.error('Error fetching recent reports:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentReports();
  }, []);

  useEffect(() => {
    if (reports.length === 0) {
      setFilteredReports([]);
      return;
    }

    if (tabValue === 0) {
      setFilteredReports(reports.filter(report => report.status === 'Approved'));
    } else if (tabValue === 1) {
      setFilteredReports(reports.filter(report => report.status === 'Draft'));
    } else if (tabValue === 2) {
      setFilteredReports(reports.filter(report => report.status === 'Pending'));
    }
  }, [reports, tabValue]);

  const handleView = async (id: string) => {
    setLoadingReportIds(prev => [...prev, id]);
    setModalError(null);

    try {
      const { data } = await api.get<DetailedReport>(`/api/reports/${id}`);
      setReportDetail(data);
      setModalOpen(true);
    } catch (err) {
      setModalError('Failed to fetch report details');
    } finally {
      setLoadingReportIds(prev => prev.filter(reportId => reportId !== id));
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className={styles.loading}>Loading reports...</div>;
    }

    if (error) {
      return <div className={styles.errorMessage}>{error}</div>;
    }

    if (filteredReports.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <FileText size={48} />
          </div>
          <h3 className={styles.emptyStateText}>No reports found</h3>
          <p className={styles.emptyStateSubtext}>
            There are no {tabValue === 0 ? 'ready' : tabValue === 1 ? 'draft' : 'pending'} reports available. Try selecting a different category or create a new report.
          </p>
          <Button>Generate New Report</Button>
        </div>
      );
    }

    return (
      <div className={styles.reportGrid}>
        {filteredReports.map(report => (
          <div key={report.id} className={styles.reportCard}>
            <div className={styles.reportHeader}>
              <div>
                <h3 className={styles.reportTitle}>{report.title}</h3>
                <span className={styles.reportDate}>{formatDate(report.date)}</span>
                <div className={styles.reportMeta}>
                  <Status status={report.status} />
                  <span className={styles.reportLocation}>{report.location}</span>
                </div>
              </div>
              <FileText size={20} color="#6B7280" />
            </div>
            
            <p className={styles.reportDescription}>
              {report.description.substring(0, 100)}
              {report.description.length > 100 ? '...' : ''}
            </p>
            
            <div className={styles.reportActions}>
              <Button 
                variant="text" 
                size="small"
                icon={loadingReportIds.includes(report.id) ? (
                  <LoaderIcon size={16} className={styles.spinningLoader} />
                ) : (
                  <Eye size={16} />
                )}
                onClick={() => handleView(report.id)}
                disabled={loadingReportIds.includes(report.id)}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Recent Reports</h2>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="recent reports tabs"
          className={styles.muiTabs}
        >
          <Tab label="Ready" {...a11yProps(0)} />
          <Tab label="Draft" {...a11yProps(1)} />
          <Tab label="Pending" {...a11yProps(2)} />
        </Tabs>
      </Box>
      
      <CustomTabPanel value={tabValue} index={0}>
        {renderContent()}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        {renderContent()}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        {renderContent()}
      </CustomTabPanel>

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

export default RecentReports;