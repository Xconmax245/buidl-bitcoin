const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    let user = await prisma.user.findFirst({
        where: { 
          OR: [
            { walletAddress: address },
            { email: address + '@stacks.local' }
          ]
        },
        include: { profile: true }
    });
    console.log('Found user:', user);
    if (!user) {
        user = await prisma.user.create({
            data: {
                walletAddress: address,
                email: address + '@stacks.local',
                authProvider: 'WALLET',
                profile: {
                    create: {
                    username: 'stx_' + address.slice(0, 6).toLowerCase() + '_' + address.slice(-4).toLowerCase(),
                    displayName: 'Stacker ' + address.slice(0, 6),
                    }
                }
            },
            include: { profile: true }
        });
        console.log('Created user:', user);
    }
  } catch (err) {
      console.error('Error:', err);
  } finally {
      await prisma.$disconnect();
  }
}
run();
