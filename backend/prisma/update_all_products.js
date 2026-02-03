const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ============================================
// DATA CONFIGURATION
// ============================================

const KAPAL_API_DATA = {
  product: {
    name: "Kopi Kapal Api 23 gr",
    unit: "Dus",
    price: 200000,
    cost: 185000,
    currentStock: 15,
    safetyStock: 20,
    bestN: 4,
  },
  supplier: "Santos Jaya",
  demands: [
    { month: 0, year: 2024, demand: 130 },
    { month: 1, year: 2024, demand: 118 },
    { month: 2, year: 2024, demand: 115 },
    { month: 3, year: 2024, demand: 95 },
    { month: 4, year: 2024, demand: 115 },
    { month: 5, year: 2024, demand: 102 },
    { month: 6, year: 2024, demand: 105 },
    { month: 7, year: 2024, demand: 110 },
    { month: 8, year: 2024, demand: 94 },
    { month: 9, year: 2024, demand: 118 },
    { month: 10, year: 2024, demand: 125 },
    { month: 11, year: 2024, demand: 120 },
    { month: 0, year: 2025, demand: 120 },
    { month: 1, year: 2025, demand: 118 },
    { month: 2, year: 2025, demand: 115 },
    { month: 3, year: 2025, demand: 118 },
    { month: 4, year: 2025, demand: 116 },
    { month: 5, year: 2025, demand: 118 },
    { month: 6, year: 2025, demand: 119 },
    { month: 7, year: 2025, demand: 120 },
    { month: 8, year: 2025, demand: 118 },
    { month: 9, year: 2025, demand: 120 },
    { month: 10, year: 2025, demand: 125 },
    { month: 11, year: 2025, demand: 118 },
    { month: 0, year: 2026, demand: 120 },
  ],
};

const INDOMIE_DEMANDS = [
  { month: 0, year: 2024, demand: 66 },
  { month: 1, year: 2024, demand: 70 },
  { month: 2, year: 2024, demand: 65 },
  { month: 3, year: 2024, demand: 72 },
  { month: 4, year: 2024, demand: 60 },
  { month: 5, year: 2024, demand: 68 },
  { month: 6, year: 2024, demand: 64 },
  { month: 7, year: 2024, demand: 70 },
  { month: 8, year: 2024, demand: 62 },
  { month: 9, year: 2024, demand: 71 },
  { month: 10, year: 2024, demand: 68 },
  { month: 11, year: 2024, demand: 74 },
  { month: 0, year: 2025, demand: 68 },
  { month: 1, year: 2025, demand: 72 },
  { month: 2, year: 2025, demand: 64 },
  { month: 3, year: 2025, demand: 69 },
  { month: 4, year: 2025, demand: 62 },
  { month: 5, year: 2025, demand: 67 },
  { month: 6, year: 2025, demand: 66 },
  { month: 7, year: 2025, demand: 70 },
  { month: 8, year: 2025, demand: 63 },
  { month: 9, year: 2025, demand: 71 },
  { month: 10, year: 2025, demand: 69 },
  { month: 11, year: 2025, demand: 74 },
  { month: 0, year: 2026, demand: 70 },
];

const SAMPOERNA_DEMANDS = [
  { month: 0, year: 2024, demand: 57 },
  { month: 1, year: 2024, demand: 52 },
  { month: 2, year: 2024, demand: 50 },
  { month: 3, year: 2024, demand: 55 },
  { month: 4, year: 2024, demand: 48 },
  { month: 5, year: 2024, demand: 54 },
  { month: 6, year: 2024, demand: 50 },
  { month: 7, year: 2024, demand: 56 },
  { month: 8, year: 2024, demand: 50 },
  { month: 9, year: 2024, demand: 48 },
  { month: 10, year: 2024, demand: 56 },
  { month: 11, year: 2024, demand: 58 },
  { month: 0, year: 2025, demand: 52 },
  { month: 1, year: 2025, demand: 55 },
  { month: 2, year: 2025, demand: 50 },
  { month: 3, year: 2025, demand: 52 },
  { month: 4, year: 2025, demand: 48 },
  { month: 5, year: 2025, demand: 53 },
  { month: 6, year: 2025, demand: 50 },
  { month: 7, year: 2025, demand: 56 },
  { month: 8, year: 2025, demand: 50 },
  { month: 9, year: 2025, demand: 49 },
  { month: 10, year: 2025, demand: 56 },
  { month: 11, year: 2025, demand: 58 },
  { month: 0, year: 2026, demand: 48 },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

const generateTransactionsForMonth = (productId, productPrice, month, year, demand) => {
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
      items: [{ productId, quantity, price: productPrice, subtotal }],
    });
  });

  return transactions;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

// ============================================
// 1. CREATE KAPAL API PRODUCT
// ============================================

