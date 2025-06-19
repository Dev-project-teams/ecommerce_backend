const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');


async function main() {
  const roles = ["ADMIN", "VENDOR", "CUSTOMER"];

  for (const role of roles) {
    await prisma.userRole.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  const adminRole = await prisma.userRole.findUnique({
    where: { name: "ADMIN" },
  });

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        first_name: "Admin",
        last_name: "User",
        email: "admin@example.com",
        phone: "9999999999",
        password: hashedPassword,
        role_id: adminRole.id,
      },
    });

    console.log("✅ Default admin user created.");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
