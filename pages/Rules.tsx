import React from 'react';
import { Clock, AlertOctagon, RotateCcw, Archive } from 'lucide-react';

const Rules: React.FC = () => {
  const rules = [
    {
       title: "Barang Kedaluwarsa",
       icon: Clock,
       color: "text-red-600",
       bg: "bg-red-50",
       desc: "Barang yang melewati tanggal expired harus segera dipisahkan dari stok jual. Dilarang keras memajang atau menjual barang kedaluwarsa kepada konsumen."
    },
    {
       title: "Barang Rusak / Tidak Sesuai",
       icon: AlertOctagon,
       color: "text-amber-600",
       bg: "bg-amber-50",
       desc: "Penerimaan barang harus dicek kesesuaian jenis dan kondisinya. Jika rusak atau tidak sesuai order, wajib diretur ke supplier untuk diganti sesuai perjanjian."
    },
    {
       title: "Logika Restock",
       icon: RotateCcw,
       color: "text-blue-600",
       bg: "bg-blue-50",
       desc: "Pemesanan kembali dilakukan saat stok dirasa kurang untuk penjualan periode berikutnya. Keputusan order didasarkan pada cek fisik dan hasil peramalan sistem."
    },
    {
       title: "Jadwal Pemesanan",
       icon: Archive,
       color: "text-indigo-600",
       bg: "bg-indigo-50",
       desc: "Pemesanan ke supplier dilakukan secara rutin, baik mingguan atau per 3 hari, untuk menjaga ketersediaan dan kelancaran operasional toko."
    }
  ];

  return (
    <div className="space-y-8">
       <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-slate-900">Aturan Bisnis & SOP</h1>
          <p className="mt-2 text-slate-500">Pedoman operasional manajemen stok Toko Sembako Saputra Jaya.</p>
       </div>

       <div className="grid gap-6 md:grid-cols-2">
          {rules.map((rule, idx) => (
             <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex rounded-lg p-3 ${rule.bg}`}>
                   <rule.icon className={`h-6 w-6 ${rule.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{rule.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{rule.desc}</p>
             </div>
          ))}
       </div>

       <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-6">
          <h3 className="text-lg font-bold text-indigo-900">Ambang Batas Minimum Stok (Safety Stock)</h3>
          <p className="mt-2 text-indigo-800">
             Stok minimum di gudang ditetapkan sebanyak <span className="font-bold">8 dus/bal</span> untuk setiap jenis produk utama. 
             Jika stok gudang mendekati atau di bawah angka ini, pemilik wajib melakukan pemesanan (reorder) pada siklus berikutnya.
          </p>
       </div>
    </div>
  );
};

export default Rules;