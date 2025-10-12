import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { usernameSchema, profileRateLimiter } from '@/lib/security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, userId } = req.body;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    // Rate limiting
    if (!profileRateLimiter.isAllowed(clientIP as string)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(profileRateLimiter.getRemainingTime(clientIP as string) / 1000)
      });
    }

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Валидация никнейма
    try {
      usernameSchema.parse(username);
    } catch (error: any) {
      return res.status(400).json({ 
        available: false,
        error: error.errors[0].message 
      });
    }

    // Проверяем, что никнейм не занят
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    const isAvailable = !existingUser || (userId && existingUser.id === userId);

    return res.status(200).json({
      available: isAvailable,
      username,
      message: isAvailable ? 'Username is available' : 'Username is already taken'
    });

  } catch (error) {
    console.error('Check username error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}