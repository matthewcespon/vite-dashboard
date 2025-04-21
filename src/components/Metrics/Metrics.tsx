import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './Metrics.module.css';

interface MetricData {
  name: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
    icon?: React.ReactNode;
  };
}

interface MetricsProps {
  metrics: MetricData[];
}

const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  return (
    <div className={styles.metrics}>
      {metrics.map((metric, index) => (
        <div key={index} className={styles.metricCard}>
          <div className={styles.metricName}>{metric.name}</div>
          <div className={styles.metricValue}>{metric.value}</div>
          <div className={`${styles.metricChange} ${metric.change.isPositive ? styles.positive : styles.negative}`}>
            {metric.change.icon || (metric.change.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />)}
            <span>{metric.change.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Metrics;