# Wireframes - Saputra Jaya SMA Forecaster

## Struktur Folder

### `/shared`
Wireframes untuk halaman yang bisa diakses oleh Admin dan Karyawan
- **Login** - Halaman login sistem
- **POS** - Point of Sale untuk transaksi penjualan

### `/admin`
Wireframes khusus untuk role Admin (akses penuh)
- **Dashboard** - Dashboard statistik lengkap dengan grafik penjualan, top products, revenue
- **Rencana Beli** - Purchase planning dengan SMA forecasting, safety stock, pagination
- **Produk** - Manajemen produk dengan CRUD operations, pagination, search
- **Data Historis** - Historical sales data dengan search produk, export CSV
- **Suppliers** - Manajemen supplier dengan CRUD operations
- **Employees** - Manajemen karyawan dengan role management
- **Rules** - Rules configuration untuk forecasting (N periods, safety stock, etc)

### `/karyawan`
Wireframes khusus untuk role Karyawan (akses terbatas)
- **Dashboard** - Dashboard sederhana dengan statistik dasar penjualan
- **Data Historis** - View-only historical sales data dengan search

## Role-Based Access Control

| Halaman | Admin | Karyawan |
|---------|-------|----------|
| Login | ✅ | ✅ |
| Dashboard | ✅ Full | ✅ Simplified |
| POS | ✅ | ✅ |
| Rencana Beli | ✅ | ❌ |
| Produk | ✅ | ❌ |
| Data Historis | ✅ | ✅ View-only |
| Suppliers | ✅ | ❌ |
| Employees | ✅ | ❌ |
| Rules | ✅ | ❌ |

## Catatan Update
- Wireframes disesuaikan dengan implementasi UI terbaru (Feb 2026)
- Pagination controls ditambahkan di semua tabel data
- Search functionality tersedia di semua data listing
- Modern design dengan rounded corners, gradients, dan microinteractions
