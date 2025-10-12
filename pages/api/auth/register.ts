import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateReferralCode } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, referralCode, currency = 'USD', language = 'en' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const userReferralCode = generateReferralCode();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        currency,
        language,
        referralCode: userReferralCode,
        referredBy: referralCode || null,
      },
    });

    // If referred, create referral relationship
    if (referralCode) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode },
      });

      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
          },
        });

        // Grant bonus points to both users
        await prisma.user.update({
          where: { id: user.id },
          data: { points: { increment: 20 } }, // New user gets 20 points
        });

        await prisma.user.update({
          where: { id: referrer.id },
          data: { points: { increment: 50 } }, // Referrer gets 50 points
        });
      }
    }

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currency: user.currency,
        language: user.language,
        points: user.points,
        rank: user.rank,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}