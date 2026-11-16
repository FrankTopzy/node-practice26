import prisma from '../prisma_db.js';

try {
  const user = await prisma.users.findUnique({
    where: {
      email: 'rollback@example.com'
    }
  });

  console.log('Rollback test user:', user);
  //console.dir(users, { depth: null });

  console.log('Users retrieved successfully:');
} catch (error) {
  console.error('Prisma connection failed:', error);
} finally {
  await prisma.$disconnect();
}