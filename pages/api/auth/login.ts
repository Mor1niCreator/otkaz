import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createSecurityContext, logSecurityEvent } from '@/lib/security-middleware';
import { authRateLimiter } from '@/lib/security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const securityContext = createSecurityContext(req);

  // Блокируем подозрительную активность
  if (securityContext.isSuspicious) {
    logSecurityEvent('SUSPICIOUS_LOGIN_ATTEMPT', securityContext);
    return res.status(403).json({ 
      error: 'Access denied',
      code: 'SUSPICIOUS_ACTIVITY'
    });
  }

  // Блокируем при превышении лимита запросов
  if (securityContext.rateLimited) {
    const retryAfter = Math.ceil(authRateLimiter.getRemainingTime(securityContext.ip) / 1000);
    return res.status(429).json({ 
      error: 'Too many requests',
      retryAfter,
      code: 'RATE_LIMITED'
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', securityContext, { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Проверяем, не заблокирован ли пользователь
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      logSecurityEvent('LOGIN_FAILED_ACCOUNT_LOCKED', securityContext, { userId: user.id });
      return res.status(423).json({ 
        error: 'Account is temporarily locked due to too many failed attempts',
        lockedUntil: user.lockedUntil
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      // Увеличиваем счетчик неудачных попыток
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const updateData: any = { failedLoginAttempts: failedAttempts };
      
      // Блокируем аккаунт после 5 неудачных попыток на 15 минут
      if (failedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
        logSecurityEvent('ACCOUNT_LOCKED', securityContext, { userId: user.id, failedAttempts });
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
      
      logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', securityContext, { userId: user.id, failedAttempts });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Сбрасываем счетчик неудачных попыток при успешном входе
    if (user.failedLoginAttempts > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          failedLoginAttempts: 0,
          lockedUntil: null
        }
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        currency: user.currency,
        language: user.language,
        points: user.points,
        rank: user.rank,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}