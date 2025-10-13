import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getTodaysTasks, checkTaskCompletion } from '@/lib/daily-tasks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Получаем задания на сегодня
    const today = new Date();
    const dayOfWeek = today.getDay();
    const todaysTasks = getTodaysTasks(dayOfWeek);

    // Получаем статистику пользователя за сегодня
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const todayEntries = await prisma.entry.findMany({
      where: {
        userId: userId as string,
        date: {
          gte: todayStart,
          lt: todayEnd
        }
      }
    });

    const todayAmount = todayEntries.reduce((sum, entry) => sum + entry.usdAmount, 0);
    
    // Подсчитываем записи по категориям
    const categoryCounts = todayEntries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Проверяем рефералы
    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId as string }
    });

    // Получаем уже выполненные задания сегодня
    const completedTasks = await prisma.userDailyTask.findMany({
      where: {
        userId: userId as string,
        completedAt: {
          gte: todayStart,
          lt: todayEnd
        }
      },
      include: {
        task: true
      }
    });

    const completedTaskIds = new Set(completedTasks.map(ct => ct.taskId));

    // Создаем или получаем задания в базе данных
    const tasks = await Promise.all(todaysTasks.map(async (taskData) => {
      let task = await prisma.dailyTask.findUnique({
        where: { code: taskData.code }
      });

      if (!task) {
        task = await prisma.dailyTask.create({
          data: taskData
        });
      }

      const isCompleted = completedTaskIds.has(task.id);
      
      // Вычисляем прогресс
      let progress = 0;
      let maxProgress = task.target || 1;

      if (!isCompleted) {
        const userStats = {
          todayEntries: todayEntries.length,
          todayAmount,
          weekStreak: 0, // TODO: реализовать подсчет серии
          categoryCounts,
          hasReferrals: referrals.length > 0
        };

        switch (task.type) {
          case 'daily':
            progress = Math.min(todayEntries.length, maxProgress);
            break;
          case 'amount':
            progress = Math.min(todayAmount, maxProgress);
            break;
          case 'category':
            progress = Math.min(categoryCounts[task.category || ''] || 0, maxProgress);
            break;
          case 'referral':
            progress = referrals.length >= maxProgress ? maxProgress : referrals.length;
            break;
          case 'streak':
            // TODO: реализовать подсчет серии
            progress = 0;
            break;
        }
      } else {
        progress = maxProgress;
      }

      return {
        id: task.id,
        code: task.code,
        nameEn: task.nameEn,
        nameRu: task.nameRu,
        descriptionEn: task.descriptionEn,
        descriptionRu: task.descriptionRu,
        points: task.points,
        type: task.type,
        target: task.target,
        category: task.category,
        isCompleted,
        progress,
        maxProgress
      };
    }));

    return res.status(200).json({
      tasks,
      todayStats: {
        entries: todayEntries.length,
        amount: todayAmount,
        categories: categoryCounts,
        referrals: referrals.length
      }
    });

  } catch (error) {
    console.error('Daily tasks error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}