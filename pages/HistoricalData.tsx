import React, { useMemo, useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useSuppliers } from '../contexts/SupplierContext';
import { aggregateTransactionsToMonthlyWithDetails, MonthlyDataWithDetails } from '../utils';
import { Download, FileSpreadsheet, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface ExpandedCell {
  productId: string;
  period: string;
}

const HistoricalData: React.FC = () => {
  const { products, loading } = useProducts();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { suppliers, loading: suppliersLoading } = useSuppliers();
  const [expandedCell, setExpandedCell] = useState<ExpandedCell | null>(null);

  // Aggregate transaction data by product with daily details
  const aggregatedData = useMemo(() => {
    const result: Record<string, MonthlyDataWithDetails[]> = {};

    products.forEach(product => {
      const productTransactions = transactions.filter(transaction =>
        transaction.items.some(item => item.productId === product.id)
      );

      result[product.id] = aggregateTransactionsToMonthlyWithDetails(productTransactions);
    });

    return result;
  }, [products, transactions]);

  const handleExportCSV = () => {
    if (products.length === 0) return;

    const headers = ['Periode', ...products.map(p => `${p.name} (${p.unit})`)];

    // Get all unique periods across all products
    const allPeriods = new Set<string>();
    products.forEach(p => {
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
    link.setAttribute('download', `data_penjualan_saputra_jaya_${new Date().toISOString().split('T')[0]}.csv`);
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

  // Get all unique periods across all products
  const allPeriods = new Set<string>();
  products.forEach(p => {
    aggregatedData[p.id].forEach(data => allPeriods.add(data.periodLabel));
  });

  const sortedPeriods = Array.from(allPeriods).sort();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none">Data Historis</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Historical Sales Record • Klik sel untuk detail harian</p>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50/30 p-6 border-t border-slate-100">
          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
            Data diambil dari transaksi penjualan harian • {products.length} produk • {sortedPeriods.length} periode • Klik angka untuk detail
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;