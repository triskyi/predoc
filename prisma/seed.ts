// Add this at the top of your file to tell ts-node-esm how to handle .ts files
const require = createRequire(import.meta.url);

// Use require for CommonJS modules when running as ESM
import { PrismaClient, Role } from "@prisma/client";
const bcrypt = require("bcrypt");
import { createRequire as nodeCreateRequire } from "module";

const prisma = new PrismaClient();

async function main() {
  const password = "adminpassword"; // Change this to a secure password
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: "predoc@admin.com" },
    update: {
      name: "PREDOC Admin ",
      passwordHash,
      role: Role.admin,
    },
    create: {
      name: "PREDOC Admin ",
      email: "predoc@admin.com",
      passwordHash,
      role: Role.admin,
    },
  });

  console.log("Admin user created/ensured.");
}

function createRequire(url: string) {
    return nodeCreateRequire(url);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

