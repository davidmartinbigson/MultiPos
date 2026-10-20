'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Package, Calendar, Download, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

const monthlyData = [
  { month: 'Jan', revenue: 4200, sales: 320, customers: 45 },
  { month: 'Feb', revenue: 5100, sales: 380, customers: 52 },
  { month: 'Mar', revenue: 4800, sales: 350, customers: 48 },
  { month: 'Apr', revenue: 6200, sales: 420, customers: 65 },
  { month: 'May', revenue: 5800, sales: 400, customers: 58 },
  { month: 'Jun', revenue: 7100, sales: 480, customers: 72 },
  { month: 'Jul', revenue: 6800, sales: 460, customers: 68 },
  { month: 'Aug', revenue: 7500, sales: 510, customers: 78 },
  { month: 'Sep', revenue: 8200, sales: 540, customers: 85 },
  { month: 'Oct', revenue: 7800, sales: 520, customers: 80 },
  { month: 'Nov', revenue: 8420, sales: 560, customers: 88 },
]

const topProducts = [
  { name: 'Premium Shampoo', sold: 245, revenue: 3182, growth: 12 },
  { name: 'Hair Styling Gel', sold: 198, revenue: 1780, growth: 8 },
  { name: 'Beard Oil', sold: 176, revenue: 2638, growth: -3 },
  { name: 'Hair Serum', sold: 165, revenue: 3123, growth: 15 },
  { name: 'Face Wash', sold: 158, revenue: 1578, growth: 6 },
]

const topCustomers = [
  { name: 'Ahmad Ali', visits: 24, spent: 485.50, lastVisit: '2 days ago' },
  { name: 'Sara Khan', visits: 18, spent: 342.80, lastVisit: '5 days ago' },
  { name: 'Usman Tariq', visits: 15, spent: 298.00, lastVisit: '1 week ago' },
  { name: 'Fatima Noor', visits: 12, spent: 234.90, lastVisit: '3 days ago' },
  { name: 'Hassan Raza', visits: 10, spent: 198.50, lastVisit: '2 weeks ago' },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly')
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
              <BarChart3 className="w-7 h-7 text-primary-400" />
              <span>Reports & Analytics</span>
            </h1>
            <p className="text-gray-400 mt-1">Comprehensive business insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {['weekly', 'monthly', 'yearly'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === p
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: '$71,920', change: '+15.3%', trend: 'up', icon: DollarSign, color: 'from-green-400 to-emerald-500' },
            { label: 'Total Sales', value: '4,740', change: '+12.8%', trend: 'up', icon: ShoppingCart, color: 'from-primary-400 to-primary-600' },
            { label: 'New Customers', value: '731', change: '+8.2%', trend: 'up', icon: Users, color: 'from-accent-400 to-accent-600' },
            { label: 'Avg. Order Value', value: '$42.15', change: '-2.1%', trend: 'down', icon: Package, color: 'from-yellow-400 to-orange-500' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl glass-card p-6 gradient-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl glass-card p-6 gradient-border mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Over Time</h3>
              <p className="text-sm text-gray-400">Monthly revenue breakdown</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                <span className="text-sm text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-sm text-gray-400">Profit</span>
              </div>
            </div>
          </div>
          <div className="flex items-end space-x-3 h-64">
            {monthlyData.map((data, idx) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center space-y-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-500/80 to-accent-500/80 relative group cursor-pointer min-h-[4px]"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark-800 px-3 py-1.5 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                      ${data.revenue.toLocaleString()}
                    </div>
                  </motion.div>
                </div>
                <span className="text-xs text-gray-400 mt-3">{data.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl glass-card p-6 gradient-border"
          >
            <h3 className="text-lg font-bold text-white mb-6">Top Selling Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 text-sm font-medium">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-gray-900 text-sm font-medium">{product.name}</p>
                      <p className="text-gray-400 text-xs">{product.sold} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium text-sm">${product.revenue.toLocaleString()}</p>
                    <p className={`text-xs ${product.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl glass-card p-6 gradient-border"
          >
            <h3 className="text-lg font-bold text-white mb-6">Top Customers</h3>
            <div className="space-y-4">
              {topCustomers.map((customer, idx) => (
                <div key={customer.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-gray-900 font-bold text-sm">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-medium">{customer.name}</p>
                      <p className="text-gray-400 text-xs">{customer.visits} visits • {customer.lastVisit}</p>
                    </div>
                  </div>
                  <span className="text-gray-900 font-medium text-sm">${customer.spent.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
