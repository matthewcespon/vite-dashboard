import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Select, Option, FormControl } from '@mui/joy';
import Metrics from '../Metrics/Metrics';
import styles from './EnergySavingsMetrics.module.css';
import { Cache, US_STATES, EIAResponse, EnergySavingsData } from '../../types/energySavings';


const EnergySavingsMetrics: React.FC = () => {
  const [year, setYear] = useState<string>("2023");
  const [state, setState] = useState<string>("NY");
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const cache = useRef<Cache>({});
  
  const CACHE_EXPIRATION = 60 * 60 * 1000;

  const years = ["2023", "2022", "2021", "2020"];
  const apiKey = import.meta.env.VITE_EIA_API_KEY

  useEffect(() => {
    const fetchEnergySavingsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const prevYear = (parseInt(year) - 1).toString();
        
        const cacheKey = `${state}-${prevYear}-${year}`;
        
        const cacheEntry = cache.current[cacheKey];
        const now = Date.now();
        
        if (cacheEntry && now - cacheEntry.timestamp < CACHE_EXPIRATION) {
          console.log("Using cached data for:", cacheKey);
          setMetrics(cacheEntry.data);
          setLoading(false);
          return;
        }
        
        const url = `https://api.eia.gov/v2/electricity/state-electricity-profiles/energy-efficiency/data/?frequency=annual&data[0]=energy-savings&facets[state][]=${state}&facets[sector][]=IND&facets[sector][]=RES&facets[sector][]=TOT&start=${prevYear}&end=${year}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000&api_key=${apiKey}`;
        
        console.log("Fetching fresh data for:", cacheKey);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data: EIAResponse = await response.json();
        
        const processedMetrics = processEnergySavingsData(data, year);
        
        cache.current[cacheKey] = {
          timestamp: now,
          data: processedMetrics
        };
        
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
        <FormControl size="sm">
          <div
            className={styles.label}
          >State</div>
          <Select
            value={state}
            onChange={(_, newValue) => setState(newValue as string)}
            size="sm"
            sx={{ minWidth: 180 }}
            variant="plain"
          >
            {US_STATES.map((stateOption) => (
              <Option key={stateOption.code} value={stateOption.code}>
                {stateOption.name}
              </Option>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="sm">
          <div
            className={styles.label}
          >Year</div>
          <Select
            color="neutral"
            value={year}
            onChange={(_, newValue) => setYear(newValue as string)}
            size="sm"
            sx={{ minWidth: 120 }}
            variant="plain"
          >
            {years.map((yearOption) => (
              <Option key={yearOption} value={yearOption}>
                {yearOption}
              </Option>
            ))}
          </Select>
        </FormControl>
      </div>
      
      {error ? (
        <div className={styles.errorMessage}>
          {error}
        </div>
      ) : (
        <Metrics metrics={metrics} isLoading={loading} />
      )}
    </>
  );
};

export default EnergySavingsMetrics;