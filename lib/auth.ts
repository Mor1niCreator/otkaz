import { compare, hash } from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateReferralCode(): string {
  return nanoid(8).toUpperCase();
}