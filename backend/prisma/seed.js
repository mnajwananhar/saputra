const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
const years = [2024, 2025];

const getRandomDemand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

async function main() {
  console.log('--- Memulai Seeding Data Saputra Jaya ---');

  // 1. Buat User Admin Default
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator Saputra',
      role: 'owner'
    }
  });

  // Create some suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'PT. Distributor Jaya Abadi',
      contact: 'Bpk. Joko',
      phone: '021-1234-5678',
      email: 'info@distributorjaya.com',
      address: 'Jl. Raya Bogor No. 123, Jakarta Timur'
    }
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'CV. Sumber Makmur',
      contact: 'Ibu Siti',
      phone: '021-8765-4321',
      email: 'contact@sumbermakmur.com',
      address: 'Jl. Thamrin Raya No. 45, Jakarta Pusat'
    }
  });

  const productList = [
    { name: 'Minyak Bimoli 2L', unit: 'Pcs', baseDemand: 60, current: 45, safety: 15, price: 28000, cost: 25000 },
    { name: 'Beras Rojolele 5kg', unit: 'Karung', baseDemand: 30, current: 10, safety: 12, price: 65000, cost: 60000 },
    { name: 'Indomie Goreng', unit: 'Dus', baseDemand: 200, current: 250, safety: 50, price: 3600, cost: 3200 },
    { name: 'Gula Gulaku 1kg', unit: 'Pcs', baseDemand: 80, current: 5, safety: 20, price: 14000, cost: 12000 },
    { name: 'Terigu Segitiga Biru 1kg', unit: 'Pcs', baseDemand: 45, current: 50, safety: 10, price: 12000, cost: 10000 },
    { name: 'Kopi Kapal Api 165gr', unit: 'Pouch', baseDemand: 25, current: 30, safety: 8, price: 7500, cost: 6500 },
    { name: 'Susu Frisian Flag 370g', unit: 'Kaleng', baseDemand: 40, current: 15, safety: 12, price: 18000, cost: 16000 },
    { name: 'Rinso Bubuk 800gr', unit: 'Pcs', baseDemand: 35, current: 40, safety: 10, price: 15000, cost: 13000 }
  ];

  for (const p of productList) {
    console.log(`Menambahkan produk: ${p.name}`);

    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        unit: p.unit,
        price: p.price,
        cost: p.cost,
        currentStock: p.current,
        safetyStock: p.safety,
        bestN: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
        supplier: {
          connect: p.name.includes('Beras') || p.name.includes('Terigu') ? { id: supplier2.id } : { id: supplier1.id }
        }
      }
    });

    const historicalEntries = [];
    for (const year of years) {
      for (const month of months) {
        const seasonalBoost = month === 'Apr' || month === 'Des' ? 1.3 : 1.0;
        const randomFluc = (Math.random() * 0.4) + 0.8;
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
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
