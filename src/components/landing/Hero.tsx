'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, ShoppingBag, UtensilsCrossed, Scissors, Building2 } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-200/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-100/50 to-transparent rounded-full" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-600">Trusted by 10,000+ businesses worldwide</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="block text-gray-900">All Your Businesses.</span>
            <span className="block gradient-text">One Powerful Platform.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            The complete POS & management system for retail, restaurants, salons, events, schools, and wholesale businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/signup"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold text-lg shadow-xl shadow-primary-500/25 flex items-center space-x-2 text-white"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-md flex items-center space-x-2 text-gray-700">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </motion.div>

          {/* Business type icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12"
          >
            {[
              { icon: ShoppingBag, label: 'Retail' },
              { icon: UtensilsCrossed, label: 'Restaurant' },
              { icon: Scissors, label: 'Salon' },
              { icon: Building2, label: 'Enterprise' },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + idx * 0.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <item.icon className="w-8 h-8 text-primary-500" />
                </div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '10K+', label: 'Active Businesses' },
              { value: '50M+', label: 'Transactions Processed' },
              { value: '99.9%', label: 'Uptime Guaranteed' },
              { value: '24/7', label: 'Expert Support' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + idx * 0.1 }}
                className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
