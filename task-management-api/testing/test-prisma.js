import prisma from '../prisma_db.js';

try {
  const task = await prisma.tasks.findUnique({
    where: {
      id: 4
    }
  });

  console.log('Task found:', task);

  console.log('Users retrieved successfully:');
} catch (error) {
  console.error('Prisma connection failed:', error);
} finally {
  await prisma.$disconnect();
}