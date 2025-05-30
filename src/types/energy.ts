export interface EnergyRecord {
  _id: string;
  date: string;
  sector: string;
  location: string;
  energyConsumed: number;
  cost: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EnergyResponse {
  data: EnergyRecord[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}
