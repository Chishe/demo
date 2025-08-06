const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function formatDate(date: Date): string {
  const pad = (n: number): string => n.toString().padStart(2, '0');
  return [
    pad(date.getDate()),
    pad(date.getMonth() + 1),
    date.getFullYear().toString().slice(2),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('/');
}


async function main() {
  for (let i = 1; i <= 10; i++) {
    const now = new Date();
    const timestamp = formatDate(now);
    const partNumber = `TG446610-${i.toString().padStart(4, '0')}-${timestamp}`;

    await prisma.log.create({
      data: {
        partNumber,
        startTime: '08:00',
        endTime: '17:00',
        ct: '650',
        standard: '600',
        limitHigh: 1000,
        limitLow: 500,
      },
    });
  }
  console.log('Seeded 10 logs with timestamp!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
