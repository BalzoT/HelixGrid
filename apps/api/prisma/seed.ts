import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const plant = await prisma.powerPlant.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo Plant',
      latitude: 37.7749,
      longitude: -122.4194,
    },
  })

  await prisma.ppaContract.upsert({
    where: { id: '00000000-0000-0000-0000-0000000000aa' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-0000000000aa',
      plantId: plant.id,
      buyer: 'Acme Corp',
      startDate: new Date(),
      rateCentsPerKwh: 12.5 as any,
    },
  })
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

