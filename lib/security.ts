import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Валидация никнейма
export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
  .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 'Username cannot start or end with hyphens');

// Валидация пароля
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be no more than 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');

// Валидация email
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email must be no more than 255 characters');

// Валидация имени
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(50, 'Name must be no more than 50 characters')
  .regex(/^[a-zA-Zа-яА-Я\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Функция для хеширования пароля
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Функция для проверки пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Функция для проверки силы пароля
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score += 1;
  else feedback.push('Use 12+ characters for better security');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  else feedback.push('Add special characters');

  if (password.length >= 16) score += 1;

  return { score, feedback };
}

// Функция для проверки на подозрительную активность
export function detectSuspiciousActivity(userAgent: string, ip: string): boolean {
  // Простая проверка на ботов и подозрительные паттерны
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    // /curl/i,  // Разрешаем curl для тестирования
    // /wget/i,  // Разрешаем wget для тестирования
    /python/i,
    /java/i,
    /php/i
  ];

  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

// Функция для ограничения частоты запросов
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 попыток за 15 минут
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;
    return Math.max(0, attempt.resetTime - Date.now());
  }
}

// Глобальный rate limiter для аутентификации
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 попыток за 15 минут
export const profileRateLimiter = new RateLimiter(10, 60 * 1000); // 10 попыток за минуту