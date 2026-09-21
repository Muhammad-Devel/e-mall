import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPhone = "+998900000000";
  const existing = await prisma.user.findUnique({ where: { phone: adminPhone } });
  if (!existing) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        phone: adminPhone,
        passwordHash,
        fullName: "Super Admin",
        role: "SUPER_ADMIN",
      },
    });

    console.log("Super admin created:");
    console.log("  phone:", adminPhone);
    console.log("  password: admin123");
  } else {
    console.log("Super admin already exists:", adminPhone);
  }

  const defaultStoreTypes = ["Oziq-ovqat", "Kiyim-kechak", "Maishiy texnika", "Dorixona", "Kafe va restoran"];
  for (const name of defaultStoreTypes) {
    await prisma.storeType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Store types ready: ${defaultStoreTypes.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
