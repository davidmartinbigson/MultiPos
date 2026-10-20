// Strong License Key System
// Format: MP-XXXX-XXXX-XXXX-XXXX (cryptographically secure)

export function generateStrongLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (I, O, 0, 1)
  const segments = [];

  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      // Use crypto.getRandomValues for secure randomness
      const randomBuffer = new Uint8Array(1);
      if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
        globalThis.crypto.getRandomValues(randomBuffer);
      } else {
        randomBuffer[0] = Math.floor(Math.random() * 256);
      }
      const index = randomBuffer[0] % chars.length;
      segment += chars.charAt(index);
    }
    segments.push(segment);
  }

  return `MP-${segments.join('-')}`;
}

export function validateLicenseKey(key: string): boolean {
  // Validate format: MP-XXXX-XXXX-XXXX-XXXX
  const pattern = /^MP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(key);
}

export function normalizeLicenseKey(key: string): string {
  // Convert to uppercase and remove extra spaces
  return key.toUpperCase().trim().replace(/\s+/g, '');
}

export interface LicenseDetails {
  key: string;
  customerEmail: string;
  productName: string;
  planType: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly' | 'lifetime' | 'custom';
  startDate: Date;
  expiryDate: Date | null; // null for lifetime
  maxBranches: number;
  maxTerminals: number;
  maxStaff: number;
  isActive: boolean;
}

export function createLicenseDetails(
  key: string,
  customerEmail: string,
  productName: string,
  planType: LicenseDetails['planType'],
  days: number | 'lifetime',
  maxBranches: number,
  maxTerminals: number,
  maxStaff: number
): LicenseDetails {
  const startDate = new Date();
  const expiryDate = days === 'lifetime'
    ? null
    : new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    key,
    customerEmail,
    productName,
    planType,
    startDate,
    expiryDate,
    maxBranches,
    maxTerminals,
    maxStaff,
    isActive: true,
  };
}

export function isLicenseExpired(license: LicenseDetails): boolean {
  if (license.planType === 'lifetime') return false;
  if (!license.expiryDate) return true;
  return new Date(license.expiryDate) < new Date();
}

export function getDaysRemaining(license: LicenseDetails): number | null {
  if (license.planType === 'lifetime') return null;
  if (!license.expiryDate) return 0;

  const now = new Date();
  const expiry = new Date(license.expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
