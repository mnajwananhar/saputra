
import React, { useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useSuppliers } from '../contexts/SupplierContext';
import { Package, Users, TrendingUp, AlertTriangle, ShoppingBag, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { products } = useProducts();
  const { transactions } = useTransactions();
  const { suppliers } = useSuppliers();

  const stats = useMemo(() => {
    const lowStockProducts = products.filter(p => p.stock.currentStock <= p.stock.minStock);
    
    const thisMonth = new Date();
    const thisMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.transactionDate);
      return tDate.getMonth() === thisMonth.getMonth() && 
             tDate.getFullYear() === thisMonth.getFullYear();
    });

    const monthlyRevenue = thisMonthTransactions.reduce((sum, t) => 
      sum + t.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0), 0
    );

    const totalSold = thisMonthTransactions.reduce((sum, t) =>
      sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    const topProducts = products
      .map(p => {
        const sold = thisMonthTransactions.reduce((sum, t) =>
          sum + (t.items.find(i => i.productId === p.id)?.quantity || 0), 0
        );
        return { ...p, sold };
      })
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return {
      lowStockProducts,
      monthlyRevenue,
      totalSold,
      topProducts,
      transactionCount: thisMonthTransactions.length
    };
  }, [products, transactions]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div>
        <h1 className="text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none uppercase">Dashboard</h1>
        <p className="text-slate-400 mt-3 text-[10px] font-bold uppercase tracking-[0.3em]">Overview & Quick Stats - {currentMonth}</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white p-7 rounded-[1.75rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-slate-400 mb-4">
            <Package className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Produk</span>
          </div>
          <div className="text-4xl font-heading font-extrabold text-slate-900 tracking-tighter">
            {products.length} <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">SKU</span>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[1.75rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-slate-400 mb-4">
            <Users className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Supplier</span>
          </div>
          <div className="text-4xl font-heading font-extrabold text-slate-900 tracking-tighter">
            {suppliers.length} <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">VENDOR</span>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[1.75rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-400 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Stok Rendah</span>
          </div>
          <div className={`text-4xl font-heading font-extrabold tracking-tighter ${stats.lowStockProducts.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {stats.lowStockProducts.length} <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">PRODUK</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-[#0F172A] p-7 rounded-[1.75rem] border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2.5 text-indigo-400 mb-4">
            <DollarSign className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Pendapatan Bulan Ini</span>
          </div>
          <div className="text-2xl font-heading font-extrabold text-white tracking-tighter">
            {formatCurrency(stats.monthlyRevenue)}
          </div>
        </div>

        <div className="bg-[#0F172A] p-7 rounded-[1.75rem] border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2.5 text-indigo-400 mb-4">
            <ShoppingBag className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Transaksi Bulan Ini</span>
          </div>
          <div className="text-4xl font-heading font-extrabold text-white tracking-tighter">
            {stats.transactionCount} <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">TRX</span>
          </div>
        </div>

        <div className="bg-[#0F172A] p-7 rounded-[1.75rem] border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2.5 text-indigo-400 mb-4">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Unit Terjual</span>
          </div>
          <div className="text-4xl font-heading font-extrabold text-white tracking-tighter">
            {stats.totalSold} <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">UNIT</span>
          </div>
        </div>
      </div>

      {stats.topProducts.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h3 className="font-heading font-extrabold text-slate-900 text-xl tracking-tighter uppercase">Top 5 Produk Bulan Ini</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Berdasarkan unit terjual</p>
          </div>
          <div className="p-6 space-y-3">
            {stats.topProducts.map((product, idx) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-heading font-black text-base">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-slate-900 text-sm tracking-tight uppercase">{product.name}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{product.unit}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-heading font-extrabold text-indigo-600 tracking-tighter">{product.sold}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">UNIT</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-red-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-red-100 bg-red-50/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="font-heading font-extrabold text-red-900 text-xl tracking-tighter uppercase">Alert: Stok Rendah</h3>
            </div>
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-0.5">Produk yang perlu segera diorder</p>
          </div>
          <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-red-50/30 rounded-xl border border-red-100">
                <div>
                  <div className="font-heading font-extrabold text-slate-900 text-sm tracking-tight uppercase">{product.name}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{product.unit}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-heading font-extrabold text-red-500 tracking-tighter">{product.stock.currentStock}</div>
                  <div className="text-[9px] text-red-400 font-bold uppercase tracking-widest">MIN: {product.stock.minStock}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-5 border-t border-red-100 bg-red-50/20">
            <Link 
              to="/plan" 
              className="block w-full text-center py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-heading font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Lihat Rekomendasi Pembelian
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
