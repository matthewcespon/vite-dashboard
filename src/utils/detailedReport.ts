export interface VisualizationData {
  summaryMetrics: {
    totalConsumption: number;
    totalCost: number;
    averageConsumption: number;
    peakConsumption: number;
    savingsOpportunity: number;
  };
  chartData: Array<{
    label: string;
    data: number[];
    labels: string[];
    _id: string;
  }>;
}

export interface DetailedReport {
  _id: string;
  title: string;
  description: string;
  state: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  approvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  approvedDate?: string;
  createdAt: string;
  updatedAt: string;
  parameters: {
    dateRange: { start: string; end: string };
    sectors: string[];
    locations: string[];
  };
  scheduledReport: {
    isScheduled: boolean;
    frequency: string;
    recipients: string[];
  };
  findings: Array<{
    title: string;
    description: string;
    importance: string;
    _id: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    estimatedSavings: number;
    implementationDifficulty: string;
    _id: string;
  }>;
  visualizationData: VisualizationData;
}