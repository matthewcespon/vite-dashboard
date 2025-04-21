import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, TrendingDown, BarChart, FileText, Download, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Banner from '../../components/Banner/Banner';
import Button from '../../components/Button/Button';
import Metrics from '../../components/Metrics/Metrics';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    // Check if the user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Show success message if user just logged in
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      setShowSuccessMessage(true);
      
      // Remove the query parameter from the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [user, navigate]);
  
  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getDummyReports = () => {
    const reports = [
      {
        id: 1,
        title: 'Monthly Energy Consumption',
        date: '2025-03-15',
        type: 'electricity',
        status: 'completed',
      },
      {
        id: 2,
        title: 'Quarterly Efficiency Analysis',
        date: '2025-02-28',
        type: 'gas',
        status: 'completed',
      },
      {
        id: 3,
        title: 'Annual Sustainability Report',
        date: '2025-01-10',
        type: 'water',
        status: 'completed',
      },
      {
        id: 4,
        title: 'Carbon Footprint Assessment',
        date: '2025-03-01',
        type: 'electricity',
        status: 'completed',
      },
    ];

    if (activeTab !== 'all') {
      return reports.filter(report => report.type === activeTab);
    }

    return reports;
  };

  const reports = getDummyReports();

  const getReportTypeClass = (type: string): string => {
    switch (type) {
      case 'electricity':
        return styles.reportTypeElectricity;
      case 'gas':
        return styles.reportTypeGas;
      case 'water':
        return styles.reportTypeWater;
      default:
        return '';
    }
  };

  const metricsData = [
    {
      name: 'Total Energy Consumption',
      value: '45,892 kWh',
      change: {
        value: '+2.4% from last month',
        isPositive: false,
        icon: <TrendingUp size={16} />
      }
    },
    {
      name: 'Average Daily Usage',
      value: '1,532 kWh',
      change: {
        value: '-5.1% from last month',
        isPositive: true,
        icon: <TrendingDown size={16} />
      }
    },
    {
      name: 'Efficiency Score',
      value: '82/100',
      change: {
        value: '+3.8 points',
        isPositive: true,
        icon: <TrendingUp size={16} />
      }
    }
  ];

  return (
    <div className={styles.container}>
      {showSuccessMessage && (
        <Banner 
          type="success"
          message={`Welcome back, ${user.name}! You've successfully logged in.`}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.greeting}>Hello, {user.name}</h1>
          <p className={styles.subtitle}>Welcome to your Energy Insights Dashboard</p>
          
          <Metrics metrics={metricsData} />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h2 className={styles.sectionTitle}>Energy Consumption Trends</h2>
            <div>
              <Button variant="outline" size="small">
                Last 30 Days
              </Button>
            </div>
          </div>
          <div className={styles.loadingPlaceholder}></div>
        </div>
        
        <div>
          <h2 className={styles.sectionTitle}>Recent Reports</h2>
          <div className={styles.tabs}>
            <div 
              className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Reports
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'electricity' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('electricity')}
            >
              Electricity
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'gas' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('gas')}
            >
              Gas
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'water' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('water')}
            >
              Water
            </div>
          </div>
          
          {reports.length > 0 ? (
            <div className={styles.reportGrid}>
              {reports.map(report => (
                <div key={report.id} className={styles.reportCard}>
                  <div className={styles.reportHeader}>
                    <div>
                      <h3 className={styles.reportTitle}>{report.title}</h3>
                      <span className={styles.reportDate}>{formatDate(report.date)}</span>
                      <div className={`${styles.reportType} ${getReportTypeClass(report.type)}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </div>
                    </div>
                    <FileText size={20} color="#6B7280" />
                  </div>
                  
                  <div className={styles.reportActions}>
                    <Button 
                      variant="text" 
                      size="small"
                      icon={<Eye size={16} />}
                    >
                      View
                    </Button>
                    <Button 
                      variant="text" 
                      size="small"
                      icon={<Download size={16} />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <FileText size={48} />
              </div>
              <h3 className={styles.emptyStateText}>No reports found</h3>
              <p className={styles.emptyStateSubtext}>
                There are no reports available for the selected filter. Try selecting a different category or create a new report.
              </p>
              <Button>Generate New Report</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;