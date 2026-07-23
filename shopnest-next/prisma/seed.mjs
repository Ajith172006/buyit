import { PrismaClient } from '@prisma/client';
import { initialProducts } from '../lib/data.js';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`Catalog already contains ${count} products; skipping seed.`);
    return;
  }
  await prisma.product.createMany({
    data: initialProducts.map(({ id, mrp, desc, reviews, ...product }) => ({
      ...product,
      originalPrice: mrp,
      description: desc,
      images: product.images?.length ? product.images : [product.image],
      tags: product.tags ?? [],
    })),
  });
  console.log(`Seeded ${initialProducts.length} catalog products.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
