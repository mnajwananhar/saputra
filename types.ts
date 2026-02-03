
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

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
  price: number;
  cost: number;
  data: MonthlyData[];
  stock: StockStatus;
  bestN: number;
  supplierId?: string;
  supplier?: Supplier;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  product: ProductData;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  date: string;
  totalAmount: number;
  items: TransactionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StockIn {
  id: string;
  date: string;
  supplierId?: string;
  supplier?: Supplier;
  productId: string;
  product: ProductData;
  quantity: number;
  cost: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForecastResult {
  periodLabel: string;
  actual: number | null;
  forecast: number | null;
  error: number | null;
  ape: number | null;
}

export interface ErrorMetrics {
  mape: number;
}
