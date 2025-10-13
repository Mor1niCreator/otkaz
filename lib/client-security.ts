// Клиентская валидация и санитизация

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Удаляем потенциально опасные символы
    .trim()
    .substring(0, 1000); // Ограничиваем длину
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 20) {
    return { valid: false, error: 'Username must be no more than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  
  if (username.startsWith('-') || username.endsWith('-')) {
    return { valid: false, error: 'Username cannot start or end with hyphens' };
  }
  
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string; strength: number } {
  if (!password) {
    return { valid: false, error: 'Password is required', strength: 0 };
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters', strength: 0 };
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'Password must be no more than 128 characters', strength: 0 };
  }
  
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;
  if (password.length >= 16) strength += 1;
  
  if (strength < 3) {
    return { valid: false, error: 'Password is too weak', strength };
  }
  
  return { valid: true, strength };
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: 'Name is required' };
  }
  
  if (name.length > 50) {
    return { valid: false, error: 'Name must be no more than 50 characters' };
  }
  
  if (!/^[a-zA-Zа-яА-Я\s'-]+$/.test(name)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { valid: true };
}

// Функция для предотвращения CSRF атак
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Функция для проверки CSRF токена
export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

// Функция для ограничения частоты запросов на клиенте
export class ClientRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) { // 5 попыток за минуту
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

// Глобальный rate limiter для клиента
export const clientRateLimiter = new ClientRateLimiter(10, 60000); // 10 попыток за минуту