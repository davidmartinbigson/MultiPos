'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  Shield,
  Zap,
  Globe,
  Users,
  CreditCard,
  Wifi,
  Cloud,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast POS',
    description: 'Process sales in seconds with our optimized checkout system. Works offline and syncs automatically.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time reports, insights, and business intelligence to make data-driven decisions.',
    color: 'from-primary-400 to-primary-600',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, role-based access control, and complete audit trails.',
    color: 'from-green-400 to-emerald-600',
  },
  {
    icon: Globe,
    title: 'Multi-Branch Support',
    description: 'Manage unlimited branches and warehouses from a single dashboard with real-time sync.',
    color: 'from-accent-400 to-accent-600',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Complete CRM with loyalty programs, purchase history, and personalized marketing.',
    color: 'from-pink-400 to-rose-600',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    description: 'Accept cash, cards, mobile payments, and split payments with automatic reconciliation.',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    icon: Wifi,
    title: 'Offline Mode',
    description: 'Continue selling even without internet. All data syncs automatically when connection returns.',
    color: 'from-indigo-400 to-purple-600',
  },
  {
    icon: Cloud,
    title: 'Cloud Backup',
    description: 'Automatic backups, secure cloud storage, and instant data recovery when you need it.',
    color: 'from-teal-400 to-cyan-600',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary-100/30 rounded-full blur-3xl" />
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
            <span className="gradient-text">Powerful Features</span>
            <br />
            <span className="text-gray-900">Built for Growth</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to run and scale your business, from day one to enterprise level.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="h-full p-8 rounded-2xl bg-white border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
