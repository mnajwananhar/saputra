
import React, { useState, useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Plus, Search, Trash2, History, X, Package, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductData, MonthlyData } from '../types';

const ProductManagement: React.FC = () => {
  const { products, addProduct, deleteProduct, updateHistoricalData, initializeHistory } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

  const [newProdName, setNewProdName] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('Pcs');
  const [newProdStock, setNewProdStock] = useState(0);
  const [newProdSafety, setNewProdSafety] = useState(0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProdName) {
      addProduct(newProdName, newProdUnit, newProdStock, newProdSafety);
      setIsAddOpen(false);
      resetForm();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini? Semua data historis akan hilang.')) {
      deleteProduct(id);
    }
  };

  const openHistoryModal = async (product: ProductData) => {
    // Check if data is empty or invalid (contains current month or future)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

    const hasData = product.data && product.data.length > 0;
    
    // Invalid if any data point is >= current month (same year) OR future year
    const hasInvalidData = hasData && product.data.some(d => {
       const dMonthIndex = monthsList.indexOf(d.month);
       if (d.year > currentYear) return true;
       if (d.year === currentYear && dMonthIndex >= currentMonthIndex) return true;
       return false;
    });

    if (!hasData || hasInvalidData) {
      try {
        // Auto-initialize/reset if empty or invalid
        await initializeHistory(product.id);
        
        // Fetch updated product data to show in modal
        // Note: initializeHistory already refreshes products via context, 
        // but we need the updated instance for 'editingProduct'.
        // Since we can't easily wait for context update here without effects,
        // we'll optimistically assume success and let the UI update reactively 
        // or re-fetch from context if possible. 
        // Better approach: Set special flag or wait a bit.
        // Actually, initializeHistory in context awaits refreshProducts.
        // So 'products' state should be updated. We need to find the updated product from the list.
        
        // Find the updated product from the fresh 'products' list (which triggers re-render)
        // But here inside the function 'products' is stale closure.
        // We will set editingProduct ID and let a useEffect update the data.
        setEditingProduct(product); 
        setIsHistoryOpen(true);
      } catch (error) {
        console.error("Auto-init failed", error);
        alert("Gagal menyiapkan data. Silakan coba lagi.");
      }
    } else {
      setEditingProduct(product);
      setIsHistoryOpen(true);
    }
  };

  // Effect to keep editingProduct in sync with global products state
  React.useEffect(() => {
    if (isHistoryOpen && editingProduct) {
      const updated = products.find(p => p.id === editingProduct.id);
      if (updated) {
        setEditingProduct(updated);
      }
    }
  }, [products, isHistoryOpen, editingProduct?.id]);

  const resetForm = () => {
    setNewProdName('');
    setNewProdUnit('Pcs');
    setNewProdStock(0);
    setNewProdSafety(0);
  };

  // Grouping dinamis berdasarkan tahun unik yang ada di data
  const groupedData = useMemo(() => {
    if (!editingProduct) return {};
    const dataWithIndex = editingProduct.data.map((item, index) => ({...item, originalIndex: index}));
    return dataWithIndex.reduce((acc, item) => {
      const year = item.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {} as Record<number, (MonthlyData & { originalIndex: number })[]>);
  }, [editingProduct]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none uppercase">Produk</h1>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Inventory Management</p>
        </div>
        <button 
           onClick={() => setIsAddOpen(true)}
           className="inline-flex items-center gap-2 rounded-2xl bg-[#0F172A] px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-slate-200 hover:bg-black transition-all transform hover:-translate-y-0.5 uppercase tracking-widest"
        >
           <Plus className="h-4 w-4" />
           Tambah Baru
        </button>
      </div>

      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-6 py-4 border border-slate-200 rounded-2xl bg-white text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all"
          placeholder="Cari nama produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-slate-900 text-xl tracking-tighter uppercase">{product.name}</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest mt-1">
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{product.unit}</span>
                  <span className="text-slate-400">Stok: <span className={product.stock.currentStock < product.stock.safetyStock ? "text-red-500" : "text-slate-900"}>{product.stock.currentStock}</span></span>
                  <span className="text-slate-400">Safety: {product.stock.safetyStock}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => openHistoryModal(product)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-[#0F172A] hover:text-white transition-all border border-slate-100"
              >
                <History className="h-4 w-4" />
                Input Data Jual
              </button>
              <button 
                onClick={() => handleDelete(product.id)}
                className="p-3 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <h3 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tighter uppercase">Tambah Produk</h3>
                 <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-6 w-6" />
                 </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-3.5 border border-slate-200 bg-white text-slate-900 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm font-medium transition-all"
                      placeholder="Contoh: Minyak Goreng 2L"
                      value={newProdName}
                      onChange={e => setNewProdName(e.target.value)}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Satuan</label>
                        <select 
                          className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-white text-slate-900 text-sm font-medium transition-all"
                          value={newProdUnit}
                          onChange={e => setNewProdUnit(e.target.value)}
                        >
                           <option value="Pcs">Pcs</option>
                           <option value="Dus">Dus</option>
                           <option value="Bal">Bal</option>
                           <option value="Pack">Pack</option>
                           <option value="Kg">Kg</option>
                           <option value="Ltr">Ltr</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stok Awal</label>
                        <input 
                          type="number" 
                          className="w-full px-5 py-3.5 border border-slate-200 bg-white text-slate-900 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm font-medium transition-all"
                          value={newProdStock}
                          onChange={e => setNewProdStock(parseInt(e.target.value) || 0)}
                          onFocus={(e) => e.target.select()}
                        />
                    </div>
                 </div>
                 <div className="pt-6">
                    <button type="submit" className="w-full py-4 bg-[#0F172A] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black shadow-2xl shadow-slate-200 transition-all">Simpan Produk</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isHistoryOpen && editingProduct && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
               <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div>
                     <h3 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tighter uppercase">Data Historis: {editingProduct.name}</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Laporan Penjualan (24 Bulan Terakhir)</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-6 w-6" />
                     </button>
                  </div>
               </div>
               
               <div className="p-10 overflow-y-auto">
                  <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-start gap-4">
                     <div className="bg-white p-2 rounded-xl">
                        <Info className="h-5 w-5 text-indigo-600" />
                     </div>
                     <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                        Input data penjualan bulan <span className="font-bold">saat ini</span> (misal: Januari) agar sistem dapat meramal kebutuhan stok untuk bulan <span className="font-bold">depan</span> (Februari).
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {(Object.entries(groupedData) as [string, (MonthlyData & { originalIndex: number })[]][])
                       .sort((a,b) => Number(a[0]) - Number(b[0])).map(([year, months]) => (
                        <div key={year} className="space-y-5">
                           <h4 className="font-heading font-extrabold text-indigo-600 text-lg tracking-tighter border-b border-indigo-50 pb-3 leading-none">Tahun {year}</h4>
                           <div className="grid grid-cols-2 gap-4">
                              {months.map((monthData, idx) => {
                                 const isLastInProduct = monthData.originalIndex === editingProduct.data.length - 1;
                                 return (
                                    <div key={monthData.id} className="space-y-1.5">
                                       <div className="flex justify-between items-center px-1">
                                          <div className="flex items-center gap-0.5 group">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{monthData.month}-</span>
                                            {(() => {
                                                const monthMap: Record<string, number> = {'Jan':0, 'Feb':1, 'Mar':2, 'Apr':3, 'Mei':4, 'Jun':5, 'Jul':6, 'Agt':7, 'Sep':8, 'Okt':9, 'Nov':10, 'Des':11};
                                                const mIndex = monthMap[monthData.month] ?? 0;
                                                const daysInMonth = new Date(monthData.year, mIndex + 1, 0).getDate();
                                                
                                                const currentDay = monthData.day || 1;

                                                const handleDateChange = (val: number) => {
                                                    if (val > daysInMonth) val = daysInMonth;
                                                    if (val < 1) val = 1;
                                                    updateHistoricalData(editingProduct.id, monthData.id, { day: val });
                                                };

                                                return (
                                                    <div className="relative flex items-center">
                                                        <input 
                                                            type="number"
                                                            value={currentDay}
                                                            onChange={(e) => handleDateChange(parseInt(e.target.value) || 1)}
                                                            className="w-5 bg-transparent text-slate-400 font-bold text-[10px] p-0 border-none outline-none focus:ring-0 text-left [&::-webkit-inner-spin-button]:appearance-none hover:text-indigo-600 transition-colors cursor-pointer"
                                                        />
                                                        <div className="flex flex-col -ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleDateChange(currentDay + 1)} 
                                                                className="text-slate-400 hover:text-indigo-600 leading-none h-1.5 flex items-center justify-center mb-0.5"
                                                            >
                                                                <ChevronUp style={{ width: 8, height: 8 }} strokeWidth={4} />
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleDateChange(currentDay - 1)} 
                                                                className="text-slate-400 hover:text-indigo-600 leading-none h-1.5 flex items-center justify-center mt-0.5"
                                                            >
                                                                <ChevronDown style={{ width: 8, height: 8 }} strokeWidth={4} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                          </div>
                                          {isLastInProduct && <span className="text-[7px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Terbaru</span>}
                                       </div>
                                       <input 
                                          type="number"
                                          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-4 outline-none text-right font-heading font-bold text-sm transition-all ${
                                             isLastInProduct 
                                             ? 'border-indigo-300 bg-indigo-50/30 focus:ring-indigo-100 focus:border-indigo-500' 
                                             : 'border-slate-200 bg-white focus:ring-indigo-50 focus:border-indigo-500'
                                          }`}
                                          value={monthData.demand}
                                          onChange={(e) => updateHistoricalData(editingProduct.id, monthData.id, { demand: parseInt(e.target.value) || 0 })}
                                          onFocus={(e) => e.target.select()}
                                       />
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-end">
                  <button onClick={() => setIsHistoryOpen(false)} className="px-10 py-4 bg-[#0F172A] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all">
                     Simpan Data
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ProductManagement;
