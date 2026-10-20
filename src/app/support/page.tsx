'use client'

import { motion } from 'framer-motion'
import {
  Zap, Book, MessageSquare, HelpCircle, FileText, Mail,
  Phone, MapPin, ArrowRight, Search
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const supportCategories = [
  { icon: Book, title: 'Documentation', description: 'Complete guides and tutorials', link: '#', color: 'from-primary-400 to-primary-600' },
  { icon: MessageSquare, title: 'Live Chat', description: 'Chat with our support team', link: '#', color: 'from-green-400 to-emerald-500' },
  { icon: HelpCircle, title: 'FAQ', description: 'Common questions answered', link: '#', color: 'from-accent-400 to-accent-600' },
  { icon: FileText, title: 'Submit Ticket', description: 'Get help from our team', link: '#', color: 'from-yellow-400 to-orange-500' },
]

const popularArticles = [
  'Getting Started with MultiPOS',
  'How to Set Up Your First Store',
  'Managing Inventory & Stock',
  'Processing Sales & Refunds',
  'Staff Management & Permissions',
  'Reports & Analytics Guide',
  'License Activation Help',
  'Payment Gateway Integration',
]

export default function SupportPage() {
  return (
    <div className="relative bg-gray-50">
      <Navbar />

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
              <span className="text-gray-900">How Can We</span>{' '}
              <span className="gradient-text">Help You?</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Find answers, guides, and support from our team.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, guides, tutorials..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-lg shadow-lg"
              />
            </div>
          </motion.div>

          {/* Support Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {supportCategories.map((cat, idx) => (
              <motion.a
                key={cat.title}
                href={cat.link}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.title}</h3>
                <p className="text-gray-600 text-sm">{cat.description}</p>
              </motion.a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Articles */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl bg-white border border-gray-200 p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
              <div className="space-y-3">
                {popularArticles.map((article) => (
                  <a
                    key={article}
                    href="#"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{article}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-2xl bg-white border border-gray-200 p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-medium">Email Support</h3>
                    <p className="text-gray-600 text-sm">support@multipos.com</p>
                    <p className="text-gray-500 text-xs mt-1">Response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-medium">Phone Support</h3>
                    <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                    <p className="text-gray-500 text-xs mt-1">Mon-Fri, 9AM - 6PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-medium">Office</h3>
                    <p className="text-gray-600 text-sm">123 Business Ave, Suite 100</p>
                    <p className="text-gray-600 text-sm">San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-gray-900 font-medium mb-4">System Status</h3>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-600 font-medium">All Systems Operational</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
