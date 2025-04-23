export interface EIAResponse {
  response: {
    total: string;
    dateFormat: string;
    frequency: string;
    data: EnergySavingsData[];
    description: string;
  };
}

export interface EnergySavingsData {
  period: string;
  state: string;
  stateName: string;
  timePeriod: string;
  sector: string;
  sectorName: string;
  'energy-savings': string;
  'energy-savings-units': string;
}

export interface CacheEntry {
  timestamp: number;
  data: any;
}

export interface Cache {
  [key: string]: CacheEntry;
}

export const US_STATES = [
  { code: 'NY', name: 'New York' },
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'FL', name: 'Florida' },
  { code: 'PA', name: 'Pennsylvania' },
];