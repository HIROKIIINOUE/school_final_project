import { prisma } from "../lib/prisma";

async function main() {
  const trips = await prisma.trip.findMany();

  console.log(trips);
}

main()
  .catch((error) => {
    console.error("Prisma test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
