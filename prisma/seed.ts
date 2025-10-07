import { PrismaClient } from '@prisma/client';
import { ACHIEVEMENTS } from '../lib/achievements';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed achievements
  for (const achievement of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   - ${ACHIEVEMENTS.length} achievements created`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });