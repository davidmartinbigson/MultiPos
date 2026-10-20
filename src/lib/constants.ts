export type BusinessCategory =
  | 'retail'
  | 'restaurant'
  | 'barber'
  | 'hall'
  | 'school'
  | 'erp'

export interface BusinessCategoryInfo {
  id: BusinessCategory
  name: string
  description: string
  icon: string
  features: string[]
  modules: string[]
}

export const BUSINESS_CATEGORIES: BusinessCategoryInfo[] = [
  {
    id: 'retail',
    name: 'Retail & Grocery',
    description: 'Perfect for shops, supermarkets, hardware stores, and retail businesses',
    icon: 'ShoppingBag',
    features: [
      'Fast POS checkout with barcode scanning',
      'Inventory management with stock alerts',
      'Purchase orders and supplier management',
      'Customer loyalty programs',
      'Multi-branch support',
    ],
    modules: ['pos', 'inventory', 'customers', 'suppliers', 'reports', 'branches'],
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Cafe',
    description: 'Designed for restaurants, cafes, cloud kitchens, and food businesses',
    icon: 'UtensilsCrossed',
    features: [
      'Table management and dine-in orders',
      'Kitchen display system',
      'Menu modifiers and combos',
      'Delivery tracking',
      'Ingredient costing',
    ],
    modules: ['pos', 'tables', 'kitchen', 'delivery', 'inventory', 'reports'],
  },
  {
    id: 'barber',
    name: 'Barber & Beauty Salon',
    description: 'Ideal for barber shops, hair salons, beauty parlors, and spas',
    icon: 'Scissors',
    features: [
      'Appointment booking system',
      'Staff schedules and commissions',
      'Service packages and memberships',
      'Customer profiles with history',
      'Gift cards and loyalty points',
    ],
    modules: ['appointments', 'staff', 'services', 'customers', 'pos', 'reports'],
  },
  {
    id: 'hall',
    name: 'Hall & Event Management',
    description: 'Built for banquet halls, event venues, and wedding planners',
    icon: 'Calendar',
    features: [
      'Hall availability calendar',
      'Event booking and contracts',
      'Quotation and advance payments',
      'Vendor management',
      'Event-day scheduling',
    ],
    modules: ['bookings', 'contracts', 'payments', 'vendors', 'events', 'reports'],
  },
  {
    id: 'school',
    name: 'School & Academy',
    description: 'Complete solution for schools, colleges, academies, and training centers',
    icon: 'GraduationCap',
    features: [
      'Student admission management',
      'Class and timetable management',
      'Attendance and examination system',
      'Fee management with vouchers',
      'Parent portal and notifications',
    ],
    modules: ['students', 'classes', 'attendance', 'exams', 'fees', 'reports'],
  },
  {
    id: 'erp',
    name: 'ERP & Wholesale',
    description: 'Comprehensive ERP for wholesale, distribution, and general business',
    icon: 'Building2',
    features: [
      'Multi-warehouse management',
      'Purchase and sales orders',
      'Accounts receivable/payable',
      'Customer and supplier ledgers',
      'Consolidated analytics',
    ],
    modules: ['inventory', 'purchases', 'sales', 'accounts', 'reports', 'branches'],
  },
]

export interface SubscriptionPlan {
  id: string
  name: string
  duration: number
  durationUnit: 'days' | 'months' | 'lifetime'
  price: number
  currency: string
  features: string[]
  limits: {
    branches: number
    terminals: number
    staff: number
    products: number
  }
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    duration: 30,
    durationUnit: 'days',
    price: 29,
    currency: 'USD',
    features: ['All core features', '1 branch', '2 POS terminals', '5 staff accounts', 'Email support'],
    limits: { branches: 1, terminals: 2, staff: 5, products: 1000 },
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    duration: 90,
    durationUnit: 'days',
    price: 79,
    currency: 'USD',
    features: ['All core features', '2 branches', '5 POS terminals', '15 staff accounts', 'Priority support'],
    limits: { branches: 2, terminals: 5, staff: 15, products: 5000 },
    popular: false,
  },
  {
    id: 'half-yearly',
    name: 'Half-Yearly',
    duration: 180,
    durationUnit: 'days',
    price: 149,
    currency: 'USD',
    features: ['All core features', '3 branches', '10 POS terminals', '30 staff accounts', 'Priority support', 'API access'],
    limits: { branches: 3, terminals: 10, staff: 30, products: 10000 },
    popular: true,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    duration: 365,
    durationUnit: 'days',
    price: 249,
    currency: 'USD',
    features: ['All core features', '5 branches', 'Unlimited terminals', 'Unlimited staff', '24/7 support', 'API access', 'Custom integrations'],
    limits: { branches: 5, terminals: -1, staff: -1, products: -1 },
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    duration: -1,
    durationUnit: 'lifetime',
    price: 999,
    currency: 'USD',
    features: ['All features forever', 'Unlimited branches', 'Unlimited terminals', 'Unlimited staff', '24/7 premium support', 'Priority updates', 'Dedicated account manager'],
    limits: { branches: -1, terminals: -1, staff: -1, products: -1 },
  },
]

export interface License {
  id: string
  key: string
  customerId: string
  productId: string
  planId: string
  status: 'active' | 'expired' | 'suspended' | 'pending'
  activatedAt?: string
  expiresAt?: string
  limits: {
    branches: number
    terminals: number
    staff: number
    products: number
  }
}

export interface User {
  id: string
  email: string
  name: string
  role: 'master_admin' | 'business_owner' | 'staff'
  organizationId?: string
  avatar?: string
}

export interface Organization {
  id: string
  name: string
  legalName?: string
  category: BusinessCategory
  country: string
  currency: string
  timezone: string
  ownerId: string
  status: 'pending' | 'active' | 'suspended'
  createdAt: string
}
