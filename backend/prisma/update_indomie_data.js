const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PRODUCT_NAME = "Indomie Goreng 85 gr";

const MONTHLY_DEMANDS = [
  { month: 0, year: 2024, demand: 66 },   // Jan 2024
  { month: 1, year: 2024, demand: 70 },   // Feb 2024
  { month: 2, year: 2024, demand: 65 },   // Mar 2024
  { month: 3, year: 2024, demand: 72 },   // Apr 2024
  { month: 4, year: 2024, demand: 60 },   // Mei 2024
  { month: 5, year: 2024, demand: 68 },   // Jun 2024
  { month: 6, year: 2024, demand: 64 },   // Jul 2024
  { month: 7, year: 2024, demand: 70 },   // Agt 2024
  { month: 8, year: 2024, demand: 62 },   // Sep 2024
  { month: 9, year: 2024, demand: 71 },   // Okt 2024
  { month: 10, year: 2024, demand: 68 },  // Nov 2024
  { month: 11, year: 2024, demand: 74 },  // Des 2024
  { month: 0, year: 2025, demand: 68 },   // Jan 2025
  { month: 1, year: 2025, demand: 72 },   // Feb 2025
  { month: 2, year: 2025, demand: 64 },   // Mar 2025
  { month: 3, year: 2025, demand: 69 },   // Apr 2025
  { month: 4, year: 2025, demand: 62 },   // Mei 2025
  { month: 5, year: 2025, demand: 67 },   // Jun 2025
  { month: 6, year: 2025, demand: 66 },   // Jul 2025
  { month: 7, year: 2025, demand: 70 },   // Agt 2025
  { month: 8, year: 2025, demand: 63 },   // Sep 2025
  { month: 9, year: 2025, demand: 71 },   // Okt 2025
  { month: 10, year: 2025, demand: 69 },  // Nov 2025
  { month: 11, year: 2025, demand: 74 },  // Des 2025
  { month: 0, year: 2026, demand: 70 },   // Jan 2026
];

const generateRandomDaysInMonth = (totalDemand) => {
  const transactions = [];
  let remaining = totalDemand;

  while (remaining > 0) {
    const qty = Math.min(remaining, Math.floor(Math.random() * 5) + 1);
    transactions.push(qty);
    remaining -= qty;
  }

  return transactions;
};

const generateTransactionsForMonth = (
  productId,
  productPrice,
  month,
  year,
  demand,
) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyQuantities = generateRandomDaysInMonth(demand);
  const transactions = [];

  dailyQuantities.forEach((quantity, index) => {
    const day = (index % daysInMonth) + 1;
    const hour = Math.floor(Math.random() * 12) + 8;
    const minute = Math.floor(Math.random() * 60);

    const transactionDate = new Date(year, month, day, hour, minute, 0);
    const subtotal = quantity * productPrice;

    transactions.push({
      date: transactionDate,
      items: [
        {
          productId,
          quantity,
          price: productPrice,
          subtotal,
        },
      ],
    });
  });

  return transactions;
};

async function updateIndomieData() {
  console.log(`🔍 Mencari produk: ${PRODUCT_NAME}...`);

  const product = await prisma.product.findFirst({
    where: { name: PRODUCT_NAME },
  });

  if (!product) {
    console.error(`❌ Produk "${PRODUCT_NAME}" tidak ditemukan!`);
    return;
  }

  console.log(`✅ Produk ditemukan: ${product.name} (ID: ${product.id})`);
  console.log(`💰 Harga: Rp ${product.price.toLocaleString("id-ID")}`);

  console.log(`\n🗑️  Menghapus transaksi lama untuk produk ini...`);

  const existingTransactions = await prisma.transaction.findMany({
    where: {
      items: {
        some: {
          productId: product.id,
        },
      },
    },
    include: {
      items: true,
    },
  });

  for (const transaction of existingTransactions) {
    await prisma.transactionItem.deleteMany({
      where: { transactionId: transaction.id },
    });
    await prisma.transaction.delete({
      where: { id: transaction.id },
    });
  }

  console.log(`✅ ${existingTransactions.length} transaksi lama dihapus`);

  console.log(`\n📝 Membuat transaksi baru berdasarkan data demand...`);

  let totalTransactions = 0;

  for (const { month, year, demand } of MONTHLY_DEMANDS) {
    const monthTransactions = generateTransactionsForMonth(
      product.id,
      product.price,
      month,
      year,
      demand,
    );

    for (const transactionData of monthTransactions) {
      const totalAmount = transactionData.items.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );

      await prisma.transaction.create({
        data: {
          date: transactionData.date,
          totalAmount,
          items: {
            create: transactionData.items,
          },
        },
      });

      totalTransactions++;
    }

    const monthName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agt",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ][month];
    console.log(
      `  ✓ ${monthName} ${year}: ${demand} unit (${monthTransactions.length} transaksi)`,
    );
  }

  console.log(`\n✅ Selesai! Total ${totalTransactions} transaksi dibuat`);

  const totalDemand = MONTHLY_DEMANDS.reduce((sum, m) => sum + m.demand, 0);
  console.log(`📊 Total demand Jan 2024 - Jan 2026: ${totalDemand} unit`);
}

async function main() {
  try {
    await updateIndomieData();
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
