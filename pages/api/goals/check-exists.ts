import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: userId as string,
        isActive: true,
      },
      select: { id: true }
    });

    return res.status(200).json({ 
      exists: goals.length > 0,
      count: goals.length 
    });

  } catch (error) {
    console.error('Check goals exists error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}