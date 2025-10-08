import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateReferralCode(): string {
  return nanoid(8);
}