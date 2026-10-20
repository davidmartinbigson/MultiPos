'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Zap, LayoutDashboard, Users, Key, CreditCard, Package, Building2,
  FileText, BarChart3, Shield, Settings, Bell, Search, LogOut,
  TrendingUp, TrendingDown, DollarSign, UserCheck, Clock, AlertTriangle,
  ChevronRight, Plus, Eye, MoreVertical, Filter, Copy, Check, Loader2, RefreshCw,
  Edit, Trash2, Download, Upload, ArrowUpRight, ArrowDownRight, Activity,
  ShoppingBag, CheckCircle2, XCircle, AlertCircle, Gift, Star, Crown,
  Save, Globe, Mail, Phone, Calendar, Tag, Layers, Eye as EyeIcon, Play, Pause
} from 'lucide-react'

interface Customer {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessType: string;
  isActive: boolean;
  licenseKey: string | null;
  licenseExpiry: string | null;
  createdAt: string;
  country?: string;
  currency?: string;
  phone?: string;
  ownerPhone?: string;
}

const TABS = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'customers', icon: Users, label: 'Customers' },
  { id: 'licenses', icon: Key, label: 'Licenses' },
  { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { id: 'products', icon: Package, label: 'Products' },
  { id: 'reports', icon: BarChart3, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingKey, setGeneratingKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [licenseModal, setLicenseModal] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('half-yearly')
  const [customDays, setCustomDays] = useState(30)
  const [customKey, setCustomKey] = useState('')
  const [useAutoKey, setUseAutoKey] = useState(true)
  const [keyPreview, setKeyPreview] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.users) {
        setCustomers(data.users)
      } else {
        setCustomers([])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateLicenseKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const segments = []
    for (let i = 0; i < 4; i++) {
      let segment = ''
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      segments.push(segment)
    }
    return `MP-${segments.join('-')}`
  }

  const openLicenseModal = (customerId?: string) => {
    setSelectedCustomerId(customerId || '')
    setSelectedPlan('half-yearly')
    setCustomDays(30)
    setCustomKey('')
    setUseAutoKey(true)
    setKeyPreview(generateLicenseKey())
    setLicenseModal(true)
  }

  const handleActivate = (customer: Customer) => {
    openLicenseModal(customer.id)
  }

  const getDaysForPlan = () => {
    switch (selectedPlan) {
      case 'monthly': return 30
      case 'quarterly': return 90
      case 'half-yearly': return 180
      case 'yearly': return 365
      case 'custom': return customDays
      default: return 30
    }
  }

  const getPlanPrice = () => {
    switch (selectedPlan) {
      case 'monthly': return 29
      case 'quarterly': return 79
      case 'half-yearly': return 149
      case 'yearly': return 249
      case 'custom': return 0
      default: return 0
    }
  }

  const confirmGenerateLicense = async () => {
    if (!selectedCustomerId) { alert('Please select a customer'); return }
    setGeneratingKey(selectedCustomerId)
    try {
      const licenseKey = useAutoKey ? keyPreview : customKey.trim().toUpperCase()
      if (!useAutoKey) {
        const pattern = /^MP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
        if (!pattern.test(licenseKey)) {
          alert('Invalid key format. Use MP-XXXX-XXXX-XXXX-XXXX')
          setGeneratingKey(null)
          return
        }
      }
      const days = getDaysForPlan()
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + days)

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedCustomerId,
          licenseKey,
          licenseExpiry: expiryDate.toISOString(),
          isActive: true,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate license')
      setLicenseModal(false)
      await fetchCustomers()
    } catch (error) {
      alert('Failed to generate license')
    } finally {
      setGeneratingKey(null)
    }
  }

  const handleSuspend = async (customer: Customer) => {
    if (!confirm(`Suspend ${customer.businessName || customer.name}?`)) return
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: customer.id, isActive: false }),
      })
      if (!response.ok) throw new Error('Failed to suspend')
      await fetchCustomers()
    } catch (error) {
      alert('Failed to suspend customer')
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !searchQuery ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (statusFilter === 'all') return matchesSearch
    if (statusFilter === 'active') return matchesSearch && c.isActive && c.licenseKey
    if (statusFilter === 'pending') return matchesSearch && (!c.isActive || !c.licenseKey)
    return matchesSearch
  })

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.isActive && c.licenseKey).length,
    pending: customers.filter(c => !c.isActive || !c.licenseKey).length,
    revenue: customers.filter(c => c.isActive).length * 49,
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-gray-200 fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 block leading-tight">Master Admin</span>
              <span className="text-xs text-gray-500">Platform Control</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              MA
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">Master Admin</p>
              <p className="text-gray-500 text-xs">admin@multipos.com</p>
            </div>
          </div>
          <Link href="/login" className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-72">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab}</h1>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>System Online</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 w-64 text-sm"
                />
              </div>
              <button className="relative p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Customers', value: stats.total, icon: Users, color: 'from-blue-400 to-blue-600', change: '+12%' },
                      { label: 'Active Licenses', value: stats.active, icon: CheckCircle2, color: 'from-green-400 to-emerald-500', change: '+8%' },
                      { label: 'Pending Approval', value: stats.pending, icon: Clock, color: 'from-yellow-400 to-orange-500', change: '+3' },
                      { label: 'Revenue (Monthly)', value: `$${stats.revenue}`, icon: DollarSign, color: 'from-purple-400 to-purple-600', change: '+18%' },
                    ].map((stat, idx) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="flex items-center text-sm font-semibold text-green-600">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity + Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Signups</h3>
                      {customers.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No customers yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {customers.slice(0, 5).map((c) => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                  {(c.name || c.email || '?').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-gray-900 font-semibold text-sm">{c.businessName || c.name || 'Unknown'}</p>
                                  <p className="text-gray-500 text-xs">{c.email}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                c.isActive && c.licenseKey ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {c.isActive && c.licenseKey ? 'Active' : 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button onClick={() => setActiveTab('customers')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors">
                          <Users className="w-5 h-5" />
                          <span>Manage Customers</span>
                        </button>
                        <button onClick={() => setActiveTab('licenses')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors">
                          <Key className="w-5 h-5" />
                          <span>View Licenses</span>
                        </button>
                        <button onClick={() => setActiveTab('reports')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors">
                          <BarChart3 className="w-5 h-5" />
                          <span>View Reports</span>
                        </button>
                        <button onClick={() => setActiveTab('settings')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors">
                          <Settings className="w-5 h-5" />
                          <span>Settings</span>
                        </button>
                      </div>

                      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white">
                        <p className="font-bold text-sm mb-1">Platform Status</p>
                        <p className="text-xs opacity-90">All systems operational</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="text-xs">99.9% uptime</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOMERS TAB */}
              {activeTab === 'customers' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">All Customers</h3>
                      <p className="text-sm text-gray-500">Manage licenses, approvals and suspensions</p>
                    </div>
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <button
                        onClick={openLicenseModal}
                        className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold shadow-lg transition-all"
                      >
                        <Key className="w-4 h-4" />
                        <span>Generate License</span>
                      </button>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-red-500"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                      </select>
                      <button
                        onClick={fetchCustomers}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="p-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-3" />
                      <p className="text-gray-500">Loading customers...</p>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="p-12 text-center">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-900 font-medium mb-1">No customers found</p>
                      <p className="text-gray-500 text-sm">Customers will appear here after signup</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Customer</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Email</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">License Key</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow">
                                    {(customer.name || customer.email || '?').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-gray-900 font-semibold text-sm">{customer.businessName || customer.name || 'Unknown'}</p>
                                    <p className="text-gray-500 text-xs">{customer.businessType || 'Retail'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 text-sm">{customer.email}</td>
                              <td className="px-6 py-4">
                                {customer.licenseKey ? (
                                  <div className="flex items-center space-x-2">
                                    <code className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs font-mono font-semibold">
                                      {customer.licenseKey}
                                    </code>
                                    <button
                                      onClick={() => handleCopyKey(customer.licenseKey!)}
                                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                                      title="Copy"
                                    >
                                      {copiedKey === customer.licenseKey ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Copy className="w-4 h-4 text-gray-400" />
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs italic">Not assigned</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {customer.isActive && customer.licenseKey ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  {!customer.licenseKey && (
                                    <button
                                      onClick={() => handleActivate(customer)}
                                      disabled={generatingKey === customer.id}
                                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow"
                                    >
                                      {generatingKey === customer.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Key className="w-4 h-4" />
                                      )}
                                      <span>Activate</span>
                                    </button>
                                  )}
                                  {customer.isActive && (
                                    <button
                                      onClick={() => handleSuspend(customer)}
                                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold transition-colors"
                                    >
                                      <Pause className="w-4 h-4" />
                                      <span>Suspend</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* LICENSES TAB */}
              {activeTab === 'licenses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">License Management</h3>
                      <p className="text-sm text-gray-500">Generate and manage customer licenses</p>
                    </div>
                    <button
                      onClick={openLicenseModal}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold shadow-lg transition-all"
                    >
                      <Key className="w-4 h-4" />
                      <span>Generate License</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Total Licenses', value: customers.filter(c => c.licenseKey).length, icon: Key, color: 'from-blue-400 to-blue-600' },
                      { label: 'Active Licenses', value: customers.filter(c => c.isActive && c.licenseKey).length, icon: CheckCircle2, color: 'from-green-400 to-emerald-500' },
                      { label: 'Expired Licenses', value: customers.filter(c => c.licenseKey && !c.isActive).length, icon: XCircle, color: 'from-red-400 to-red-600' },
                    ].map((stat, idx) => (
                      <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <stat.icon className="w-7 h-7 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">All License Keys</h3>
                    {customers.filter(c => c.licenseKey).length === 0 ? (
                      <div className="text-center py-8">
                        <Key className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No licenses issued yet</p>
                        <p className="text-gray-400 text-sm mt-1">Activate customers to generate license keys</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customers.filter(c => c.licenseKey).map((c) => (
                          <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                {(c.name || c.email || '?').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-gray-900 font-semibold">{c.businessName || c.name}</p>
                                <p className="text-gray-500 text-sm">{c.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <code className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm font-mono font-bold shadow-sm">
                                {c.licenseKey}
                              </code>
                              <button
                                onClick={() => handleCopyKey(c.licenseKey!)}
                                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                              >
                                {copiedKey === c.licenseKey ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                              </button>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {c.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBSCRIPTIONS TAB */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { name: 'Monthly', price: '$29', users: customers.filter(c => c.isActive).length, color: 'from-blue-500 to-cyan-500', icon: Calendar },
                      { name: 'Quarterly', price: '$79', users: 0, color: 'from-purple-500 to-pink-500', icon: Calendar },
                      { name: 'Half-Yearly', price: '$149', users: 0, color: 'from-orange-500 to-red-500', icon: Calendar },
                      { name: 'Yearly', price: '$249', users: 0, color: 'from-green-500 to-emerald-500', icon: Crown },
                    ].map((plan, idx) => (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <plan.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                        <p className="text-2xl font-bold gradient-text my-2">{plan.price}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                        <p className="text-sm text-gray-500 mb-4">{plan.users} active users</p>
                        <button className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors">
                          View Details
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                        <p className="text-sm opacity-90 mb-1">Monthly Revenue</p>
                        <p className="text-3xl font-bold">${stats.revenue}</p>
                        <p className="text-sm mt-2 opacity-90">+18% from last month</p>
                      </div>
                      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                        <p className="text-sm opacity-90 mb-1">Annual Target</p>
                        <p className="text-3xl font-bold">$15,000</p>
                        <p className="text-sm mt-2 opacity-90">{Math.round((stats.revenue * 12 / 15000) * 100)}% achieved</p>
                      </div>
                      <div className="p-6 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 text-white">
                        <p className="text-sm opacity-90 mb-1">Avg Revenue/User</p>
                        <p className="text-3xl font-bold">${stats.active > 0 ? Math.round(stats.revenue / stats.active) : 0}</p>
                        <p className="text-sm mt-2 opacity-90">Per active customer</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'POS System', status: 'Active', users: 847, color: 'from-blue-500 to-cyan-500', icon: ShoppingBag },
                      { name: 'Inventory Module', status: 'Active', users: 652, color: 'from-purple-500 to-pink-500', icon: Package },
                      { name: 'Reports & Analytics', status: 'Active', users: 523, color: 'from-green-500 to-emerald-500', icon: BarChart3 },
                      { name: 'HR Management', status: 'Beta', users: 124, color: 'from-orange-500 to-red-500', icon: Users },
                      { name: 'Accounting Module', status: 'Coming Soon', users: 0, color: 'from-indigo-500 to-blue-500', icon: DollarSign },
                      { name: 'Mobile App', status: 'Coming Soon', users: 0, color: 'from-pink-500 to-rose-500', icon: Layers },
                    ].map((product, idx) => (
                      <motion.div
                        key={product.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center shadow-lg`}>
                            <product.icon className="w-7 h-7 text-white" />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'Active' ? 'bg-green-100 text-green-700' :
                            product.status === 'Beta' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-500 mb-4">{product.users} customers using</p>
                        <div className="flex items-center space-x-2">
                          <button className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors">
                            Edit
                          </button>
                          <button className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors">
                            Configure
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* REPORTS TAB */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Signups', value: stats.total, change: '+12%', icon: UserCheck, color: 'from-blue-400 to-blue-600' },
                      { label: 'Conversion Rate', value: `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%`, change: '+5%', icon: TrendingUp, color: 'from-green-400 to-emerald-500' },
                      { label: 'Avg Response', value: '1.2s', change: '-10%', icon: Activity, color: 'from-purple-400 to-purple-600' },
                      { label: 'Uptime', value: '99.9%', change: '+0.1%', icon: Shield, color: 'from-orange-400 to-red-500' },
                    ].map((stat, idx) => (
                      <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                        <span className="text-xs font-semibold text-green-600 flex items-center">
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                          {stat.change}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Growth</h3>
                      <div className="flex items-end space-x-2 h-48">
                        {[40, 55, 65, 70, 80, 85, 90, 95, 88, 92, 97, 100].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${val}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.05 }}
                              className="w-full rounded-t-lg bg-gradient-to-t from-red-500 to-orange-500"
                            />
                            <span className="text-xs text-gray-500 mt-2">{['J','F','M','A','M','J','J','A','S','O','N','D'][idx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Distribution</h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Retail & Grocery', value: 35, color: 'bg-blue-500' },
                          { name: 'Restaurant & Cafe', value: 28, color: 'bg-orange-500' },
                          { name: 'Barber & Salon', value: 18, color: 'bg-pink-500' },
                          { name: 'Hall & Events', value: 12, color: 'bg-green-500' },
                          { name: 'School & Academy', value: 7, color: 'bg-indigo-500' },
                        ].map((item) => (
                          <div key={item.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                              <span className="text-sm text-gray-900 font-bold">{item.value}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1 }}
                                className={`h-full ${item.color} rounded-full`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Settings</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                          <input
                            type="text"
                            defaultValue="MultiPOS"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                          <input
                            type="email"
                            defaultValue="support@multipos.com"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                          <select className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20">
                            <option>USD ($)</option>
                            <option>PKR (Rs)</option>
                            <option>GBP (£)</option>
                            <option>AED (د.إ)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default License Duration</label>
                          <select className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20">
                            <option>30 Days</option>
                            <option>90 Days</option>
                            <option>180 Days</option>
                            <option>365 Days</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-md font-bold text-gray-900 mb-4">Feature Flags</h4>
                        <div className="space-y-3">
                          {[
                            { name: 'Allow Customer Self-Registration', enabled: true },
                            { name: 'Require Email Verification', enabled: true },
                            { name: 'Enable Multi-Branch Support', enabled: true },
                            { name: 'Enable Mobile App Access', enabled: false },
                          ].map((feature) => (
                            <div key={feature.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                              <span className="text-gray-700 font-medium text-sm">{feature.name}</span>
                              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${feature.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${feature.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors">
                          Cancel
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold shadow-lg flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Generate License Modal */}
      {licenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl my-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Generate License Key</h3>
                <p className="text-sm text-gray-500">Create license for any customer with custom plan</p>
              </div>
              <button onClick={() => setLicenseModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">1. Select Customer *</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-red-500 text-sm"
                >
                  <option value="">-- Choose a customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.businessName || c.name} ({c.email}) {c.licenseKey ? '[Active]' : '[Pending]'}
                    </option>
                  ))}
                </select>
                {customers.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No customers registered yet. Customers appear here after signup.</p>
                )}
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">2. Select Plan *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'monthly', label: 'Monthly', days: '30 days', price: '$29/mo', color: 'from-blue-500 to-cyan-500' },
                    { id: 'quarterly', label: 'Quarterly', days: '90 days', price: '$79/qtr', color: 'from-purple-500 to-pink-500' },
                    { id: 'half-yearly', label: 'Half-Yearly', days: '180 days', price: '$149/6mo', color: 'from-orange-500 to-red-500' },
                    { id: 'yearly', label: 'Yearly', days: '365 days', price: '$249/yr', color: 'from-green-500 to-emerald-500' },
                  ].map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedPlan === plan.id
                          ? 'border-red-500 bg-red-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-gray-900 text-sm">{plan.label}</p>
                      <p className="text-xs text-gray-500">{plan.days}</p>
                      <p className="text-xs font-semibold text-gray-700">{plan.price}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="plan"
                      checked={selectedPlan === 'custom'}
                      onChange={() => setSelectedPlan('custom')}
                      className="w-4 h-4 text-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Custom Duration</span>
                  </label>
                  {selectedPlan === 'custom' && (
                    <div className="mt-2 flex items-center space-x-2">
                      <input
                        type="number"
                        value={customDays}
                        onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
                        min={1}
                        max={3650}
                        className="w-24 px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-900 focus:border-red-500 focus:outline-none"
                      />
                      <span className="text-sm text-gray-600">days</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Generation Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">3. License Key</label>
                <div className="flex space-x-3 mb-3">
                  <button
                    onClick={() => { setUseAutoKey(true); setKeyPreview(generateLicenseKey()) }}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      useAutoKey ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Auto Generate
                  </button>
                  <button
                    onClick={() => setUseAutoKey(false)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      !useAutoKey ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Custom Key
                  </button>
                </div>

                {useAutoKey ? (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-100 text-center">
                    <p className="text-xs text-gray-600 mb-1">License key preview:</p>
                    <p className="font-mono font-bold text-red-600 text-lg tracking-wider">{keyPreview}</p>
                    <button
                      onClick={() => setKeyPreview(generateLicenseKey())}
                      className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Generate new key
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                      placeholder="MP-XXXX-XXXX-XXXX-XXXX"
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 font-mono text-center text-lg tracking-wider"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: MP-XXXX-XXXX-XXXX-XXXX</p>
                    {customKey && !/^MP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(customKey) && (
                      <p className="text-xs text-red-500 mt-1">Invalid format</p>
                    )}
                  </div>
                )}
              </div>

              {/* Expiry Preview */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold text-gray-900">{selectedPlan === 'custom' ? `${customDays} days` : selectedPlan}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Expires:</span>
                  <span className="font-semibold text-blue-700">
                    {new Date(Date.now() + getDaysForPlan() * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setLicenseModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmGenerateLicense}
                  disabled={generatingKey === selectedCustomerId || !selectedCustomerId || (!useAutoKey && !customKey.trim())}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {generatingKey === selectedCustomerId ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Key className="w-5 h-5" />
                  )}
                  <span>Generate License</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
