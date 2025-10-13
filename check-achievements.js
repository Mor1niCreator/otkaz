const { PrismaClient } = require('@prisma/client');

async function checkAchievements() {
  const prisma = new PrismaClient();
  
  try {
    const achievementCount = await prisma.achievement.count();
    console.log('Achievements in database:', achievementCount);
    
    if (achievementCount === 0) {
      console.log('No achievements found. Creating default achievements...');
      
      const defaultAchievements = [
        {
          code: 'coffee_breaker',
          nameEn: 'Coffee Breaker',
          nameRu: 'Кофе-Брейкер',
          descriptionEn: 'Refuse your first coffee purchase',
          descriptionRu: 'Откажитесь от первой покупки кофе',
          icon: '☕'
        },
        {
          code: 'budget_ninja',
          nameEn: 'Budget Ninja',
          nameRu: 'Бюджетный Ниндзя',
          descriptionEn: 'Earn 40+ points',
          descriptionRu: 'Заработайте 40+ очков',
          icon: '🥷'
        },
        {
          code: 'momentum',
          nameEn: 'Momentum',
          nameRu: 'Импульс',
          descriptionEn: '21-day streak',
          descriptionRu: '21-дневная серия',
          icon: '⚡'
        },
        {
          code: 'iron_will',
          nameEn: 'Iron Will',
          nameRu: 'Железная Воля',
          descriptionEn: '30-day streak',
          descriptionRu: '30-дневная серия',
          icon: '💪'
        },
        {
          code: 'consistency_king',
          nameEn: 'Consistency King',
          nameRu: 'Король Постоянства',
          descriptionEn: '60-day streak',
          descriptionRu: '60-дневная серия',
          icon: '👑'
        }
      ];
      
      for (const achievement of defaultAchievements) {
        await prisma.achievement.create({ data: achievement });
      }
      
      console.log('Default achievements created!');
    }
    
    const achievements = await prisma.achievement.findMany();
    console.log('All achievements:', achievements);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAchievements();