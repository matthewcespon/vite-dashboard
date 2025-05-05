import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@mui/joy';
import styles from './Metrics.module.css';
import { MetricData } from '../../types/metrics';

interface MetricsProps {
  metrics: MetricData[];
  isLoading?: boolean;
}

const Metrics: React.FC<MetricsProps> = ({ metrics, isLoading = false }) => {
  const renderSkeletonCards = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className={styles.metricCard}>
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="40%" height={36} sx={{ my: 1 }} />
        <Skeleton variant="text" width="60%" height={20} />
      </div>
    ));
  };

  const renderEmptyState = () => {
    return (
      <div className={styles.emptyState}>
        No metrics data available
      </div>
    );
  };

  return (
    <div className={styles.metrics}>
      {isLoading ? (
        renderSkeletonCards()
      ) : metrics.length > 0 ? (
        metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricName}>{metric.name}</div>
            <div className={styles.metricValue}>{metric.value}</div>
            <div className={`${styles.metricChange} ${metric.change.isPositive ? styles.positive : styles.negative}`}>
              {metric.change.icon || (metric.change.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />)}
              <span>{metric.change.value}</span>
            </div>
          </div>
        ))
      ) : (
        renderEmptyState()
      )}
    </div>
  );
};

export default Metrics;