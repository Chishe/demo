const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const users = [
    { username: "admin01", password: await bcrypt.hash("admin123", 10), firstname: "System", lastname: "Admin", level: "ADMIN" },
    { username: "manager01", password: await bcrypt.hash("manager123", 10), firstname: "Somchai", lastname: "Manager", level: "MANAGER" },
    { username: "executive01", password: await bcrypt.hash("executive123", 10), firstname: "Suda", lastname: "Executive", level: "EXECUTIVE" },
    { username: "user01", password: await bcrypt.hash("user123", 10), firstname: "Anan", lastname: "User", level: "USER" },
  ];

  for (const u of users) {
    await prisma.user.create({ data: u });
    console.log(`👤 Created user: ${u.username} [${u.level}]`);
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
