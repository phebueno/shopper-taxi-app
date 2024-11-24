import { PrismaClient } from '@prisma/client';
import reviewsDefaultData from './data/review.data';
import driversDefaultData from './data/driver.data';
const prisma = new PrismaClient();
async function main() {
  await prisma.driver.deleteMany();
  await prisma.review.deleteMany();
  await prisma.review.createMany({
    data: reviewsDefaultData,
  });
  const drivers = await prisma.driver.createMany({
    data: driversDefaultData,
  });
  console.log({ drivers });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
