import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@healthsurvey.local";
  const password = "Admin@123";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Super Admin",
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      name: "Super Admin",
      email,
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log("Seeded Super Admin:");
  console.log(`  email: ${email}`);
  console.log(`  password: ${password}`);
  console.log(`  id: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
