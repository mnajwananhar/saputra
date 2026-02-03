const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkProducts() {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: "Indomie",
        mode: "insensitive",
      },
    },
  });

  console.log("Produk Indomie yang ditemukan:");
  products.forEach((p) => {
    console.log(`- ID: ${p.id}`);
    console.log(`  Nama: ${p.name}`);
    console.log(`  Unit: ${p.unit}`);
    console.log(`  Harga: Rp ${p.price.toLocaleString("id-ID")}`);
    console.log("");
  });

  await prisma.$disconnect();
}

checkProducts();
