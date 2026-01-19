
import { MonthlyData, ForecastResult, ErrorMetrics } from './types';

/**
 * Rumus Safety Stock (SS):
 * SS = (Max Lead Time * Max Permintaan Harian) - (Avg Lead Time * Avg Permintaan Harian)
 * Max LT = 4 hari, Avg LT = 2 hari (Standar Toko Saputra Jaya)
 */
export const calculateSafetyStock = (historicalDemands: number[]): number => {
  if (historicalDemands.length === 0) return 0;
  
  const maxLT = 4;
  const avgLT = 2;
  const daysInMonth = 30;
  
  const maxMonthlyDemand = Math.max(...historicalDemands);
  const avgMonthlyDemand = historicalDemands.reduce((a, b) => a + b, 0) / historicalDemands.length;
  
  const maxDailyDemand = maxMonthlyDemand / daysInMonth;
  const avgDailyDemand = avgMonthlyDemand / daysInMonth;
  
  const safetyStock = (maxLT * maxDailyDemand) - (avgLT * avgDailyDemand);
  return Math.ceil(safetyStock);
};

/**
 * Kalkulasi Single Moving Average (SMA)
 * Menghasilkan peramalan untuk periode berikutnya berdasarkan N bulan terakhir.
 */
export const calculateSMA = (data: MonthlyData[], n: number): { 
  results: ForecastResult[], 
  metrics: ErrorMetrics, 
  nextPeriodForecast: number 
} => {
  const results: ForecastResult[] = [];
  let sumAbsError = 0;
  let sumSquaredError = 0;
  let sumApe = 0;
  let errorCount = 0;

  // 1. Hitung Peramalan Historis (untuk evaluasi MAPE)
  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    let forecast: number | null = null;
    let error: number | null = null;
    let ape: number | null = null;

    if (i >= n) {
      let sum = 0;
      for (let j = 1; j <= n; j++) {
        sum += data[i - j].demand;
      }
      forecast = sum / n;
      
      error = current.demand - forecast;
      const absError = Math.abs(error);
      sumAbsError += absError;
      sumSquaredError += Math.pow(error, 2);
      
      if (current.demand > 0) {
        ape = (absError / current.demand) * 100;
        sumApe += ape;
      }
      errorCount++;
    }

    results.push({
      periodLabel: current.periodLabel,
      actual: current.demand,
      forecast: forecast,
      error: error,
      ape: ape
    });
  }

  // 2. Hitung Ramalan untuk Bulan Depan (Target Utama)
  let nextForecast = 0;
  if (data.length >= n) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += data[data.length - 1 - j].demand;
    }
    nextForecast = sum / n;
  }

  const metrics: ErrorMetrics = {
    mad: errorCount > 0 ? sumAbsError / errorCount : 0,
    mse: errorCount > 0 ? sumSquaredError / errorCount : 0,
    mape: errorCount > 0 ? sumApe / errorCount : 0
  };

  return { results, metrics, nextPeriodForecast: nextForecast };
};

export const formatNumber = (num: number | null | undefined, decimals: number = 2) => {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};
