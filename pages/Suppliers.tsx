import React, { useState, useEffect, useMemo } from "react";
import { useSuppliers } from "../contexts/SupplierContext";
import { Plus, Edit2, Save, X, Search } from "lucide-react";

const Suppliers: React.FC = () => {
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } =
    useSuppliers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (editingId) {
      const supplier = suppliers.find((s) => s.id === editingId);
      if (supplier) {
        setFormData({
          name: supplier.name,
          contact: supplier.contact || "",
          phone: supplier.phone || "",
          email: supplier.email || "",
          address: supplier.address || "",
        });
      }
    }
  }, [editingId, suppliers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateSupplier(editingId, formData);
    } else {
      addSupplier(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", contact: "", phone: "", email: "", address: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const startEdit = (supplier: any) => {
    setEditingId(supplier.id);
    setFormData({
      name: supplier.name,
      contact: supplier.contact || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus supplier ini?")) {
      deleteSupplier(id);
    }
  };

  const filteredSuppliers = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    if (!normalizedQuery) {
      return suppliers;
    }

    return suppliers.filter((supplier) => {
      const matchesName = supplier.name.toLowerCase().includes(normalizedQuery);
      const matchesContact =
        supplier.contact?.toLowerCase().includes(normalizedQuery) ?? false;
      const matchesPhone =
        supplier.phone?.toLowerCase().includes(normalizedQuery) ?? false;
      const matchesEmail =
        supplier.email?.toLowerCase().includes(normalizedQuery) ?? false;
      const matchesAddress =
        supplier.address?.toLowerCase().includes(normalizedQuery) ?? false;

      return (
        matchesName ||
        matchesContact ||
        matchesPhone ||
        matchesEmail ||
        matchesAddress
      );
    });
  }, [suppliers, searchQuery]);

  if (loading) {
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
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none uppercase">
            Supplier
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-3">
            Manajemen Data Supplier
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Supplier
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Cari supplier berdasarkan nama, kontak, telepon, email, atau alamat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-medium placeholder:text-slate-400"
        />
      </div>

      <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400">
            <tr>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">
                Nama
              </th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">
                Kontak
              </th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">
                Telepon
              </th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">
                Email
              </th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">
                Alamat
              </th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="h-12 w-12 text-slate-300" />
                    <p className="text-slate-500 font-bold text-sm">
                      {searchQuery
                        ? "Tidak ada supplier yang cocok dengan pencarian"
                        : "Belum ada data supplier"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-6 font-bold text-slate-900 text-[11px] uppercase tracking-widest">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">
                    {supplier.contact || "-"}
                  </td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">
                    {supplier.phone || "-"}
                  </td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">
                    {supplier.email || "-"}
                  </td>
                  <td className="px-6 py-6 text-slate-600 font-bold text-[11px]">
                    {supplier.address || "-"}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => startEdit(supplier)}
                        className="p-2 rounded-xl bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all border border-slate-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding/editing suppliers */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8">
            <h3 className="text-xl font-heading font-extrabold text-slate-900 tracking-tighter uppercase mb-6">
              {editingId ? "Edit Supplier" : "Tambah Supplier"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Nama Supplier *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Kontak
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Telepon
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Alamat
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
                    rows={3}
                  />
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
                  {editingId ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
