import prisma from '../prisma_db.js';

try {
  const tasks = await prisma.tasks.findMany({
    select: {
      title: true,
      completed: true
    }
  });

  console.log(tasks);;


  console.log('Users retrieved successfully:');
} catch (error) {
  console.error('Prisma connection failed:', error);
} finally {
  await prisma.$disconnect();
}