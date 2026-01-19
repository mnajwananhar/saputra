const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
const years = [2024, 2025];

/**
 * DATA DIAMBIL DARI HALAMAN 37 PDF (DATA PERMINTAAN)
 */
const DATA_INDOMIE = [
  66, 70, 65, 72, 60, 68, 64, 70, 62, 71, 68, 74, // 2024
  68, 72, 64, 69, 62, 67, 66, 70, 63, 71, 69, 74  // 2025
];

const DATA_KAPAL_API = [
  130, 118, 115, 95, 115, 102, 105, 110, 94, 118, 125, 120, // 2024
  120, 118, 115, 118, 116, 118, 119, 120, 118, 120, 125, 118  // 2025
];

const DATA_SAMPOERNA = [
  57, 52, 50, 55, 48, 54, 50, 56, 50, 48, 56, 58, // 2024
  52, 55, 50, 52, 48, 53, 50, 56, 50, 49, 56, 58  // 2025
];

async function main() {
  console.log('🚀 Memulai Seeding Database Saputra Jaya...\n');
  
  // 1. Hapus data lama
  await prisma.historicalData.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✓ Data lama dihapus');
  
  // 2. Buat Admin dengan password ter-hash
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator Saputra'
    }
  });
  console.log('✓ User admin dibuat (admin / admin123)');

  // 3. Data Produk dari PDF
  const productsToSeed = [
    { 
      name: 'Indomie Goreng', 
      unit: 'Dus', 
      current: 45, 
      safety: 8, 
      bestN: 4, 
      history: DATA_INDOMIE 
    },
    { 
      name: 'Kapal Api', 
      unit: 'Dus', 
      current: 12, 
      safety: 8, 
      bestN: 4, 
      history: DATA_KAPAL_API 
    },
    { 
      name: 'Sampoerna', 
      unit: 'Bal', 
      current: 5, 
      safety: 8, 
      bestN: 8, 
      history: DATA_SAMPOERNA 
    }
  ];

  for (const p of productsToSeed) {
    console.log(`  → Menambahkan produk: ${p.name}`);
    
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        unit: p.unit,
        currentStock: p.current,
        safetyStock: p.safety,
        bestN: p.bestN,
        userId: adminUser.id
      }
    });

    const historicalEntries = [];
    let dataIdx = 0;

    for (const year of years) {
      for (const month of months) {
        historicalEntries.push({
          productId: createdProduct.id,
          month,
          year,
          day: 1,
          demand: p.history[dataIdx],
          periodLabel: `${month}-${year.toString().slice(-2)}`
        });
        dataIdx++;
      }
    }

    await prisma.historicalData.createMany({
      data: historicalEntries
    });
  }

  console.log(`\n✅ Seeding selesai! ${productsToSeed.length} produk dengan 24 bulan data historis.`);
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
