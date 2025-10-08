import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const achievements = [
    {
      code: 'coffee_breaker',
      nameEn: 'Coffee Breaker',
      nameRu: 'Кофейный Отказник',
      descriptionEn: 'Refused your first coffee',
      descriptionRu: 'Отказался от первого кофе',
      icon: '☕',
    },
    {
      code: 'sugar_free',
      nameEn: 'Sugar Free',
      nameRu: 'Без Сахара',
      descriptionEn: '7 days without soda',
      descriptionRu: '7 дней без газировки',
      icon: '🥤',
    },
    {
      code: 'smoke_out',
      nameEn: 'Smoke Out',
      nameRu: 'Бросил Курить',
      descriptionEn: '14 day streak',
      descriptionRu: 'Стрик 14 дней',
      icon: '🚬',
    },
    {
      code: 'budget_ninja',
      nameEn: 'Budget Ninja',
      nameRu: 'Бюджетный Ниндзя',
      descriptionEn: 'Saved $40+',
      descriptionRu: 'Накоплено $40+',
      icon: '🥷',
    },
    {
      code: 'momentum',
      nameEn: 'Momentum',
      nameRu: 'Импульс',
      descriptionEn: '21 day streak',
      descriptionRu: 'Стрик 21 день',
      icon: '⚡',
    },
    {
      code: 'ref_hero',
      nameEn: 'Referral Hero',
      nameRu: 'Герой Рефералов',
      descriptionEn: '3 active referrals',
      descriptionRu: '3 активных реферала',
      icon: '🦸',
    },
    {
      code: 'consistency_king',
      nameEn: 'Consistency King',
      nameRu: 'Король Постоянства',
      descriptionEn: '60 day streak',
      descriptionRu: 'Стрик 60 дней',
      icon: '👑',
    },
    {
      code: 'iron_will',
      nameEn: 'Iron Will',
      nameRu: 'Железная Воля',
      descriptionEn: '30 days without missing',
      descriptionRu: '30 дней без пропусков',
      icon: '🛡️',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: {},
      create: achievement,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   - ${achievements.length} achievements created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });