const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PRODUCT_DATA = {
  name: "Kopi Kapal Api Special 165 gr",
  unit: "Dus",
  price: 95000,
  cost: 85000,
  currentStock: 15,
  safetyStock: 20,
  bestN: 4,
};

const SUPPLIER_NAME = "PT Santos Jaya Abadi";

const MONTHLY_DEMANDS = [
  { month: 0, year: 2024, demand: 130 },  // Jan 2024
  { month: 1, year: 2024, demand: 118 },  // Feb 2024
  { month: 2, year: 2024, demand: 115 },  // Mar 2024
  { month: 3, year: 2024, demand: 95 },   // Apr 2024
  { month: 4, year: 2024, demand: 115 },  // Mei 2024
  { month: 5, year: 2024, demand: 102 },  // Jun 2024
  { month: 6, year: 2024, demand: 105 },  // Jul 2024
  { month: 7, year: 2024, demand: 110 },  // Agt 2024
  { month: 8, year: 2024, demand: 94 },   // Sep 2024
  { month: 9, year: 2024, demand: 118 },  // Okt 2024
  { month: 10, year: 2024, demand: 125 }, // Nov 2024
  { month: 11, year: 2024, demand: 120 }, // Des 2024
  { month: 0, year: 2025, demand: 120 },  // Jan 2025
  { month: 1, year: 2025, demand: 118 },  // Feb 2025
  { month: 2, year: 2025, demand: 115 },  // Mar 2025
  { month: 3, year: 2025, demand: 118 },  // Apr 2025
  { month: 4, year: 2025, demand: 116 },  // Mei 2025
  { month: 5, year: 2025, demand: 118 },  // Jun 2025
  { month: 6, year: 2025, demand: 119 },  // Jul 2025
  { month: 7, year: 2025, demand: 120 },  // Agt 2025
  { month: 8, year: 2025, demand: 118 },  // Sep 2025
  { month: 9, year: 2025, demand: 120 },  // Okt 2025
  { month: 10, year: 2025, demand: 125 }, // Nov 2025
  { month: 11, year: 2025, demand: 118 }, // Des 2025
  { month: 0, year: 2026, demand: 120 },  // Jan 2026
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

async function createKapalApiProduct() {
  console.log(`🔍 Mencari supplier: ${SUPPLIER_NAME}...`);

  const supplier = await prisma.supplier.findFirst({
    where: {
      name: {
        contains: "Santos Jaya",
        mode: "insensitive",
      },
    },
  });

  if (!supplier) {
    console.error(`❌ Supplier "${SUPPLIER_NAME}" tidak ditemukan!`);
    return;
  }

  console.log(`✅ Supplier ditemukan: ${supplier.name} (ID: ${supplier.id})`);

  console.log(`\n🔍 Cek apakah produk sudah ada...`);

  const existingProduct = await prisma.product.findFirst({
    where: {
      name: {
        contains: "Kapal Api",
        mode: "insensitive",
      },
    },
  });

  let product;

  if (existingProduct) {
    console.log(`⚠️  Produk sudah ada: ${existingProduct.name}`);
    console.log(`🗑️  Menghapus produk dan transaksi lama...`);

    const existingTransactions = await prisma.transaction.findMany({
      where: {
        items: {
          some: {
            productId: existingProduct.id,
          },
        },
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

    await prisma.historicalData.deleteMany({
      where: { productId: existingProduct.id },
    });

    await prisma.product.delete({
      where: { id: existingProduct.id },
    });

    console.log(`✅ Produk lama dihapus`);
  }

  console.log(`\n📦 Membuat produk baru: ${PRODUCT_DATA.name}...`);

  product = await prisma.product.create({
    data: {
      name: PRODUCT_DATA.name,
      unit: PRODUCT_DATA.unit,
      price: PRODUCT_DATA.price,
      cost: PRODUCT_DATA.cost,
      currentStock: PRODUCT_DATA.currentStock,
      safetyStock: PRODUCT_DATA.safetyStock,
      bestN: PRODUCT_DATA.bestN,
      supplierId: supplier.id,
    },
  });

  console.log(`✅ Produk dibuat: ${product.name} (ID: ${product.id})`);
  console.log(`💰 Harga: Rp ${product.price.toLocaleString("id-ID")}`);
  console.log(`🏢 Supplier: ${supplier.name}`);

  console.log(`\n📝 Membuat transaksi berdasarkan data demand...`);

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
      `  ✓ ${monthName} ${year}: ${demand} dus (${monthTransactions.length} transaksi)`,
    );
  }

  console.log(`\n✅ Selesai! Total ${totalTransactions} transaksi dibuat`);

  const totalDemand = MONTHLY_DEMANDS.reduce((sum, m) => sum + m.demand, 0);
  console.log(`📊 Total demand Jan 2024 - Jan 2026: ${totalDemand} dus`);
}

async function main() {
  try {
    await createKapalApiProduct();
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
