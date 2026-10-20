'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Monthly',
    price: '$29',
    period: '/month',
    description: 'Perfect for small businesses getting started',
    features: [
      'All core features',
      '1 branch',
      '2 POS terminals',
      '5 staff accounts',
      '1,000 products',
      'Email support',
      'Basic reports',
    ],
    popular: false,
    cta: 'Start Monthly',
  },
  {
    name: 'Half-Yearly',
    price: '$149',
    period: '/6 months',
    description: 'Best value for growing businesses',
    features: [
      'All core features',
      '3 branches',
      '10 POS terminals',
      '30 staff accounts',
      '10,000 products',
      'Priority support',
      'API access',
      'Advanced reports',
      'Custom branding',
    ],
    popular: true,
    cta: 'Start Half-Yearly',
    savings: 'Save 14%',
  },
  {
    name: 'Yearly',
    price: '$249',
    period: '/year',
    description: 'For established businesses with multiple locations',
    features: [
      'All core features',
      '5 branches',
      'Unlimited terminals',
      'Unlimited staff',
      'Unlimited products',
      '24/7 support',
      'API access',
      'Custom integrations',
      'Dedicated manager',
      'Priority updates',
    ],
    popular: false,
    cta: 'Start Yearly',
    savings: 'Save 28%',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary-100/40 to-transparent rounded-full" />
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
            <span className="text-gray-900">Simple,</span>{' '}
            <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-6 py-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center space-x-2 shadow-lg">
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="text-sm font-semibold text-white">Most Popular</span>
                  </div>
                </div>
              )}

              <div className={`h-full p-8 rounded-2xl ${plan.popular ? 'bg-white border-2 border-primary-500 shadow-2xl shadow-primary-500/20' : 'bg-white border border-gray-200 hover:shadow-xl'} transition-all duration-300`}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      {plan.savings}
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/signup?plan=${plan.name.toLowerCase()}`}
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Need a custom plan?{' '}
            <Link href="/support" className="text-primary-600 hover:text-primary-700 transition-colors font-medium">
              Contact our sales team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
