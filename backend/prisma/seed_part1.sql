-- =====================================================
-- SEED DATA SAPUTRA JAYA - Run di Supabase SQL Editor
-- =====================================================

-- 1. HAPUS DATA LAMA
TRUNCATE "TransactionItem", "Transaction", "HistoricalData", "StockIn", "Product", "Supplier", "User" CASCADE;

-- 2. INSERT USER ADMIN
-- Password: admin12masa3 (bcrypt hash)
INSERT INTO "User" (id, username, password, name, role, "createdAt", "updatedAt") VALUES
('admin001', 'admin', '$2a$10$rQnM1rQKz8mH5V7z5K5X5O5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5', 'Administrator Saputra', 'owner', NOW(), NOW()),
('emp001', 'karyawan', '$2a$10$rQnM1rQKz8mH5V7z5K5X5O5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5', 'Karyawan Toko', 'employee', NOW(), NOW());

-- 3. INSERT SUPPLIERS
INSERT INTO "Supplier" (id, name, contact, address, phone, email, "createdAt", "updatedAt") VALUES
('sup001', 'CV Hana Centea', 'Bpk. Hana', 'Bandung, Jawa Barat', '022-7301234', 'hana.centea@gmail.com', NOW(), NOW()),
('sup002', 'PT Mayora Indah Tbk', 'Ibu Sari', 'Tangerang, Banten', '021-5401234', 'sales@mayora.co.id', NOW(), NOW()),
('sup003', 'PT Indofood CBP Sukses Makmur Tbk', 'Bpk. Andi', 'Jakarta Selatan, DKI Jakarta', '021-78001234', 'corporate@indofood.co.id', NOW(), NOW()),
('sup004', 'PT Mitra Priangan', 'Ibu Dewi', 'Bandung, Jawa Barat', '022-7205678', 'mitra.priangan@gmail.com', NOW(), NOW()),
('sup005', 'PT Makmur Mandiri Pratama', 'Bpk. Joko', 'Bandung, Jawa Barat', '022-7309876', 'makmur.mandiri@yahoo.com', NOW(), NOW()),
('sup006', 'PT Sayap Mas Utama', 'Bpk. Rudi', 'Surabaya, Jawa Timur', '031-8401234', 'sayapmas@wings.co.id', NOW(), NOW()),
('sup007', 'PT Unilever Indonesia Tbk', 'Ibu Maya', 'Tangerang, Banten', '021-5261234', 'customer.care@unilever.com', NOW(), NOW()),
('sup008', 'PT Wings Group', 'Bpk. Herman', 'Jakarta Barat, DKI Jakarta', '021-5601234', 'info@wings.co.id', NOW(), NOW()),
('sup009', 'PT Heinz ABC Indonesia', 'Ibu Rina', 'Jakarta Timur, DKI Jakarta', '021-8401234', 'abc.indonesia@kraftheinz.com', NOW(), NOW()),
('sup010', 'PT Multi Indomandiri', 'Bpk. Agus', 'Bandung, Jawa Barat', '022-7501234', 'multi.indomandiri@gmail.com', NOW(), NOW()),
('sup011', 'PT Gudang Garam Tbk', 'Bpk. Wahyu', 'Kediri, Jawa Timur', '0354-681234', 'sales@gudanggaram.com', NOW(), NOW()),
('sup012', 'PT HM Sampoerna Tbk', 'Ibu Mega', 'Surabaya, Jawa Timur', '031-8431234', 'corporate@sampoerna.com', NOW(), NOW()),
('sup013', 'PT Djarum Kudus', 'Bpk. Gunawan', 'Kudus, Jawa Tengah', '0291-441234', 'sales@djarum.com', NOW(), NOW()),
('sup014', 'PT Ajinomoto Indonesia', 'Ibu Keiko', 'Jakarta Timur, DKI Jakarta', '021-8501234', 'info@ajinomoto.co.id', NOW(), NOW()),
('sup015', 'PT Konimex', 'Ibu Tutik', 'Sukoharjo, Jawa Tengah', '0271-591234', 'info@konimex.com', NOW(), NOW());

