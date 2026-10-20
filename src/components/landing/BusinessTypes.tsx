'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, UtensilsCrossed, Scissors, Calendar, GraduationCap, Building2, ArrowRight } from 'lucide-react'

const businessTypes = [
  {
    icon: ShoppingBag,
    title: 'Retail & Grocery',
    description: 'POS, inventory, barcode scanning, stock alerts, purchase orders',
    color: 'from-blue-500 to-cyan-500',
    features: ['Fast checkout', 'Barcode scanning', 'Stock management', 'Multi-branch'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurant & Cafe',
    description: 'Table management, kitchen display, menu modifiers, delivery tracking',
    color: 'from-orange-500 to-red-500',
    features: ['Dine-in orders', 'Kitchen display', 'Menu combos', 'Delivery tracking'],
  },
  {
    icon: Scissors,
    title: 'Barber & Beauty Salon',
    description: 'Appointments, staff scheduling, commissions, memberships, gift cards',
    color: 'from-pink-500 to-purple-500',
    features: ['Booking system', 'Staff commissions', 'Memberships', 'Service packages'],
  },
  {
    icon: Calendar,
    title: 'Hall & Event Management',
    description: 'Event booking, contracts, quotations, vendor management, scheduling',
    color: 'from-green-500 to-emerald-500',
    features: ['Booking calendar', 'Contracts', 'Vendor management', 'Event scheduling'],
  },
  {
    icon: GraduationCap,
    title: 'School & Academy',
    description: 'Admissions, attendance, examinations, fees, parent portal, reports',
    color: 'from-indigo-500 to-blue-500',
    features: ['Student management', 'Fee system', 'Attendance', 'Parent portal'],
  },
  {
    icon: Building2,
    title: 'ERP & Wholesale',
    description: 'Multi-warehouse, purchase orders, accounts, ledgers, analytics',
    color: 'from-purple-500 to-pink-500',
    features: ['Multi-warehouse', 'Purchase orders', 'Accounts', 'Analytics'],
  },
]

export default function BusinessTypes() {
  return (
    <section id="businesses" className="relative py-32 overflow-hidden bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">One Platform,</span>
            <br />
            <span className="gradient-text">Every Business Type</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Purpose-built solutions for different industries, all powered by the same robust platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessTypes.map((business, idx) => (
            <motion.div
              key={business.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="h-full p-8 rounded-2xl bg-white border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <business.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{business.title}</h3>
                <p className="text-gray-600 mb-6">{business.description}</p>
                <ul className="space-y-2 mb-6">
                  {business.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?category=${business.title.toLowerCase().split(' ')[0]}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors font-medium group/link"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
