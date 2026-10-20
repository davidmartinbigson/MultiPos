'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Zap, Check, Star, HelpCircle } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const plans = [
  {
    name: 'Monthly',
    price: 29,
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
    name: 'Quarterly',
    price: 79,
    period: '/quarter',
    description: 'Great for growing businesses',
    features: [
      'All core features',
      '2 branches',
      '5 POS terminals',
      '15 staff accounts',
      '5,000 products',
      'Priority support',
      'Advanced reports',
      'Custom branding',
    ],
    popular: false,
    cta: 'Start Quarterly',
    savings: 'Save 9%',
  },
  {
    name: 'Half-Yearly',
    price: 149,
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
    price: 249,
    period: '/year',
    description: 'For established businesses',
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
  {
    name: 'Lifetime',
    price: 999,
    period: 'once',
    description: 'One-time payment, forever access',
    features: [
      'All features forever',
      'Unlimited branches',
      'Unlimited terminals',
      'Unlimited staff',
      'Unlimited products',
      '24/7 premium support',
      'Priority updates',
      'Dedicated account manager',
      'Custom development',
      'White-label option',
    ],
    popular: false,
    cta: 'Get Lifetime Access',
    savings: 'Best Value',
  },
]

const faqs = [
  { q: 'Can I try before buying?', a: 'Yes! Every plan comes with a 14-day free trial. No credit card required.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Absolutely. You can change your plan at any time. The price difference will be prorated.' },
  { q: 'Is there a setup fee?', a: 'No setup fees. You only pay for your subscription plan.' },
  { q: 'What happens when my subscription expires?', a: 'Your data remains safe. You can renew at any time. After 30 days of expiry, features are limited.' },
  { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee on all plans.' },
  { q: 'Can I get a custom plan?', a: 'Yes! Contact our sales team for custom pricing tailored to your needs.' },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="relative bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-primary-100/40 to-transparent rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Simple,</span>{' '}
              <span className="gradient-text">Transparent Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business. All plans include core features with a 14-day free trial.
            </p>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-full mb-20">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center space-x-1 shadow-lg">
                      <Star className="w-3 h-3 text-white fill-white" />
                      <span className="text-xs font-semibold text-white">Most Popular</span>
                    </div>
                  </div>
                )}

                <div className={`h-full p-6 rounded-2xl ${plan.popular ? 'bg-white border-2 border-primary-500 shadow-2xl shadow-primary-500/20' : 'bg-white border border-gray-200 hover:shadow-xl'} transition-all duration-300`}>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-gray-600 text-xs">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold gradient-text">${plan.price}</span>
                      <span className="text-gray-600 text-sm">{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        {plan.savings}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/signup?plan=${plan.name.toLowerCase()}`}
                    className={`block w-full py-2.5 rounded-xl font-semibold text-center text-sm transition-all duration-300 ${
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

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between"
                  >
                    <span className="text-gray-900 font-medium">{faq.q}</span>
                    <HelpCircle className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
