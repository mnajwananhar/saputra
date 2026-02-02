const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

// HANYA Sep 2024 - Des 2025 (lanjutan dari yang gagal)
const generateRemainingPeriods = () => {
  const periods = [];
  // Sep 2024 - Dec 2024 (4 bulan)
  for (let i = 8; i < 12; i++) {
    periods.push({ month: months[i], year: 2024, monthNum: i });
  }
  // Jan 2025 - Dec 2025 (12 bulan)
  for (let i = 0; i < 12; i++) {
    periods.push({ month: months[i], year: 2025, monthNum: i });
  }
  return periods;
};

async function main() {
  console.log('--- Melanjutkan Seed Transaksi (Sep 2024 - Des 2025) ---');

  // Ambil semua produk yang sudah ada
  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true, safetyStock: true }
  });

  if (products.length === 0) {
    console.log('ERROR: Tidak ada produk di database!');
    return;
  }

  console.log(`Found ${products.length} products`);

  const periods = generateRemainingPeriods();

  for (const period of periods) {
    let transactionCount = 0;

    // Setiap produk harus ada transaksi
    for (const product of products) {
      const baseDemand = product.safetyStock * 5;
      const seasonalBoost = period.month === 'Apr' || period.month === 'Des' ? 1.3 : 1.0;

      // 1-2 transaksi per produk per bulan
      const numTransactions = Math.floor(Math.random() * 2) + 1;

      for (let t = 0; t < numTransactions; t++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const hour = Math.floor(Math.random() * 12) + 8;
        const minute = Math.floor(Math.random() * 60);

        const transactionDate = new Date(period.year, period.monthNum, day, hour, minute);
        const transactionId = `trx${period.year}${period.monthNum}${t}_${product.id.substring(0, 8)}`;

        const maxQty = Math.max(Math.ceil((baseDemand * seasonalBoost) / 10), 2);
        const quantity = Math.floor(Math.random() * maxQty) + 1;
        const subtotal = quantity * product.price;

        try {
          await prisma.transaction.create({
            data: {
              id: transactionId,
              date: transactionDate,
              totalAmount: subtotal,
              note: `${product.name.substring(0, 20)} - ${period.month} ${period.year}`,
              items: {
                create: {
                  id: `ti${transactionId}`,
                  productId: product.id,
                  quantity,
                  price: product.price,
                  subtotal
                }
              }
            }
          });
          transactionCount++;
        } catch (e) {
          // Skip jika duplicate
        }
      }
    }

    console.log(`  - ${period.month} ${period.year}: ${transactionCount} transaksi`);
  }

  console.log('--- Seed Lanjutan Selesai ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
