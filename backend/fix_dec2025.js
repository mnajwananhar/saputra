const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixDecember2025() {
  // Find Kapal Api product
  const product = await prisma.product.findFirst({
    where: { name: { contains: "Kapal Api", mode: "insensitive" } },
  });

  if (!product) {
    console.log("Product not found!");
    return;
  }

  console.log(`Found: ${product.name}`);

  // Add 4 more items to December 2025 (to fix 114 -> 118)
  const december2025Date = new Date(2025, 11, 15, 10, 0, 0); // Dec 15, 2025

  await prisma.transaction.create({
    data: {
      date: december2025Date,
      totalAmount: 4 * product.price,
      items: {
        create: {
          productId: product.id,
          quantity: 4,
          price: product.price,
          subtotal: 4 * product.price,
        },
      },
    },
  });

  console.log("✅ Added 4 to December 2025. Total should now be 118.");
  await prisma.$disconnect();
}

fixDecember2025();
