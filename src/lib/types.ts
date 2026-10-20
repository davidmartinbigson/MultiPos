// Prisma types for use when PrismaClient is not available
export interface User {
  id: string
  email: string
  password: string
  name: string | null
  role: string
  businessType: string | null
  businessName: string | null
  isActive: boolean
  licenseKey: string | null
  licenseExpiry: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}
