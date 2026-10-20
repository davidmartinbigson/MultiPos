'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative py-32 overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-gradient-radial from-primary-100/50 via-accent-100/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
            <Zap className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-gray-600">Start your free trial today</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Ready to Transform</span>
            <br />
            <span className="gradient-text">Your Business?</span>
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of businesses already using MultiPOS to streamline operations, boost sales, and grow faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all duration-300 font-semibold text-lg shadow-xl shadow-primary-500/25 flex items-center space-x-2 text-white"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/support"
              className="px-8 py-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-md text-gray-700"
            >
              Talk to Sales
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
