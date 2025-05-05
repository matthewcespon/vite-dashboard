import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Button from '../Button/Button';
import styles from './EnergyChart.module.css';
import { generateDateLabels, TimeRange } from '../../utils/date-util';
import { chartOptions } from '../../types/chart-options';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


interface EnergyChartProps {
  title?: string;
}

const EnergyChart: React.FC<EnergyChartProps> = ({ title = 'Energy Consumption Trends' }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  const generateRandomData = (min: number, max: number, count: number): number[] => {
    return Array(count).fill(0).map(() => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  };
  
  const chartData = useMemo(() => {
    const labels = generateDateLabels(timeRange);
    const electricityData = generateRandomData(800, 1200, labels.length);
    const gasData = generateRandomData(300, 600, labels.length);
    if (timeRange === '30d' || timeRange === '90d') {
      for (let i = 0; i < electricityData.length; i++) {
        const dayOfWeek = (i + 2) % 7;
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          electricityData[i] = electricityData[i] * 0.8;
          gasData[i] = gasData[i] * 0.9;
        }
      }
    }
    return {
      labels,
      datasets: [
        {
          label: 'Electricity (kWh)',
          data: electricityData,
          borderColor: '#3E92CC',
          backgroundColor: 'rgba(62, 146, 204, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0,
          fill: true,
        },
        {
          label: 'Natural Gas (m³)',
          data: gasData,
          borderColor: '#FF9F1C',
          backgroundColor: 'rgba(255, 159, 28, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0,
          fill: true,
        },
      ],
    };
  }, [timeRange]);
  
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.filterContainer}>
            {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' },
            ].map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'primary' : 'text'}
              onClick={() => handleTimeRangeChange(range.value as TimeRange)}
            >
              {range.label}
            </Button>
            ))}
        </div>
      </div>
      
      <div className={styles.chartWrapper}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#3E92CC' }}></div>
          <span>Electricity (kWh)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#FF9F1C' }}></div>
          <span>Natural Gas (m³)</span>
        </div>
      </div>
    </div>
  );
};

export default EnergyChart;