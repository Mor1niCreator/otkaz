import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserStreak } from '@/lib/points-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const streak = await getUserStreak(userId as string);

    return res.status(200).json({ streak });
  } catch (error) {
    console.error('Get streak error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}