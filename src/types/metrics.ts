export interface MetricData {
  name: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
    icon?: React.ReactNode;
  };
}