import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Download, FileSpreadsheet } from 'lucide-react';

const HistoricalData: React.FC = () => {
  const { products, loading } = useProducts();

  const handleExportCSV = () => {
    if (products.length === 0) return;
    const headers = ['Periode', ...products.map(p => `${p.name} (${p.unit})`)];
    const baseData = products[0].data || [];
    const rows = baseData.map((_, index) => {
      const rowData = [
        products[0].data[index]?.periodLabel || '-',
        ...products.map(p => p.data[index]?.demand || 0)
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

  if (loading) {
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
          Belum ada data historis yang tersedia. Silakan tambahkan produk dan data penjualan.
        </p>
      </div>
    );
  }

  // Ensure safe access to base data structure
  const baseData = products[0].data || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
         <div>
            <h1 className="text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none">Data Historis</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Historical Sales Record</p>
         </div>
         <button 
            onClick={handleExportCSV}
            disabled={baseData.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
         >
            <Download className="h-4 w-4" />
            Export CSV
         </button>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 text-slate-400">
                  <tr>
                     <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em]">Periode</th>
                     {products.map(p => (
                        <th key={p.id} className="px-6 py-6 text-right text-[10px] font-bold uppercase tracking-[0.2em]">
                           {p.name} ({p.unit})
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {baseData.map((_, index) => (
                     <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6">
                           <span className="inline-flex items-center gap-3 text-sm font-heading font-bold text-slate-900 tracking-tighter">
                             <FileSpreadsheet className="h-4 w-4 text-slate-300" />
                             {products[0].data[index]?.periodLabel || '-'}
                           </span>
                        </td>
                        {products.map(p => (
                           <td key={p.id} className="px-6 py-6 text-right text-slate-600 tabular-nums font-heading font-extrabold text-lg tracking-tighter">
                              {p.data[index]?.demand || 0}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="bg-slate-50/30 p-8 border-t border-slate-50">
            <p className="text-[10px] text-center text-slate-300 font-bold uppercase tracking-[0.2em]">
              Data digunakan sebagai basis perhitungan algoritma SMA.
            </p>
         </div>
      </div>
    </div>
  );
};

export default HistoricalData;