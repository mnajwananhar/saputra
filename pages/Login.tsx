import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Username atau password salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      <div className="hidden lg:flex lg:w-[55%] relative bg-[#0F172A] flex-col justify-center p-24 text-white overflow-hidden border-r border-slate-800">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-heading font-extrabold leading-[1.1] tracking-tighter mb-8">
            Sistem Peramalan <br />
            Persediaan Barang
          </h1>
          <div className="h-1.5 w-12 bg-indigo-600 mb-6"></div>
          <p className="text-slate-400 text-2xl font-medium tracking-tight">
            Toko Saputra Jaya
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white lg:bg-transparent">
        <div className="w-full max-w-[340px]">
          <div className="mb-10">
            <h2 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tight">Login</h2>
            <p className="text-slate-400 mt-2 text-sm font-medium tracking-tight">Masukkan akses akun Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-5 py-3 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-slate-400 transition-all bg-white"
                placeholder="Username"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-3 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-slate-400 transition-all bg-white"
                placeholder="Password"
              />
            </div>

            {error && (
              <div className="text-[11px] text-red-600 font-bold px-1">
                * {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-bold text-white bg-[#0F172A] hover:bg-black transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Menghubungkan...' : 'Masuk'}
            </button>
          </form>
          
          <div className="mt-20">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.25em]">© Saputra Jaya</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
