
export interface MonthlyData {
  id: string;
  month: string;
  year: number;
  day?: number;
  demand: number;
  periodLabel: string;
}

export interface StockStatus {
  currentStock: number;
  safetyStock: number;
}

export interface ProductData {
  id: string;
  name: string;
  unit: string;
  data: MonthlyData[];
  stock: StockStatus;
  bestN: number;
}

export interface ForecastResult {
  periodLabel: string;
  actual: number | null;
  forecast: number | null;
  error: number | null;
  ape: number | null;
}

export interface ErrorMetrics {
  mad: number;
  mse: number;
  mape: number;
}
