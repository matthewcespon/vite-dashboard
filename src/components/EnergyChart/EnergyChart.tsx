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
  ChartOptions
} from 'chart.js';
import Button from '../Button/Button';
import styles from './EnergyChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type TimeRange = '7d' | '30d' | '90d' | '1y';

interface EnergyChartProps {
  title?: string;
}

const EnergyChart: React.FC<EnergyChartProps> = ({ title = 'Energy Consumption Trends' }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  const generateDateLabels = (range: TimeRange): string[] => {
    const today = new Date();
    const labels: string[] = [];
    
    let days: number;
    let interval: number;
    
    switch (range) {
      case '7d':
        days = 7;
        interval = 1;
        break;
      case '30d':
        days = 30;
        interval = 5;
        break;
      case '90d':
        days = 90;
        interval = 15;
        break;
      case '1y':
        days = 365;
        interval = 30;
        break;
      default:
        days = 30;
        interval = 5;
    }
    
    for (let i = days; i >= 0; i -= interval) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return labels;
  };
  
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
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 8,
        boxPadding: 4,
        titleFont: {
          size: 13,
          weight: 'normal',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          }
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          }
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      line: {
        borderJoinStyle: 'miter',
        capBezierPoints: false,
      },
    },
  };
  
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