export interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  date: string;
  location: string;
  creator: string;
}

export interface ReportsResponse {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface CachedReportsData {
  [key: string]: {
    reports: Report[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
    timestamp: number;
  };
}