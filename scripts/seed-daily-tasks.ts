import { PrismaClient } from '@prisma/client';
import { DAILY_TASKS } from '../lib/daily-tasks';

const prisma = new PrismaClient();

async function seedDailyTasks() {
  console.log('Seeding daily tasks...');

  for (const taskData of DAILY_TASKS) {
    const existingTask = await prisma.dailyTask.findUnique({
      where: { code: taskData.code }
    });

    if (!existingTask) {
      await prisma.dailyTask.create({
        data: taskData
      });
      console.log(`Created task: ${taskData.nameEn}`);
    } else {
      console.log(`Task already exists: ${taskData.nameEn}`);
    }
  }

  console.log('Daily tasks seeded successfully!');
}

seedDailyTasks()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });