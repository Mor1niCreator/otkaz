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

    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId as string },
      include: {
        referred: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            points: true,
          },
        },
      },
    });

    return res.status(200).json({ referrals });
  } catch (error) {
    console.error('List referrals error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}