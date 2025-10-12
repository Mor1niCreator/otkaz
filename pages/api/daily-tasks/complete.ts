import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, taskId } = req.body;
    
    if (!userId || !taskId) {
      return res.status(400).json({ error: 'User ID and Task ID required' });
    }

    // Получаем задание
    const task = await prisma.dailyTask.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Проверяем, не выполнено ли уже задание сегодня
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const existingCompletion = await prisma.userDailyTask.findFirst({
      where: {
        userId,
        taskId,
        completedAt: {
          gte: todayStart,
          lt: todayEnd
        }
      }
    });

    if (existingCompletion) {
      return res.status(400).json({ error: 'Task already completed today' });
    }

    // Создаем запись о выполнении задания
    const completion = await prisma.userDailyTask.create({
      data: {
        userId,
        taskId,
        pointsEarned: task.points
      }
    });

    // Обновляем очки пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: user.points + task.points
      }
    });

    return res.status(200).json({
      success: true,
      pointsEarned: task.points,
      totalPoints: updatedUser.points,
      message: `Task completed! +${task.points} points`
    });

  } catch (error) {
    console.error('Complete task error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}