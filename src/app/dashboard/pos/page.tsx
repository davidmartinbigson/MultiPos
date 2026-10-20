'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Search, Plus, Minus, Trash2, ShoppingCart, CreditCard,
  Banknote, Smartphone, Percent, User, Barcode, ArrowRight, X
} from 'lucide-react'

const sampleProducts = [
  { id: 1, name: 'Premium Shampoo', price: 12.99, category: 'Hair Care', stock: 45, barcode: '8901234567890' },
  { id: 2, name: 'Hair Styling Gel', price: 8.99, category: 'Styling', stock: 32, barcode: '8901234567891' },
  { id: 3, name: 'Beard Oil', price: 14.99, category: 'Beard Care', stock: 28, barcode: '8901234567892' },
  { id: 4, name: 'Hair Serum', price: 18.99, category: 'Treatment', stock: 15, barcode: '8901234567893' },
  { id: 5, name: 'Face Wash', price: 9.99, category: 'Skin Care', stock: 56, barcode: '8901234567894' },
  { id: 6, name: 'Hair Comb', price: 4.99, category: 'Tools', stock: 120, barcode: '8901234567895' },
  { id: 7, name: 'Conditioner', price: 11.99, category: 'Hair Care', stock: 38, barcode: '8901234567896' },
  { id: 8, name: 'Hair Dryer', price: 39.99, category: 'Tools', stock: 8, barcode: '8901234567897' },
  { id: 9, name: 'Scissors Pro', price: 24.99, category: 'Tools', stock: 12, barcode: '8901234567898' },
  { id: 10, name: 'Shaving Cream', price: 7.99, category: 'Beard Care', stock: 67, barcode: '8901234567899' },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...new Set(sampleProducts.map(p => p.category))]

  const filteredProducts = sampleProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: typeof sampleProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">POS Checkout</h1>
            <p className="text-gray-400">Process sales and manage transactions</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-lg glass text-sm text-gray-700">
              Terminal: <span className="text-gray-900 font-medium">T-01</span>
            </div>
            <div className="px-4 py-2 rounded-lg glass text-sm text-gray-700">
              Cashier: <span className="text-gray-900 font-medium">Sarah Ali</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search & Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or scan barcode..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass bg-white border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                />
                <Barcode className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <motion.button
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  className="p-4 rounded-xl bg-white border border-gray-200 shadow-lg rounded-2xl text-left hover:bg-gray-100 transition-all"
                >
                  <div className="w-full h-16 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-3">
                    <ShoppingCart className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-gray-900 font-medium text-sm mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-400 text-xs mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-400 font-bold">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">{product.stock} left</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-lg rounded-2xl p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-primary-400" />
                  <span>Current Order</span>
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Cart is empty</p>
                  <p className="text-gray-400 text-sm">Add products to start a sale</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto scrollbar-hide">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-xl glass"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm font-medium">{item.name}</p>
                        <p className="text-gray-400 text-xs">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-white/10"
                        >
                          <Minus className="w-3 h-3 text-gray-400" />
                        </button>
                        <span className="text-gray-900 font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-white/10"
                        >
                          <Plus className="w-3 h-3 text-gray-400" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Tax (5%)</span>
                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="gradient-text">${total.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <button className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center space-x-1">
                      <Banknote className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-700">Cash</span>
                    </button>
                    <button className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center space-x-1">
                      <CreditCard className="w-4 h-4 text-primary-400" />
                      <span className="text-xs text-gray-700">Card</span>
                    </button>
                    <button className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center space-x-1">
                      <Smartphone className="w-4 h-4 text-accent-400" />
                      <span className="text-xs text-gray-700">Mobile</span>
                    </button>
                  </div>

                  <button className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all font-semibold text-white flex items-center justify-center space-x-2 glow">
                    <span>Complete Sale</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
