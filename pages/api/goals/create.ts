import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { convertToUSD } from '@/lib/currency-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, name, targetAmount, currency } = req.body;

    if (!userId || !name || !targetAmount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const usdTarget = await convertToUSD(targetAmount, currency);

    const goal = await prisma.goal.create({
      data: {
        userId,
        name,
        targetAmount,
        currency,
        usdTarget,
      },
    });

    return res.status(201).json({ goal });
  } catch (error) {
    console.error('Create goal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}