-- 4. INSERT PRODUCTS
INSERT INTO "Product" (id, name, unit, price, cost, "currentStock", "safetyStock", "bestN", "supplierId", "createdAt", "updatedAt") VALUES
-- Mie Instan
('prod001', 'Indomie Goreng 85 gr', 'Dus', 115000, 105000, 80, 24, 4, 'sup003', NOW(), NOW()),
('prod002', 'Indomie Soto 70 gr', 'Dus', 110000, 100000, 65, 18, 4, 'sup003', NOW(), NOW()),
('prod003', 'Indomie Ayam Bawang 72 gr', 'Dus', 110000, 100000, 80, 20, 4, 'sup003', NOW(), NOW()),
('prod004', 'Indomie Rendang 80 gr', 'Dus', 120000, 110000, 60, 14, 4, 'sup003', NOW(), NOW()),
('prod005', 'Indomie Kari Ayam 72 gr', 'Dus', 110000, 100000, 10, 12, 4, 'sup003', NOW(), NOW()),
('prod006', 'Pop Mie Ayam 75 gr', 'Dus', 145000, 135000, 10, 8, 4, 'sup003', NOW(), NOW()),
('prod007', 'Pop Mie Soto 75 gr', 'Dus', 145000, 135000, 10, 7, 4, 'sup003', NOW(), NOW()),
('prod008', 'Supermi Ayam 75 gr', 'Dus', 95000, 85000, 5, 5, 4, 'sup003', NOW(), NOW()),
('prod009', 'Supermi Soto 75 gr', 'Dus', 95000, 85000, 5, 4, 4, 'sup003', NOW(), NOW()),
('prod010', 'Sarimi Isi 2 Ayam 120 gr', 'Dus', 125000, 115000, 20, 6, 4, 'sup003', NOW(), NOW()),
('prod011', 'Mie Sedaap Goreng 90 gr', 'Dus', 118000, 108000, 50, 16, 4, 'sup008', NOW(), NOW()),
('prod012', 'Mie Sedaap Soto 75 gr', 'Dus', 115000, 105000, 50, 14, 4, 'sup008', NOW(), NOW()),
-- Makanan & Minuman
('prod013', 'Kopi Torabika Sachet 25 gr', 'Dus', 85000, 75000, 12, 10, 4, 'sup002', NOW(), NOW()),
('prod014', 'Kopi Good Day Cappuccino 25 gr', 'Dus', 95000, 85000, 29, 12, 4, 'sup002', NOW(), NOW()),
('prod015', 'Roma Marie Gold 120 gr', 'Dus', 72000, 65000, 7, 5, 4, 'sup002', NOW(), NOW()),
('prod016', 'Roma Kelapa 300 gr', 'Dus', 85000, 78000, 14, 6, 4, 'sup002', NOW(), NOW()),
('prod017', 'Beng-Beng Cokelat 20 gr', 'Dus', 125000, 115000, 6, 8, 4, 'sup002', NOW(), NOW()),
('prod018', 'Energen Cokelat 30 gr', 'Dus', 95000, 88000, 40, 11, 4, 'sup002', NOW(), NOW()),
('prod019', 'Energen Kacang Hijau 30 gr', 'Dus', 95000, 88000, 23, 8, 4, 'sup002', NOW(), NOW()),
('prod020', 'Slai Olai Blueberry 120 gr', 'Dus', 78000, 70000, 10, 4, 4, 'sup002', NOW(), NOW()),
('prod021', 'Better Wafer Chocolate 30 gr', 'Dus', 65000, 58000, 10, 5, 4, 'sup002', NOW(), NOW()),
('prod022', 'Astor Wafer Cokelat 40 gr', 'Dus', 88000, 80000, 4, 4, 4, 'sup002', NOW(), NOW()),
('prod023', 'Top Coffee Gula Aren 25 gr', 'Dus', 92000, 84000, 13, 7, 4, 'sup002', NOW(), NOW()),
('prod024', 'Floridina Orange 360 ml', 'Dus', 78000, 70000, 13, 6, 4, 'sup002', NOW(), NOW()),
-- Kebutuhan Rumah Tangga
('prod025', 'Rinso Bubuk 800 gr', 'Dus', 185000, 170000, 30, 9, 4, 'sup007', NOW(), NOW()),
('prod026', 'Rinso Cair 900 ml', 'Dus', 195000, 180000, 30, 8, 4, 'sup007', NOW(), NOW()),
('prod027', 'Molto Pewangi 700 ml', 'Dus', 165000, 150000, 30, 7, 4, 'sup007', NOW(), NOW()),
('prod028', 'Sunlight Lemon 800 ml', 'Dus', 145000, 132000, 14, 10, 4, 'sup007', NOW(), NOW()),
('prod029', 'Lifebuoy Sabun 85 gr', 'Dus', 95000, 85000, 14, 8, 4, 'sup007', NOW(), NOW()),
('prod030', 'Pepsodent Herbal 190 gr', 'Dus', 125000, 115000, 15, 7, 4, 'sup007', NOW(), NOW()),
('prod031', 'Clear Shampoo 170 ml', 'Dus', 185000, 170000, 13, 6, 4, 'sup007', NOW(), NOW()),
('prod032', 'Sunsilk Black 170 ml', 'Dus', 175000, 160000, 13, 6, 4, 'sup007', NOW(), NOW()),
('prod033', 'Rexona Roll On 40 ml', 'Pcs', 18000, 15000, 20, 5, 4, 'sup007', NOW(), NOW()),
('prod034', 'Dove Sabun 90 gr', 'Dus', 145000, 132000, 4, 4, 4, 'sup007', NOW(), NOW()),
('prod035', 'So Klin Bubuk 800 gr', 'Dus', 165000, 150000, 30, 8, 4, 'sup008', NOW(), NOW()),
('prod036', 'Daia Bubuk 900 gr', 'Dus', 155000, 142000, 30, 8, 4, 'sup008', NOW(), NOW()),
('prod037', 'Attack Easy 900 gr', 'Dus', 175000, 160000, 30, 7, 4, 'sup006', NOW(), NOW()),
('prod038', 'Emeron Shampoo 170 ml', 'Dus', 125000, 115000, 6, 4, 4, 'sup008', NOW(), NOW()),
('prod039', 'Ciptadent Pasta Gigi 190 gr', 'Dus', 85000, 75000, 9, 5, 4, 'sup008', NOW(), NOW()),
('prod040', 'Giv Sabun 80 gr', 'Dus', 78000, 70000, 11, 5, 4, 'sup008', NOW(), NOW()),
-- Obat & Suplemen
('prod041', 'Mixagrip Flu', 'Box', 45000, 38000, 7, 3, 4, 'sup015', NOW(), NOW()),
('prod042', 'Mixagrip Flu & Batuk', 'Box', 48000, 40000, 7, 3, 4, 'sup015', NOW(), NOW()),
('prod043', 'Promag Tablet', 'Box', 55000, 48000, 7, 4, 4, 'sup015', NOW(), NOW()),
('prod044', 'OBH Combi Dewasa', 'Box', 65000, 55000, 7, 3, 4, 'sup015', NOW(), NOW()),
('prod045', 'OBH Combi Anak', 'Box', 62000, 52000, 12, 4, 4, 'sup015', NOW(), NOW()),
-- Sembako
('prod046', 'Minyak Goreng 1 Liter', 'Dus', 185000, 172000, 10, 12, 4, 'sup001', NOW(), NOW()),
('prod047', 'Minyak Goreng 2 Liter', 'Dus', 365000, 340000, 10, 9, 4, 'sup001', NOW(), NOW()),
('prod048', 'Gula Pasir 1 Kg', 'Pcs', 18000, 16000, 20, 16, 4, 'sup001', NOW(), NOW()),
('prod049', 'Tepung Terigu 250 gr', 'Pcs', 6500, 5500, 120, 20, 4, 'sup001', NOW(), NOW()),
('prod050', 'Garam Dapur 500 gr', 'Pcs', 5000, 4000, 50, 12, 4, 'sup001', NOW(), NOW()),
('prod051', 'Telur Ayam Negeri 250 gr', 'Pcs', 8500, 7500, 40, 18, 4, 'sup001', NOW(), NOW()),
('prod052', 'Mi Telur 200 gr', 'Pcs', 7500, 6500, 5, 4, 4, 'sup001', NOW(), NOW()),
('prod053', 'Bihunku 200 gr', 'Pcs', 8000, 7000, 5, 4, 4, 'sup001', NOW(), NOW()),
-- Bumbu
('prod054', 'Ajinomoto MSG 1 kg', 'Dus', 245000, 228000, 5, 5, 4, 'sup014', NOW(), NOW()),
('prod055', 'Ajinomoto MSG 250 gr', 'Dus', 125000, 115000, 5, 7, 4, 'sup014', NOW(), NOW()),
('prod056', 'Masako Ayam 11 gr', 'Dus', 95000, 85000, 10, 10, 4, 'sup014', NOW(), NOW()),
('prod057', 'Masako Sapi 11 gr', 'Dus', 95000, 85000, 10, 8, 4, 'sup014', NOW(), NOW()),
('prod058', 'Sajiku Tepung Serbaguna 80 gr', 'Dus', 72000, 65000, 5, 6, 4, 'sup014', NOW(), NOW()),
('prod059', 'Sajiku Bumbu Nasi Goreng 20 gr', 'Dus', 68000, 60000, 5, 7, 4, 'sup014', NOW(), NOW()),
('prod060', 'Saori Saus Tiram 135 ml', 'Dus', 85000, 76000, 5, 5, 4, 'sup014', NOW(), NOW()),
('prod061', 'Mayumi Mayonnaise 100 gr', 'Dus', 78000, 70000, 5, 4, 4, 'sup014', NOW(), NOW()),
('prod062', 'Masako Refill 500 gr', 'Dus', 145000, 132000, 1, 3, 4, 'sup014', NOW(), NOW()),
('prod063', 'Ajinomoto Refill 500 gr', 'Dus', 155000, 142000, 1, 3, 4, 'sup014', NOW(), NOW()),
-- Rokok
('prod064', 'Gudang Garam Surya 16', 'Slop', 285000, 265000, 2, 6, 4, 'sup011', NOW(), NOW()),
('prod065', 'Gudang Garam Filter 12', 'Slop', 245000, 228000, 10, 9, 4, 'sup011', NOW(), NOW()),
('prod066', 'Gudang Garam International', 'Slop', 295000, 275000, 8, 7, 4, 'sup011', NOW(), NOW()),
('prod067', 'Gudang Garam Signature', 'Slop', 315000, 295000, 5, 5, 4, 'sup011', NOW(), NOW()),
('prod068', 'Gudang Garam Merah', 'Slop', 195000, 180000, 4, 6, 4, 'sup011', NOW(), NOW()),
('prod069', 'Sampoerna A Mild 16', 'Slop', 325000, 305000, 10, 11, 4, 'sup012', NOW(), NOW()),
('prod070', 'Sampoerna A Mild 12', 'Slop', 265000, 248000, 3, 8, 4, 'sup012', NOW(), NOW()),
('prod071', 'Sampoerna Kretek', 'Slop', 215000, 198000, 15, 10, 4, 'sup012', NOW(), NOW()),
('prod072', 'Sampoerna U Mild', 'Slop', 245000, 228000, 1, 4, 4, 'sup012', NOW(), NOW()),
('prod073', 'Sampoerna Hijau', 'Slop', 185000, 170000, 5, 6, 4, 'sup012', NOW(), NOW()),
('prod074', 'Djarum Super 12', 'Slop', 255000, 238000, 15, 9, 4, 'sup013', NOW(), NOW()),
('prod075', 'Djarum Super 16', 'Slop', 295000, 275000, 5, 7, 4, 'sup013', NOW(), NOW()),
('prod076', 'Djarum Black', 'Slop', 285000, 265000, 1, 5, 4, 'sup013', NOW(), NOW()),
('prod077', 'Djarum Coklat', 'Slop', 195000, 180000, 40, 12, 4, 'sup013', NOW(), NOW()),
('prod078', 'Djarum 76', 'Slop', 175000, 162000, 5, 8, 4, 'sup013', NOW(), NOW());

-- 5. DISABLE RLS
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Supplier" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "TransactionItem" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "StockIn" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "HistoricalData" DISABLE ROW LEVEL SECURITY;

-- 6. GRANT ACCESS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
