import React, { useMemo, useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useSuppliers } from '../contexts/SupplierContext';
import { aggregateTransactionsToMonthlyWithDetails, MonthlyDataWithDetails } from '../utils';
import { Download, FileSpreadsheet, ChevronDown, ChevronUp, Calendar, Search } from 'lucide-react';

interface ExpandedCell {
  productId: string;
  period: string;
}

const HistoricalData: React.FC = () => {
  const { products, loading } = useProducts();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { suppliers, loading: suppliersLoading } = useSuppliers();
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [expandedCell, setExpandedCell] = useState<ExpandedCell | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    
    transactions.forEach(t => {
      const year = new Date(t.date).getFullYear().toString();
      years.add(year);
    });
    
    return Array.from(years).sort().reverse();
  }, [transactions]);
const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.unit.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const aggregatedData = useMemo(() => {
    const result: Record<string, MonthlyDataWithDetails[]> = {};

    products.forEach(product => {
      // Filter transaksi berdasarkan produk dan tahun terpilih
      const productTransactions = transactions.filter(transaction => {
        const hasProduct = transaction.items.some(item => item.productId === product.id);
        if (!hasProduct) return false;

        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();

        if (selectedYear === 'last_1_year') {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          return transactionDate >= oneYearAgo;
        } else {
          return transactionYear.toString() === selectedYear;
        }
      });

      result[product.id] = aggregateTransactionsToMonthlyWithDetails(productTransactions);
    });
    
    return result;
  }, [products, transactions, selectedYear]);

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) return;

    const headers = ['Periode', ...filteredProducts.map(p => `${p.name} (${p.unit})`)];

    const allPeriods = new Set<string>();
    filteredProducts.forEach(p => {
      aggregatedData[p.id].forEach(data => allPeriods.add(data.periodLabel));
    });

    const sortedPeriods = Array.from(allPeriods).sort();

    const rows = sortedPeriods.map(period => {
      const rowData = [
        period,
        ...products.map(p => {
          const periodData = aggregatedData[p.id].find(d => d.periodLabel === period);
          return periodData ? periodData.demand : 0;
        })
      ];
      return rowData.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data_penjualan_saputra_jaya_${selectedYear}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = (productId: string, period: string) => {
    if (expandedCell?.productId === productId && expandedCell?.period === period) {
      setExpandedCell(null);
    } else {
      setExpandedCell({ productId, period });
    }
  };

  if (loading || transactionsLoading || suppliersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 border-dashed">
        <FileSpreadsheet className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Data Kosong</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Belum ada data historis yang tersedia. Silakan tambahkan produk dan lakukan transaksi.
        </p>
      </div>
    );
  }

  const allPeriods = new Set<string>();
  filteredProducts.forEach(p => {
    aggregatedData[p.id].forEach(data => allPeriods.add(data.periodLabel));
  });

  // Sort periods. 
  // Note: periodLabel format is "Month-Year" (e.g. "Jan-24"). 
  // String sort works coincidentally for some formats but safer to parse.
  // aggregateTransactionsToMonthlyWithDetails returns sorted array, so we can rely on that structure if handled carefully,
  // but here we merge data from multiple products.

  // Custom sort for "MMM-YY" format
  const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
    'Jul': 6, 'Agt': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
  };

  const sortedPeriods = Array.from(allPeriods).sort((a, b) => {
    const [monthA, yearA] = a.split('-');
    const [monthB, yearB] = b.split('-');

    // Compare years first (assuming 2 digits year means 20xx)
    const yA = parseInt(yearA);
    const yB = parseInt(yearB);
    if (yA !== yB) return yA - yB;

    // Compare months
    return monthMap[monthA] - monthMap[monthB];
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none">Data Historis</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Historical Sales Record • Klik sel untuk detail harian</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 w-full md:w-72 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

        <div className="flex items-center gap-3">
          {/* Year Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none pl-4 pr-10 py-4 rounded-2xl border border-slate-200 bg-white text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="last_1_year">1 TAHUN TERAKHIR</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={sortedPeriods.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-auto max-h-[600px]">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50/50 text-slate-400 sticky top-0 z-20">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] sticky left-0 bg-slate-100 z-30 min-w-[200px] border-b border-r border-slate-200">Produk</th>
                {sortedPeriods.map((period, index) => (
                  <th key={index} className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap bg-slate-50 border-b border-slate-200 min-w-[80px]">
                    {period}
                  </th>
                ))}
                {sortedPeriods.length === 0 && (
                  <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-50 border-b border-slate-200 w-full">
                    -
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((p, rowIndex) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 sticky left-0 bg-white z-10 border-r border-b border-slate-100">
                    <span className="inline-flex items-center gap-2 text-sm font-heading font-bold text-slate-900 tracking-tighter whitespace-nowrap">
                      <FileSpreadsheet className="h-4 w-4 text-slate-300 flex-shrink-0" />
                      {p.name} ({p.unit})
                    </span>
                  </td>
                  {sortedPeriods.map((period, index) => {
                    const periodData = aggregatedData[p.id].find(d => d.periodLabel === period);
                    const isExpanded = expandedCell?.productId === p.id && expandedCell?.period === period;
                    const hasDailyData = periodData && periodData.dailyTransactions && periodData.dailyTransactions.length > 0;

                    return (
                      <td
                        key={index}
                        className={`px-4 py-4 text-center border-b border-slate-100 relative ${hasDailyData ? 'cursor-pointer hover:bg-indigo-50/50' : ''}`}
                        onClick={() => hasDailyData && toggleExpand(p.id, period)}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className={`tabular-nums font-heading font-extrabold text-lg tracking-tighter ${hasDailyData ? 'text-indigo-600' : 'text-slate-600'}`}>
                            {periodData ? periodData.demand : 0}
                          </span>
                          {hasDailyData && (
                            isExpanded ?
                              <ChevronUp className="h-3 w-3 text-indigo-400" /> :
                              <ChevronDown className="h-3 w-3 text-indigo-400" />
                          )}
                        </div>

                        {/* Expanded daily transactions popup */}
                        {isExpanded && periodData && (
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                              <Calendar className="h-4 w-4 text-indigo-500" />
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Detail Penjualan {period}
                              </span>
                            </div>
                            <div className="space-y-2 max-h-[200px] overflow-auto">
                              {periodData.dailyTransactions.map((daily, dIdx) => (
                                <div key={dIdx} className="flex items-center justify-between gap-4 text-sm">
                                  <span className="text-slate-500 text-xs">{daily.date}</span>
                                  <span className="font-bold text-slate-900 tabular-nums">{daily.quantity} {p.unit}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                              <span className="font-heading font-extrabold text-indigo-600 tabular-nums">{periodData.demand} {p.unit}</span>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {sortedPeriods.length === 0 && (
                    <td className="px-4 py-4 text-center border-b border-slate-100 text-slate-400 text-xs italic">
                      Tidak ada data
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50/30 p-6 border-t border-slate-100">
          <p className="text-[10px] text-center text-slate-400 uppercase tracking-[0.2em]">
            Data diambil dari transaksi penjualan harian • {products.length} produk • {sortedPeriods.length} periode • Klik angka untuk detail
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;