async function createKapalApiProduct() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 [1/3] CREATE PRODUK KAPAL API");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const supplier = await prisma.supplier.findFirst({
    where: { name: { contains: KAPAL_API_DATA.supplier, mode: "insensitive" } },
  });

  if (!supplier) {
    console.error(`❌ Supplier "${KAPAL_API_DATA.supplier}" tidak ditemukan!`);
    return;
  }

  console.log(`✅ Supplier: ${supplier.name}`);

  const existingProduct = await prisma.product.findFirst({
    where: { name: { contains: "Kapal Api", mode: "insensitive" } },
  });

  if (existingProduct) {
    console.log(`⚠️  Produk sudah ada, menghapus data lama...`);

    const existingTransactions = await prisma.transaction.findMany({
      where: { items: { some: { productId: existingProduct.id } } },
    });

    for (const transaction of existingTransactions) {
      await prisma.transactionItem.deleteMany({ where: { transactionId: transaction.id } });
      await prisma.transaction.delete({ where: { id: transaction.id } });
    }

    await prisma.product.delete({ where: { id: existingProduct.id } });
  }

  const product = await prisma.product.create({
    data: { ...KAPAL_API_DATA.product, supplierId: supplier.id },
  });

  console.log(`✅ Produk dibuat: ${product.name}`);

  let totalTransactions = 0;

  for (const { month, year, demand } of KAPAL_API_DATA.demands) {
    const monthTransactions = generateTransactionsForMonth(product.id, product.price, month, year, demand);

    for (const txData of monthTransactions) {
      await prisma.transaction.create({
        data: {
          date: txData.date,
          totalAmount: txData.items.reduce((sum, item) => sum + item.subtotal, 0),
          items: { create: txData.items },
        },
      });
      totalTransactions++;
    }

    console.log(`  ✓ ${monthNames[month]} ${year}: ${demand} dus`);
  }

  const totalDemand = KAPAL_API_DATA.demands.reduce((sum, m) => sum + m.demand, 0);
  console.log(`\n✅ Total: ${totalTransactions} transaksi | ${totalDemand} dus`);
}

// ============================================
// 2. UPDATE INDOMIE GORENG
// ============================================

async function updateIndomieData() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🍜 [2/3] UPDATE INDOMIE GORENG 85 GR");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const product = await prisma.product.findFirst({
    where: { name: "Indomie Goreng 85 gr" },
  });

  if (!product) {
    console.error("❌ Produk tidak ditemukan!");
    return;
  }

  console.log(`✅ Produk: ${product.name}`);

  const existingTransactions = await prisma.transaction.findMany({
    where: { items: { some: { productId: product.id } } },
    include: { items: true },
  });

  for (const transaction of existingTransactions) {
    await prisma.transactionItem.deleteMany({ where: { transactionId: transaction.id } });
    await prisma.transaction.delete({ where: { id: transaction.id } });
  }

  console.log(`🗑️  ${existingTransactions.length} transaksi lama dihapus`);

  let totalTransactions = 0;

  for (const { month, year, demand } of INDOMIE_DEMANDS) {
    const monthTransactions = generateTransactionsForMonth(product.id, product.price, month, year, demand);

    for (const txData of monthTransactions) {
      await prisma.transaction.create({
        data: {
          date: txData.date,
          totalAmount: txData.items.reduce((sum, item) => sum + item.subtotal, 0),
          items: { create: txData.items },
        },
      });
      totalTransactions++;
    }

    console.log(`  ✓ ${monthNames[month]} ${year}: ${demand} dus`);
  }

  const totalDemand = INDOMIE_DEMANDS.reduce((sum, m) => sum + m.demand, 0);
  console.log(`\n✅ Total: ${totalTransactions} transaksi | ${totalDemand} dus`);
}

// ============================================
// 3. UPDATE SAMPOERNA A MILD 12
// ============================================

async function updateSampoernaData() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚬 [3/3] UPDATE SAMPOERNA A MILD 12");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const product = await prisma.product.findFirst({
    where: { name: { contains: "Sampoerna A Mild 12", mode: "insensitive" } },
  });

  if (!product) {
    console.error("❌ Produk tidak ditemukan!");
    return;
  }

  console.log(`✅ Produk: ${product.name}`);

  const existingTransactions = await prisma.transaction.findMany({
    where: { items: { some: { productId: product.id } } },
    include: { items: true },
  });

  for (const transaction of existingTransactions) {
    await prisma.transactionItem.deleteMany({ where: { transactionId: transaction.id } });
    await prisma.transaction.delete({ where: { id: transaction.id } });
  }

  console.log(`🗑️  ${existingTransactions.length} transaksi lama dihapus`);

  let totalTransactions = 0;

  for (const { month, year, demand } of SAMPOERNA_DEMANDS) {
    const monthTransactions = generateTransactionsForMonth(product.id, product.price, month, year, demand);

    for (const txData of monthTransactions) {
      await prisma.transaction.create({
        data: {
          date: txData.date,
          totalAmount: txData.items.reduce((sum, item) => sum + item.subtotal, 0),
          items: { create: txData.items },
        },
      });
      totalTransactions++;
    }

    console.log(`  ✓ ${monthNames[month]} ${year}: ${demand} slop`);
  }

  const totalDemand = SAMPOERNA_DEMANDS.reduce((sum, m) => sum + m.demand, 0);
  console.log(`\n✅ Total: ${totalTransactions} transaksi | ${totalDemand} slop`);
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  try {
    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║   UPDATE DATA PRODUK SAPUTRA JAYA SMA     ║");
    console.log("╚════════════════════════════════════════════╝");

    await createKapalApiProduct();
    await updateIndomieData();
    await updateSampoernaData();

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✨ SEMUA PROSES SELESAI!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("\n❌ ERROR:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
