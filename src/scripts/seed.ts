import { PrismaClient } from "../generated/prisma";

// src/scripts/seed.ts
const prisma = new PrismaClient();

async function main() {
  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      totalSeats: 5000,
      seatsSold: 0
    }
  });

  console.log('✅ Seeded event');
}
main();
