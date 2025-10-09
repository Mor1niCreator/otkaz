import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { DEFAULT_GOALS } from '@/lib/default-goals';
import { convertToUSD } from '@/lib/currency-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, currency } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const createdGoals = [];

    for (const goal of DEFAULT_GOALS) {
      const usdTarget = goal.targetUSD;

      const newGoal = await prisma.goal.create({
        data: {
          userId,
          name: `${goal.icon} ${goal.name}`,
          targetAmount: goal.targetUSD,
          currency: currency || 'USD',
          usdTarget,
        },
      });

      createdGoals.push(newGoal);
    }

    return res.status(201).json({ goals: createdGoals });
  } catch (error) {
    console.error('Seed default goals error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}