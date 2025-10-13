import { NextApiRequest, NextApiResponse } from 'next';
import { detectSuspiciousActivity, authRateLimiter } from './security';

export interface SecurityContext {
  ip: string;
  userAgent: string;
  isSuspicious: boolean;
  rateLimited: boolean;
}

export function createSecurityContext(req: NextApiRequest): SecurityContext {
  const ip = (req.headers['x-forwarded-for'] as string) || 
            req.connection.remoteAddress || 
            'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  return {
    ip,
    userAgent,
    isSuspicious: detectSuspiciousActivity(userAgent, ip),
    rateLimited: !authRateLimiter.isAllowed(ip)
  };
}

export function securityMiddleware(
  req: NextApiRequest, 
  res: NextApiResponse, 
  next: () => void
) {
  const context = createSecurityContext(req);
  
  // Блокируем подозрительную активность
  if (context.isSuspicious) {
    console.warn(`Suspicious activity detected from ${context.ip}: ${context.userAgent}`);
    return res.status(403).json({ 
      error: 'Access denied',
      code: 'SUSPICIOUS_ACTIVITY'
    });
  }
  
  // Блокируем при превышении лимита запросов
  if (context.rateLimited) {
    const retryAfter = Math.ceil(authRateLimiter.getRemainingTime(context.ip) / 1000);
    return res.status(429).json({ 
      error: 'Too many requests',
      retryAfter,
      code: 'RATE_LIMITED'
    });
  }
  
  next();
}

// Функция для логирования подозрительной активности
export function logSecurityEvent(
  event: string, 
  context: SecurityContext, 
  additionalData?: any
) {
  console.log(`[SECURITY] ${event}`, {
    ip: context.ip,
    userAgent: context.userAgent,
    isSuspicious: context.isSuspicious,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
}