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
    // TAG-RELATED ACHIEVEMENTS
    {
      code: 'reason_seeker',
      nameEn: 'Reason Seeker',
      nameRu: 'Искатель Причин',
      descriptionEn: 'Added your first Why tag',
      descriptionRu: 'Добавил первую метку Почему',
      icon: '🤔',
    },
    {
      code: 'self_aware',
      nameEn: 'Self Aware',
      nameRu: 'Самоосознанный',
      descriptionEn: 'Tagged 5 categories with reasons',
      descriptionRu: 'Отметил 5 категорий причинами',
      icon: '🧠',
    },
    {
      code: 'health_warrior',
      nameEn: 'Health Warrior',
      nameRu: 'Воин Здоровья',
      descriptionEn: 'Tagged 3+ items as harmful or unhealthy',
      descriptionRu: 'Отметил 3+ вещи как вредные или нездоровые',
      icon: '💪',
    },
    {
      code: 'money_master',
      nameEn: 'Money Master',
      nameRu: 'Мастер Денег',
      descriptionEn: 'Tagged 3+ items as expensive or wasteful',
      descriptionRu: 'Отметил 3+ вещи как дорогие или расточительные',
      icon: '💎',
    },
    {
      code: 'habit_breaker',
      nameEn: 'Habit Breaker',
      nameRu: 'Ломатель Привычек',
      descriptionEn: 'Tagged 3+ items as bad habits or addictive',
      descriptionRu: 'Отметил 3+ вещи как плохие привычки',
      icon: '⛓️',
    },
    {
      code: 'time_lord',
      nameEn: 'Time Lord',
      nameRu: 'Властелин Времени',
      descriptionEn: 'Tagged 3+ items as time wasting',
      descriptionRu: 'Отметил 3+ вещи как трата времени',
      icon: '⏳',
    },
    {
      code: 'minimalist',
      nameEn: 'Minimalist',
      nameRu: 'Минималист',
      descriptionEn: 'Tagged 3+ items as unnecessary or useless',
      descriptionRu: 'Отметил 3+ вещи как ненужные',
      icon: '🎯',
    },
    {
      code: 'wisdom_keeper',
      nameEn: 'Wisdom Keeper',
      nameRu: 'Хранитель Мудрости',
      descriptionEn: 'Added 10+ Why tags across categories',
      descriptionRu: 'Добавил 10+ меток Почему',
      icon: '📚',
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