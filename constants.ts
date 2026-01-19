
import { ProductData, MonthlyData } from './types';

/**
 * Menghasilkan daftar 24 bulan ke belakang secara dinamis dari bulan saat ini.
 * Jika hari ini Feb-26, maka akan menghasilkan Feb-24 sampai Jan-26.
 */
export const getRollingMonths = () => {
  const result: { id: number; month: string; year: number; periodLabel: string }[] = [];
  const now = new Date();
  
  // Kita ambil 24 bulan ke belakang, berakhir di bulan lalu (karena bulan ini belum selesai)
  // Atau berakhir di bulan ini jika ingin menyertakan estimasi berjalan. 
  // Untuk forecasting, biasanya kita pakai 24 bulan penuh terakhir.
  for (let i = 24; i > 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthLabel = monthNames[d.getMonth()];
    const yearLabel = d.getFullYear();
    
    result.push({
      id: 25 - i,
      month: monthLabel,
      year: yearLabel,
      periodLabel: `${monthLabel}-${yearLabel.toString().slice(-2)}`
    });
  }
  return result;
};

export const baseMonths = getRollingMonths();

/**
 * Data Dummy Indomie (Hanya untuk inisialisasi awal)
 */
const INDOMIE_SAMPLE_DATA = [
  66, 70, 65, 72, 60, 68, 64, 70, 62, 71, 68, 74,
  68, 72, 64, 69, 62, 67, 66, 70, 63, 71, 69, 74 
];

const generateHistoricalData = (baseDemand: number): MonthlyData[] => {
  return baseMonths.map((m, idx) => {
    const randomFluc = (Math.random() * 0.2) + 0.9;
    return {
      id: m.id,
      month: m.month,
      year: m.year,
      periodLabel: m.periodLabel,
      demand: Math.round(baseDemand * randomFluc)
    };
  });
};

export const INITIAL_PRODUCTS: ProductData[] = [
  {
    id: '1',
    name: 'Indomie Goreng',
    unit: 'Dus',
    stock: { currentStock: 250, safetyStock: 6 },
    recommendation: { bestN: 4, mape: 0 },
    data: baseMonths.map((m, idx) => ({
      ...m,
      demand: INDOMIE_SAMPLE_DATA[idx] || 68
    }))
  },
  {
    id: '2',
    name: 'Minyak Bimoli 2L',
    unit: 'Pcs',
    stock: { currentStock: 45, safetyStock: 5 },
    recommendation: { bestN: 4, mape: 0 },
    data: generateHistoricalData(55)
  },
  {
    id: '3',
    name: 'Beras Rojolele 5kg',
    unit: 'Karung',
    stock: { currentStock: 10, safetyStock: 3 },
    recommendation: { bestN: 2, mape: 0 },
    data: generateHistoricalData(30)
  },
  {
    id: '4',
    name: 'Gula Gulaku 1kg',
    unit: 'Pcs',
    stock: { currentStock: 5, safetyStock: 7 },
    recommendation: { bestN: 4, mape: 0 },
    data: generateHistoricalData(85)
  },
  {
    id: '5',
    name: 'Terigu Segitiga Biru 1kg',
    unit: 'Pcs',
    stock: { currentStock: 50, safetyStock: 4 },
    recommendation: { bestN: 8, mape: 0 },
    data: generateHistoricalData(45)
  }
];
