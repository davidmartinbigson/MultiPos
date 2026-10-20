import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from './db';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Password verification
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId: string, email: string, role: string): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-demo-only';
  return jwt.sign(
    { userId, email, role },
    secret,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-demo-only';
    return jwt.verify(token, secret) as any;
  } catch (error) {
    return null;
  }
}

// Set session cookie
export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Get current user from session
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) return null;
    
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
    });
    
    // If user exists in DB, return DB data
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessType: user.businessType,
        businessName: user.businessName,
        licenseKey: user.licenseKey,
        licenseExpiry: user.licenseExpiry,
      };
    }
    
    // If user doesn't exist in DB (in-memory reset), trust the JWT data
    // This is important for admin access even when DB resets
    return {
      id: decoded.userId,
      email: decoded.email,
      name: null,
      role: decoded.role,
      businessType: null,
      businessName: null,
      licenseKey: null,
      licenseExpiry: null,
    };
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

// Clear session
export function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete('auth_token');
}

// Generate license key
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [];
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return `MP-${segments.join('-')}`;
}

// Check if license is valid
export function isLicenseValid(licenseExpiry: Date | null): boolean {
  if (!licenseExpiry) return false;
  return new Date(licenseExpiry) > new Date();
}
