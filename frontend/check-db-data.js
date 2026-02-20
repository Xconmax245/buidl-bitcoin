
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const profileCount = await prisma.profile.count();
    console.log(`Users: ${userCount}`);
    console.log(`Profiles: ${profileCount}`);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({ take: 5 });
      console.log('Sample Users:', JSON.stringify(users, null, 2));
    }
  } catch (err) {
    console.error('Error checking DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
