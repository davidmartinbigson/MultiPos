'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Key, Plus, Search, Filter, Download, Eye, Edit, Trash2,
  RefreshCw, Shield, AlertCircle, Check, Clock, XCircle, Copy
} from 'lucide-react'

const licenses = [
  {
    id: 1,
    key: 'MP-A3X7-K9B2-M4N8-P5Q1',
    customer: 'Ahmed Khan',
    business: 'Fresh Mart Grocery',
    product: 'Retail POS',
    plan: 'Half-Yearly',
    status: 'active',
    activatedAt: '2024-01-15',
    expiresAt: '2024-07-15',
    branches: 3,
    terminals: 10,
  },
  {
    id: 2,
    key: 'MP-B8Y2-L5C7-N1R3-T6W4',
    customer: 'Sarah Ali',
    business: 'La Bella Salon',
    product: 'Salon POS',
    plan: 'Yearly',
    status: 'active',
    activatedAt: '2024-02-01',
    expiresAt: '2025-02-01',
    branches: 1,
    terminals: 5,
  },
  {
    id: 3,
    key: 'MP-C4Z9-D2E8-Q7S5-V3X6',
    customer: 'Omar Farooq',
    business: 'Spice Kitchen',
    product: 'Restaurant POS',
    plan: 'Monthly',
    status: 'expired',
    activatedAt: '2024-03-10',
    expiresAt: '2024-04-10',
    branches: 1,
    terminals: 2,
  },
  {
    id: 4,
    key: 'MP-D1W6-F3G4-R9T2-Y8Z5',
    customer: 'Bilal Ahmed',
    business: 'Royal Event Hall',
    product: 'Event Management',
    plan: 'Quarterly',
    status: 'active',
    activatedAt: '2024-04-01',
    expiresAt: '2024-07-01',
    branches: 1,
    terminals: 3,
  },
  {
    id: 5,
    key: 'MP-E7H3-J5K1-U4V8-B2N6',
    customer: 'Fatima Noor',
    business: 'Bright Future Academy',
    product: 'School ERP',
    plan: 'Yearly',
    status: 'suspended',
    activatedAt: '2024-01-20',
    expiresAt: '2025-01-20',
    branches: 2,
    terminals: 8,
  },
]

export default function LicensesPage() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredLicenses = licenses.filter(l => {
    const matchesSearch = l.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.business.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="w-3 h-3" />
      case 'expired': return <Clock className="w-3 h-3" />
      case 'suspended': return <XCircle className="w-3 h-3" />
      default: return <AlertCircle className="w-3 h-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'expired': return 'bg-yellow-500/20 text-yellow-400'
      case 'suspended': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
              <Key className="w-7 h-7 text-primary-400" />
              <span>License Management</span>
            </h1>
            <p className="text-gray-400 mt-1">Generate, manage, and track customer licenses</p>
          </div>
          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all font-semibold text-white flex items-center space-x-2 glow"
          >
            <Plus className="w-5 h-5" />
            <span>Generate License</span>
          </button>
        </div>

        {/* License Generator Modal */}
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl glass-card p-8 gradient-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Customer License</h2>
              <button
                onClick={() => setShowGenerator(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email / Account ID</label>
                <input
                  type="email"
                  placeholder="customer@example.com"
                  className="w-full px-4 py-3 rounded-xl glass bg-white border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product / System</label>
                <select className="w-full px-4 py-3 rounded-xl glass bg-white border border-white/10 text-white focus:outline-none focus:border-primary-500/50">
                  <option>Retail & Grocery POS</option>
                  <option>Restaurant & Cafe POS</option>
                  <option>Barber & Beauty Salon POS</option>
                  <option>Hall & Event Management</option>
                  <option>School & Academy ERP</option>
                  <option>ERP & Wholesale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                <select className="w-full px-4 py-3 rounded-xl glass bg-white border border-white/10 text-white focus:outline-none focus:border-primary-500/50">
                  <option>Monthly — 30 days ($29)</option>
                  <option>Quarterly — 90 days ($79)</option>
                  <option>Half-Yearly — 180 days ($149)</option>
                  <option>Yearly — 365 days ($249)</option>
                  <option>Lifetime — No expiry ($999)</option>
                  <option>Custom duration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Branches</label>
                <select className="w-full px-4 py-3 rounded-xl glass bg-white border border-white/10 text-white focus:outline-none focus:border-primary-500/50">
                  <option>1 Branch</option>
                  <option>2 Branches</option>
                  <option>3 Branches</option>
                  <option>5 Branches</option>
                  <option>10 Branches</option>
                  <option>Unlimited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">POS Terminals</label>
                <select className="w-full px-4 py-3 rounded-xl glass bg-white border border-white/10 text-white focus:outline-none focus:border-primary-500/50">
                  <option>1 Terminal</option>
                  <option>2 Terminals</option>
                  <option>5 Terminals</option>
                  <option>10 Terminals</option>
                  <option>Unlimited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Starts</label>
                <select className="w-full px-4 py-3 rounded-xl glass bg-white border border-white/10 text-white focus:outline-none focus:border-primary-500/50">
                  <option>On first activation</option>
                  <option>On admin approval</option>
                  <option>Custom date</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowGenerator(false)}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all text-gray-700"
              >
                Cancel
              </button>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all font-semibold text-white flex items-center space-x-2 glow">
                <Shield className="w-5 h-5" />
                <span>Generate License Key</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search licenses..."
                className="pl-10 pr-4 py-2 rounded-lg glass bg-white border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              {['all', 'active', 'expired', 'suspended'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Licenses Table */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">License Key</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Expires</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLicenses.map((license, idx) => (
                  <motion.tr
                    key={license.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <code className="text-primary-400 font-mono text-sm">{license.key}</code>
                        <button className="p-1 rounded hover:bg-white/10 transition-colors">
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 font-medium">{license.customer}</p>
                        <p className="text-gray-400 text-xs">{license.business}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{license.product}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{license.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(license.status)}`}>
                        {getStatusIcon(license.status)}
                        <span>{license.status.charAt(0).toUpperCase() + license.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 text-sm">{license.expiresAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Renew">
                          <RefreshCw className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
