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

    // Получаем рефералов пользователя
    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId as string },
      include: {
        referred: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            points: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Получаем статистику рефералов
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.referred.points > 0).length;
    const totalPointsFromReferrals = referrals.reduce((sum, r) => sum + r.referred.points, 0);

    // Получаем информацию о том, кто пригласил текущего пользователя
    const referrerInfo = await prisma.referral.findFirst({
      where: { referredId: userId as string },
      include: {
        referrer: {
          select: {
            id: true,
            name: true,
            username: true,
            referralCode: true
          }
        }
      }
    });

    return res.status(200).json({
      referrals: referrals.map(r => ({
        id: r.id,
        user: r.referred,
        joinedAt: r.createdAt,
        isActive: r.referred.points > 0
      })),
      stats: {
        totalReferrals,
        activeReferrals,
        totalPointsFromReferrals,
        referralCode: referrals[0]?.referrer?.referralCode || null
      },
      referrer: referrerInfo ? {
        name: referrerInfo.referrer.name,
        username: referrerInfo.referrer.username,
        referralCode: referrerInfo.referrer.referralCode
      } : null
    });

  } catch (error) {
    console.error('Referral stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}