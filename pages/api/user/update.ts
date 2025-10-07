import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, currency, language, timezone } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(currency && { currency }),
        ...(language && { language }),
        ...(timezone && { timezone }),
      },
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currency: user.currency,
        language: user.language,
        timezone: user.timezone,
        points: user.points,
        rank: user.rank,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}