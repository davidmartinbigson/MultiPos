'use client'

import Link from 'next/link'
import { Zap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">MultiPOS</span>
            </Link>
            <p className="text-gray-600 mb-6">
              The complete POS & management platform for all your businesses.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Facebook className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Twitter className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Instagram className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Linkedin className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link></li>
              <li><Link href="#businesses" className="text-gray-600 hover:text-gray-900 transition-colors">Solutions</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors">Support</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">support@multipos.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">123 Business Ave, Suite 100<br />San Francisco, CA 94107</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} MultiPOS. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
