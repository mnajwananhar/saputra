import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, Trash2, Edit2, Save, X } from 'lucide-react';
import bcrypt from 'bcryptjs';

interface Employee {
  id: string;
  username: string;
  name: string;
  role: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    role: 'employee'
  });

  const [editData, setEditData] = useState({
    name: '',
    password: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('User')
      .select('id, username, name, role')
      .order('name');
    
    if (!error && data) {
      setEmployees(data);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const id = 'u' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    
    const { error } = await supabase
      .from('User')
      .insert({
        id,
        username: formData.username,
        name: formData.name,
        password: hashedPassword,
        role: formData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    
    if (!error) {
      setFormData({ username: '', name: '', password: '', role: 'employee' });
      setShowAddForm(false);
      fetchEmployees();
    } else {
      alert('Gagal menambah karyawan: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus karyawan ini?')) return;
    
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', id);
    
    if (!error) {
      fetchEmployees();
    }
  };

  const startEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEditData({ name: emp.name, password: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', password: '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    const updates: any = {
      name: editData.name,
      updatedAt: new Date().toISOString()
    };
    
    // Only update password if provided
    if (editData.password) {
      updates.password = await bcrypt.hash(editData.password, 10);
    }
    
    const { error } = await supabase
      .from('User')
      .update(updates)
      .eq('id', editingId);
    
    if (!error) {
      cancelEdit();
      fetchEmployees();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none uppercase">Karyawan</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Kelola akun karyawan</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          Tambah Karyawan
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="font-heading font-extrabold text-slate-900 text-xl tracking-tighter uppercase mb-6">Tambah Karyawan Baru</h3>
          <form onSubmit={handleAdd} className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                placeholder="Nama Lengkap"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                placeholder="••••••"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee List */}
      <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400">
            <tr>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">Username</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">Nama</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest">Role</th>
              <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400">Loading...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400">Belum ada karyawan</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-5 font-bold text-slate-900 text-[11px] uppercase tracking-widest">{emp.username}</td>
                  <td className="px-6 py-5">
                    {editingId === emp.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="px-3 py-2 border-2 border-indigo-200 rounded-lg text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                    ) : (
                      <span className="text-slate-600 text-[11px] font-bold">{emp.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      emp.role === 'owner' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {emp.role === 'owner' ? 'Pemilik' : 'Karyawan'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      {editingId === emp.id ? (
                        <>
                          <button onClick={saveEdit} className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all border border-green-200">
                            <Save className="h-4 w-4" />
                          </button>
                          <button onClick={cancelEdit} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all border border-slate-200">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(emp)} className="p-2 rounded-xl bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all border border-slate-200">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {emp.role !== 'owner' && (
                            <button onClick={() => handleDelete(emp.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-200">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
