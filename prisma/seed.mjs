// prisma/seed.js
import prisma from "../lib/prisma.js"; // or relative path to your prisma client
import { hash } from "bcryptjs";

async function main() {
  // Create a user
  const passwordHash = await hash("test123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Default User",
      email: "default@user.com",
      password: passwordHash,
    },
  });

  // Create some chat records
  await prisma.chatHistory.createMany({
    data: [
      {
        userId: user.id, // user.id is an Int if your schema is set that way
        message: "What is CSE?",
        response: "CSE stands for Computer Science and Engineering",
      },
      {
        userId: user.id,
        message: "Tuition fees for CSE?",
        response: "The fees depend on your institution, typically $10,000 per year.",
      },
      {
        userId: user.id,
        message: "Minimum hsc result for cse admission?",
        response: "Minimum GPA is usually 3.5 in science background.",
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
