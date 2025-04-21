import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Metrics from '../Metrics/Metrics';
import styles from './EnergySavingsMetrics.module.css';

interface EIAResponse {
  response: {
    total: string;
    dateFormat: string;
    frequency: string;
    data: EnergySavingsData[];
    description: string;
  };
}

interface EnergySavingsData {
  period: string;
  state: string;
  stateName: string;
  timePeriod: string;
  sector: string;
  sectorName: string;
  'energy-savings': string;
  'energy-savings-units': string;
}

const US_STATES = [
  { code: 'NY', name: 'New York' },
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'FL', name: 'Florida' },
  { code: 'PA', name: 'Pennsylvania' },
];

interface EnergySavingsMetricsProps {
  apiKey: string;
}

const EnergySavingsMetrics: React.FC<EnergySavingsMetricsProps> = ({ apiKey }) => {
  const [year, setYear] = useState<string>("2023");
  const [state, setState] = useState<string>("NY");
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const years = ["2023", "2022", "2021", "2020"];

  useEffect(() => {
    const fetchEnergySavingsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const prevYear = (parseInt(year) - 1).toString();
        
        const url = `https://api.eia.gov/v2/electricity/state-electricity-profiles/energy-efficiency/data/?frequency=annual&data[0]=energy-savings&facets[state][]=${state}&facets[sector][]=IND&facets[sector][]=RES&facets[sector][]=TOT&start=${prevYear}&end=${year}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000&api_key=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data: EIAResponse = await response.json();
        
        const processedMetrics = processEnergySavingsData(data, year);
        setMetrics(processedMetrics);
      } catch (err) {
        console.error('Error fetching energy savings data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnergySavingsData();
  }, [year, state, apiKey]);
  
  const processEnergySavingsData = (data: EIAResponse, selectedYear: string) => {
    const dataMap: Record<string, Record<string, EnergySavingsData>> = {};
    
    data.response.data.forEach((item) => {
      if (!dataMap[item.period]) {
        dataMap[item.period] = {};
      }
      dataMap[item.period][item.sector] = item;
    });
    
    const currentYear = selectedYear;
    const previousYear = (parseInt(selectedYear) - 1).toString();
    
    const stateName = data.response.data.find(item => item.state === state)?.stateName || state;
    
    const metrics = [];
    
    if (dataMap[currentYear]?.IND && dataMap[previousYear]?.IND) {
      const currentValue = parseInt(dataMap[currentYear].IND["energy-savings"]);
      const previousValue = parseInt(dataMap[previousYear].IND["energy-savings"]);
      const percentChange = ((currentValue - previousValue) / previousValue) * 100;
      
      metrics.push({
        name: `Industrial Energy Savings in ${stateName} (${currentYear})`,
        value: `${formatNumber(currentValue)} MWh`,
        change: {
          value: `${Math.abs(percentChange).toFixed(1)}% ${percentChange >= 0 ? 'increase' : 'decrease'} from ${previousYear}`,
          isPositive: percentChange >= 0,
          icon: percentChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
        }
      });
    }
    
    if (dataMap[currentYear]?.RES && dataMap[previousYear]?.RES) {
      const currentValue = parseInt(dataMap[currentYear].RES["energy-savings"]);
      const previousValue = parseInt(dataMap[previousYear].RES["energy-savings"]);
      const percentChange = ((currentValue - previousValue) / previousValue) * 100;
      
      metrics.push({
        name: `Residential Energy Savings in ${stateName} (${currentYear})`,
        value: `${formatNumber(currentValue)} MWh`,
        change: {
          value: `${Math.abs(percentChange).toFixed(1)}% ${percentChange >= 0 ? 'increase' : 'decrease'} from ${previousYear}`,
          isPositive: percentChange >= 0,
          icon: percentChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
        }
      });
    }
    
    if (dataMap[currentYear]?.TOT && dataMap[previousYear]?.TOT) {
      const currentValue = parseInt(dataMap[currentYear].TOT["energy-savings"]);
      const previousValue = parseInt(dataMap[previousYear].TOT["energy-savings"]);
      const percentChange = ((currentValue - previousValue) / previousValue) * 100;
      
      metrics.push({
        name: `Total Energy Savings in ${stateName} (${currentYear})`,
        value: `${formatNumber(currentValue)} MWh`,
        change: {
          value: `${Math.abs(percentChange).toFixed(1)}% ${percentChange >= 0 ? 'increase' : 'decrease'} from ${previousYear}`,
          isPositive: percentChange >= 0,
          icon: percentChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
        }
      });
    }
    
    return metrics;
  };
  
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <>
      <div className={styles.controls}>
        <select 
          className={styles.stateSelector}
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          {US_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
        
        <select 
          className={styles.yearSelector}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          {error}
        </div>
      ) : (
        <Metrics metrics={metrics} />
      )}
    </>
  );
};

export default EnergySavingsMetrics;