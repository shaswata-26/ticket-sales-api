import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('⏳ Seeding database...')

  // Clean existing data
  await prisma.purchase.deleteMany()
  await prisma.event.deleteMany()

  // Insert a default event
  await prisma.event.create({
    data: {
      id: 1,           // since @default(1)
      totalSeats: 100,
      seatsSold: 0,
    },
  })

  console.log('✅ Seeding complete.')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
