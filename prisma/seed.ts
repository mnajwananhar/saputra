import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
const years = [2024, 2025];

// Helper untuk generate angka random di kisaran tertentu
const getRandomDemand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

async function main() {
  console.log('--- Memulai Seeding Data Saputra Jaya ---');

  // 1. Buat User Admin Default
  // Password di bawah adalah 'admin123' (Gunakan bcrypt di server asli untuk hashing)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123', // Di backend asli, ini harus di-hash
      name: 'Administrator Saputra'
    }
  });

  const productList = [
    { name: 'Minyak Bimoli 2L', unit: 'Pcs', baseDemand: 60, current: 45, safety: 15 },
    { name: 'Beras Rojolele 5kg', unit: 'Karung', baseDemand: 30, current: 10, safety: 12 },
    { name: 'Indomie Goreng', unit: 'Dus', baseDemand: 200, current: 250, safety: 50 },
    { name: 'Gula Gulaku 1kg', unit: 'Pcs', baseDemand: 80, current: 5, safety: 20 },
    { name: 'Terigu Segitiga Biru 1kg', unit: 'Pcs', baseDemand: 45, current: 50, safety: 10 },
    { name: 'Kopi Kapal Api 165gr', unit: 'Pouch', baseDemand: 25, current: 30, safety: 8 },
    { name: 'Susu Frisian Flag 370g', unit: 'Kaleng', baseDemand: 40, current: 15, safety: 12 },
    { name: 'Rinso Bubuk 800gr', unit: 'Pcs', baseDemand: 35, current: 40, safety: 10 }
  ];

  for (const p of productList) {
    console.log(`Menambahkan produk: ${p.name}`);
    
    // Buat Produk
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        unit: p.unit,
        currentStock: p.current,
        safetyStock: p.safety,
        bestN: [2, 4, 6, 8][Math.floor(Math.random() * 4)], // Randomly assign best N for SMA
      }
    });

    // Buat Data Historis (24 Bulan)
    const historicalEntries = [];
    for (const year of years) {
      for (const month of months) {
        // Beri sedikit variasi demand tiap bulan agar grafik SMA terlihat menarik
        const seasonalBoost = month === 'Apr' || month === 'Des' ? 1.3 : 1.0; // Anggap Lebaran/Natal permintaan naik
        const randomFluc = (Math.random() * 0.4) + 0.8; // 80% to 120%
        const demand = Math.round(p.baseDemand * seasonalBoost * randomFluc);

        historicalEntries.push({
          productId: createdProduct.id,
          month,
          year,
          demand,
          periodLabel: `${month}-${year.toString().slice(-2)}`
        });
      }
    }

    await prisma.historicalData.createMany({
      data: historicalEntries
    });
  }

  console.log('--- Seeding Selesai ---');
}

main()
  .catch((e) => {
    console.error(e);
    // Fix: Re-throw the error instead of calling process.exit(1) to satisfy TypeScript type constraints for 'Process'
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });