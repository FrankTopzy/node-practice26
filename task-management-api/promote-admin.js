import prisma from "./prisma_db.js";

try {
  const updatedUser = await prisma.users.update({
    where: {
      id: 8
    },
    data: {
      role: "admin"
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  });

  console.log(updatedUser);

} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}