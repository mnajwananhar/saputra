
import React, { useState, useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { calculateSMA, formatNumber } from '../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, Activity, Star, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const Forecast: React.FC = () => {
  const { products, loading } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [period, setPeriod] = useState<number>(4);

  // Set initial selected product when products load
  React.useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
  const productData = selectedProduct?.data || [];

  const lastDataPoint = productData.length > 0 ? productData[productData.length - 1] : null;

  // Logic to find the best N automatically based on lowest MAPE
  const bestNData = useMemo(() => {
    if (!productData.length) return { n: 4, mape: 0 };
    const periods = [2, 4, 6, 8];
    const evaluations = periods.map(n => {
      const { metrics } = calculateSMA(productData, n);
      return { n, mape: metrics.mape };
    });
    return evaluations.sort((a, b) => a.mape - b.mape)[0];
  }, [productData]);

  const { results, metrics, nextPeriodForecast } = useMemo(() => {
      if (!productData.length) return { results: [], metrics: {mad:0, mse:0, mape:0}, nextPeriodForecast: 0 };
      return calculateSMA(productData, period);
    }, [productData, period]
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!products.length || !selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 border-dashed">
        <Activity className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Belum Ada Data Produk</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Silakan tambahkan produk terlebih dahulu di menu Produk untuk melihat analisis peramalan.
        </p>
      </div>
    );
  }

  if (!lastDataPoint) {
      return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 border-dashed">
        <Activity className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Data Historis Kosong</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Produk ini belum memiliki data historis penjualan. Silakan input data penjualan di menu Produk.
        </p>
      </div>
    );
  }

  const isLastDataEmpty = lastDataPoint.demand === 0;

  // Periode target ramalan adalah bulan setelah data terakhir
  const targetDate = new Date(lastDataPoint.year, lastDataPoint.month === 'Jan' ? 0 : 
                             lastDataPoint.month === 'Feb' ? 1 :
                             lastDataPoint.month === 'Mar' ? 2 :
                             lastDataPoint.month === 'Apr' ? 3 :
                             lastDataPoint.month === 'Mei' ? 4 :
                             lastDataPoint.month === 'Jun' ? 5 :
                             lastDataPoint.month === 'Jul' ? 6 :
                             lastDataPoint.month === 'Agt' ? 7 :
                             lastDataPoint.month === 'Sep' ? 8 :
                             lastDataPoint.month === 'Okt' ? 9 :
                             lastDataPoint.month === 'Nov' ? 10 : 11);
  
  targetDate.setMonth(targetDate.getMonth() + 1);
  const targetPeriodLabel = targetDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  const chartData = results.map(r => ({
    name: r.periodLabel,
    Aktual: r.actual,
    Peramalan: r.forecast
  }));

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none uppercase">Analisis SMA</h1>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Trend & Prediction Analysis</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
           <div className="relative w-full md:w-auto">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="appearance-none h-12 w-full md:w-56 rounded-2xl border border-slate-200 bg-white text-slate-900 px-6 pr-12 text-[10px] font-black uppercase tracking-widest focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm cursor-pointer"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
           </div>

           <div className="flex w-full md:w-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              {[2, 4, 6, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setPeriod(n)}
                  className={`relative flex-1 md:flex-none rounded-xl px-5 py-2 text-[10px] font-black tracking-widest transition-all ${
                    period === n
                      ? 'bg-[#0F172A] text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  N={n}
                  {bestNData.n === n && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                       <Star className="h-1.5 w-1.5 text-black fill-current" />
                    </div>
                  )}
                </button>
              ))}
           </div>
        </div>
      </div>

      {isLastDataEmpty && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex items-start gap-5 animate-pulse">
           <div className="bg-amber-100 p-3 rounded-2xl">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
           </div>
           <div>
              <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Data Input Diperlukan!</h4>
              <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed">
                 Data penjualan untuk bulan <span className="font-bold underline">{lastDataPoint.periodLabel}</span> masih bernilai 0. 
                 Agar ramalan untuk bulan <span className="font-bold">{targetPeriodLabel}</span> akurat, mohon isi data penjualan terakhir di menu <span className="font-bold">Produk</span>.
              </p>
           </div>
        </div>
      )}

      <div className="grid gap-6 md:gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 md:space-y-10">
           <div className="rounded-3xl bg-indigo-50 border border-indigo-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest">Rekomendasi Sistem</h4>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">
                       Orde Terbaik: <span className="font-bold underline">N={bestNData.n}</span> (Tingkat error paling rendah: {formatNumber(bestNData.mape)}%)
                    </p>
                 </div>
              </div>
              <button 
                 onClick={() => setPeriod(bestNData.n)}
                 className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
              >
                 Terapkan N={bestNData.n}
              </button>
           </div>

           <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
                <h3 className="text-xl font-heading font-extrabold text-slate-900 tracking-tighter uppercase">Visualisasi Data</h3>
                <div className="inline-flex px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500 tracking-widest uppercase self-start sm:self-auto">Aktual vs Ramalan</div>
             </div>
             <div className="h-64 md:h-96 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                   <XAxis 
                      dataKey="name" 
                      tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 700}} 
                      axisLine={false}
                      tickLine={false}
                   />
                   <YAxis 
                      tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 700}} 
                      axisLine={false}
                      tickLine={false}
                   />
                   <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontSize: '12px', fontWeight: '700' }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                   <Line type="monotone" dataKey="Aktual" stroke="#0F172A" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                   <Line type="monotone" dataKey="Peramalan" stroke="#6366f1" strokeWidth={3} strokeDasharray="10 5" dot={false} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>

        <div className="space-y-6 md:space-y-10">
           <div className="rounded-[2rem] md:rounded-[2.5rem] bg-[#0F172A] p-8 md:p-10 text-white shadow-2xl shadow-indigo-200/50 transform hover:scale-[1.01] transition-all">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400">Target Ramalan</p>
                    <h3 className="text-2xl font-heading font-extrabold mt-1 tracking-tighter uppercase">{targetPeriodLabel}</h3>
                 </div>
                 <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
                    <Info className="h-4 w-4 text-indigo-400" />
                 </div>
              </div>
              
              <div className="mt-8 md:mt-10 flex items-baseline gap-3">
                 <span className="text-6xl md:text-7xl font-heading font-extrabold tracking-tighter">{formatNumber(nextPeriodForecast, 0)}</span>
                 <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">{selectedProduct.unit}</span>
              </div>
              <div className="h-1 w-12 bg-indigo-500 my-8 md:my-10"></div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-3">
                    <span className="text-slate-500">Bulan Terakhir Data</span>
                    <span className="text-white">{lastDataPoint.periodLabel}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-3">
                    <span className="text-slate-500">Status Data Terakhir</span>
                    <span className={isLastDataEmpty ? "text-red-400" : "text-green-400"}>{isLastDataEmpty ? "Kosong" : "Tersedia"}</span>
                 </div>
              </div>
           </div>

           <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="border-b border-slate-50 bg-slate-50/50 px-8 py-6">
                 <h3 className="font-heading font-extrabold text-slate-900 tracking-tighter text-xl uppercase">Detail Iterasi</h3>
              </div>
              <div className="flex-1 overflow-auto scrollbar-hide">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-400 sticky top-0 z-10">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Bulan</th>
                      <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest">Aktual</th>
                      <th className="px-8 py-4 text-right text-[10px] font-bold uppercase tracking-widest">Ramalan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...results].reverse().map((row, idx) => (
                      <tr key={idx} className={`hover:bg-slate-50/50 ${idx === 0 && isLastDataEmpty ? 'bg-red-50/30' : ''}`}>
                        <td className="px-8 py-4 font-bold text-slate-900 text-[11px] tabular-nums tracking-widest">
                           {row.periodLabel}
                           {idx === 0 && <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded-md bg-slate-900 text-white">TERBARU</span>}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold text-[11px] tabular-nums ${row.actual === 0 ? 'text-red-500 underline decoration-dotted' : 'text-slate-600'}`}>
                           {row.actual}
                        </td>
                        <td className="px-8 py-4 text-right text-indigo-600 font-heading font-extrabold tabular-nums">
                           {formatNumber(row.forecast, 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
