import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useSuppliers } from '../contexts/SupplierContext';
import { Plus, Edit2, Save, X } from 'lucide-react';

const ProductManagement: React.FC = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { suppliers, loading: suppliersLoading } = useSuppliers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    price: 0,
    cost: 0,
    currentStock: 0,
    safetyStock: 0,
    supplierId: ''
  });

  useEffect(() => {
    if (editingId) {
      const product = products.find(p => p.id === editingId);
      if (product) {
        setFormData({
          name: product.name,
          unit: product.unit,
          price: product.price,
          cost: product.cost,
          currentStock: product.stock.currentStock,
          safetyStock: product.stock.safetyStock,
          supplierId: product.supplierId || ''
        });
      }
    }
  }, [editingId, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateProduct(editingId, {
        name: formData.name,
        unit: formData.unit,
        price: formData.price,
        cost: formData.cost,
        stock: {
          currentStock: formData.currentStock,
          safetyStock: formData.safetyStock
        },
        supplierId: formData.supplierId
      });
    } else {
      addProduct({
        name: formData.name,
        unit: formData.unit,
        price: formData.price,
        cost: formData.cost,
        stock: {
          currentStock: formData.currentStock,
          safetyStock: formData.safetyStock
        },
        supplierId: formData.supplierId
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      unit: '',
      price: 0,
      cost: 0,
      currentStock: 0,
      safetyStock: 0,
      supplierId: ''
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      unit: product.unit,
      price: product.price,
      cost: product.cost,
      currentStock: product.stock.currentStock,
      safetyStock: product.stock.safetyStock,
      supplierId: product.supplierId || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
    }
  };

  if (loading || suppliersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none uppercase">Produk</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-3">Manajemen Data Produk</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </button>
      </div>

      <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400">
            <tr>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">Nama</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">Satuan</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">Harga Jual</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">Harga Beli</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">Stok</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">Supplier</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const supplier = suppliers.find(s => s.id === product.supplierId);
              return (
                <tr key={product.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-6 font-bold text-slate-900 text-[11px] uppercase tracking-widest">{product.name}</td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">{product.unit}</td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">Rp {product.cost.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">{product.stock.currentStock} {product.unit}</td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">{supplier?.name || '-'}</td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-2 rounded-xl bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all border border-slate-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for adding/editing products */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8">
            <h3 className="text-xl font-heading font-extrabold text-slate-900 tracking-tighter uppercase mb-6">
              {editingId ? 'Edit Produk' : 'Tambah Produk'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Nama Produk *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Satuan *</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Supplier</label>
                    <select
                      value={formData.supplierId}
                      onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="">Pilih Supplier</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Harga Jual *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Harga Beli *</label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Stok Saat Ini</label>
                    <input
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3.5 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;