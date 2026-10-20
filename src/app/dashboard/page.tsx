'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap, LayoutDashboard, ShoppingCart, Package, Users, UserCircle,
  MapPin, BarChart3, DollarSign, Key, Settings, Bell, Search,
  LogOut, TrendingUp, TrendingDown, Calendar, ChevronRight,
  Plus, ArrowUpRight, Receipt, Star, Target, Loader2,
  Edit, Trash2, Check, X, Save, Filter, Eye,
  CreditCard, Tag, Activity, Clock, UserPlus, ShoppingBag,
  Phone, Mail, Briefcase, DollarSignIcon, Trash, FileSpreadsheet, Upload
} from 'lucide-react'

interface UserData {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessType: string;
  role: string;
  licenseKey: string | null;
  currency?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  isMain: boolean;
}

const TABS = [
  { id: 'home', icon: LayoutDashboard, label: 'Home' },
  { id: 'pos', icon: ShoppingCart, label: 'POS & Checkout' },
  { id: 'inventory', icon: Package, label: 'Inventory' },
  { id: 'customers', icon: Users, label: 'Customers' },
  { id: 'appointments', icon: Calendar, label: 'Appointments' },
  { id: 'staff', icon: UserCircle, label: 'Staff' },
  { id: 'branches', icon: MapPin, label: 'Branches' },
  { id: 'reports', icon: BarChart3, label: 'Reports' },
  { id: 'finance', icon: DollarSign, label: 'Finance' },
  { id: 'license', icon: Key, label: 'My License' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

const CURRENCY = '$'

export default function CustomerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Data
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  // Modals
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [showBranchModal, setShowBranchModal] = useState(false)

  // Forms
  const [productForm, setProductForm] = useState({ name: '', sku: '', price: 0, stock: 0, category: '' })
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '' })
  const [staffForm, setStaffForm] = useState({ name: '', role: '', email: '', phone: '' })
  const [branchForm, setBranchForm] = useState({ name: '', address: '', phone: '', isMain: false })

  // POS
  const [cart, setCart] = useState<CartItem[]>([])
  const [posSearch, setPosSearch] = useState('')
  const [posCustomer, setPosCustomer] = useState('Walk-in')
  const [posPayment, setPosPayment] = useState('cash')
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  // Finance
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: 0, description: '' })
  const [expenses, setExpenses] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          Promise.all([
            fetch('/api/products').then(r => r.json()),
            fetch('/api/customers').then(r => r.json()),
            fetch('/api/staff').then(r => r.json()),
            fetch('/api/branches').then(r => r.json()),
            fetch('/api/transactions').then(r => r.json()),
          ]).then(([p, c, s, b, t]) => {
            setProducts(p.products || [])
            setCustomers(c.customers || [])
            setStaff(s.staff || [])
            setBranches(b.branches || [])
            setTransactions(t.transactions || [])
          })
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  // Generic helpers
  const callApi = async (url: string, method: string, body?: any) => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    return res.json()
  }

  const handleAddProduct = async () => {
    const data = await callApi('/api/products', 'POST', productForm)
    if (data.product) {
      setProducts([...products, data.product])
      setProductForm({ name: '', sku: '', price: 0, stock: 0, category: '' })
      setShowProductModal(false)
    }
  }

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length < 2) { alert('CSV file is empty or invalid'); return }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const nameIdx = headers.findIndex(h => h.includes('name'))
    const skuIdx = headers.findIndex(h => h.includes('sku'))
    const priceIdx = headers.findIndex(h => h.includes('price'))
    const stockIdx = headers.findIndex(h => h.includes('stock'))
    const catIdx = headers.findIndex(h => h.includes('category') || h.includes('cat'))

    if (nameIdx === -1 || priceIdx === -1) {
      alert('CSV must have at least "name" and "price" columns')
      return
    }

    let imported = 0
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim())
      if (cols.length < 2) continue
      const product = {
        name: cols[nameIdx] || `Product ${i}`,
        sku: skuIdx >= 0 ? (cols[skuIdx] || '') : `SKU-${Date.now()}-${i}`,
        price: parseFloat(cols[priceIdx]) || 0,
        stock: stockIdx >= 0 ? (parseInt(cols[stockIdx]) || 0) : 0,
        category: catIdx >= 0 ? (cols[catIdx] || '') : '',
      }
      if (product.name && product.price > 0) {
        await callApi('/api/products', 'POST', product)
        imported++
      }
    }

    // Refresh products
    const data = await fetch('/api/products').then(r => r.json())
    setProducts(data.products || [])
    alert(`✅ Successfully imported ${imported} products!`)
    event.target.value = ''
  }

  const handleAddCustomer = async () => {
    const data = await callApi('/api/customers', 'POST', customerForm)
    if (data.customer) {
      setCustomers([...customers, data.customer])
      setCustomerForm({ name: '', email: '', phone: '' })
      setShowCustomerModal(false)
    }
  }

  const handleAddStaff = async () => {
    const data = await callApi('/api/staff', 'POST', staffForm)
    if (data.member) {
      setStaff([...staff, data.member])
      setStaffForm({ name: '', role: '', email: '', phone: '' })
      setShowStaffModal(false)
    }
  }

  const handleAddBranch = async () => {
    const data = await callApi('/api/branches', 'POST', branchForm)
    if (data.branch) {
      setBranches([...branches, data.branch])
      setBranchForm({ name: '', address: '', phone: '', isMain: false })
      setShowBranchModal(false)
    }
  }

  const handleAddExpense = () => {
    if (!expenseForm.category || expenseForm.amount <= 0) return
    setExpenses([...expenses, { id: Date.now().toString(), ...expenseForm, date: new Date().toISOString() }])
    setExpenseForm({ category: '', amount: 0, description: '' })
    setShowExpenseModal(false)
  }

  const deleteProduct = async (id: string) => {
    await callApi('/api/products', 'DELETE', { id })
    setProducts(products.filter(p => p.id !== id))
  }

  const deleteCustomer = async (id: string) => {
    await callApi('/api/customers', 'DELETE', { id })
    setCustomers(customers.filter(c => c.id !== id))
  }

  const deleteStaff = async (id: string) => {
    await callApi('/api/staff', 'DELETE', { id })
    setStaff(staff.filter(s => s.id !== id))
  }

  const deleteBranch = async (id: string) => {
    await callApi('/api/branches', 'DELETE', { id })
    setBranches(branches.filter(b => b.id !== id))
  }

  // POS functions
  const addToCart = (product: Product) => {
    const existing = cart.find(c => c.id === product.id)
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c))
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id))
  }

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return }
    setCart(cart.map(c => c.id === id ? { ...c, quantity: qty } : c))
  }

  const cartSubtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)
  const cartTax = cartSubtotal * 0.1
  const cartTotal = cartSubtotal + cartTax

  const handleCheckout = () => {
    if (cart.length === 0) return
    const txn = {
      items: cart,
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      paymentMethod: posPayment,
      customerName: posCustomer,
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
    }
    callApi('/api/transactions', 'POST', txn).then(() => {
      setTransactions([...transactions, { id: Date.now().toString(), ...txn, createdAt: new Date().toISOString() }])
      setCart([])
      setShowCheckout(false)
      setCheckoutSuccess(true)
      setTimeout(() => setCheckoutSuccess(false), 3000)
    })
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(posSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(posSearch.toLowerCase())
  )

  // Reports data
  const weeklyData = [
    { day: 'Mon', value: 45, sales: 1200 },
    { day: 'Tue', value: 65, sales: 1800 },
    { day: 'Wed', value: 80, sales: 2400 },
    { day: 'Thu', value: 55, sales: 1500 },
    { day: 'Fri', value: 90, sales: 2900 },
    { day: 'Sat', value: 100, sales: 3400 },
    { day: 'Sun', value: 35, sales: 900 },
  ]

  const totalRevenue = transactions.reduce((sum: number, t: any) => sum + (t.total || 0), 0)
  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0)
  const netProfit = totalRevenue - totalExpenses

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-gray-200 fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block leading-tight">MultiPOS</span>
              <span className="text-xs text-gray-500">Business Dashboard</span>
            </div>
          </Link>

          {user && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
              <div className="flex items-center space-x-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">{user.businessName || user.name || 'My Business'}</span>
              </div>
              <p className="text-xs text-gray-600">{user.businessType || 'Retail'} • Active</p>
            </div>
          )}

          <nav className="space-y-1">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-200">
          {user && (
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">{user.name || 'User'}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              fetch('/api/auth/logout').finally(() => router.push('/login'))
            }}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors text-sm w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-72">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab === 'pos' ? 'POS & Checkout' : activeTab}</h1>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Online</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 w-48 text-sm" />
              </div>
              <button className="relative p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {/* HOME */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h2>
                      <p className="text-white/90">{user?.businessName || 'Your business'} dashboard overview</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Products', value: products.length, icon: Package, color: 'from-green-400 to-emerald-500' },
                      { label: 'Customers', value: customers.length, icon: Users, color: 'from-blue-400 to-cyan-500' },
                      { label: 'Staff', value: staff.length, icon: UserCircle, color: 'from-purple-400 to-pink-500' },
                      { label: 'Revenue', value: `${CURRENCY}${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'from-orange-400 to-red-500' },
                    ].map((stat, idx) => (
                      <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button onClick={() => setActiveTab('pos')} className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all text-left">
                      <ShoppingCart className="w-8 h-8 mb-2" />
                      <p className="font-bold text-lg">New Sale</p>
                      <p className="text-sm opacity-90">Open POS</p>
                    </button>
                    <button onClick={() => setActiveTab('inventory')} className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg hover:shadow-xl transition-all text-left">
                      <Package className="w-8 h-8 mb-2" />
                      <p className="font-bold text-lg">Inventory</p>
                      <p className="text-sm opacity-90">Manage products</p>
                    </button>
                    <button onClick={() => setActiveTab('reports')} className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-xl transition-all text-left">
                      <BarChart3 className="w-8 h-8 mb-2" />
                      <p className="font-bold text-lg">Reports</p>
                      <p className="text-sm opacity-90">View analytics</p>
                    </button>
                    <button onClick={() => setActiveTab('finance')} className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg hover:shadow-xl transition-all text-left">
                      <DollarSign className="w-8 h-8 mb-2" />
                      <p className="font-bold text-lg">Finance</p>
                      <p className="text-sm opacity-90">Track money</p>
                    </button>
                  </div>
                </div>
              )}

              {/* POS */}
              {activeTab === 'pos' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                      <input
                        type="text"
                        value={posSearch}
                        onChange={(e) => setPosSearch(e.target.value)}
                        placeholder="🔍 Search products or scan barcode..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredProducts.length === 0 ? (
                        <div className="col-span-full p-8 text-center bg-white rounded-2xl border-2 border-dashed border-gray-300">
                          <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No products found</p>
                          <p className="text-sm text-gray-400">Add products in Inventory tab</p>
                        </div>
                      ) : filteredProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="w-full h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 mb-2 flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-white/60" />
                          </div>
                          <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-blue-600 font-bold">{CURRENCY}{product.price.toFixed(2)}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {product.stock} left
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-fit sticky top-24">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Receipt className="w-5 h-5 mr-2" />
                      Current Sale ({cart.length})
                    </h3>
                    <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                      {cart.length === 0 ? (
                        <p className="text-center text-gray-400 py-4">Cart is empty</p>
                      ) : cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">{CURRENCY}{item.price.toFixed(2)} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-bold">-</button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-bold">+</button>
                            <button onClick={() => removeFromCart(item.id)} className="ml-1 p-1 rounded hover:bg-red-100">
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">{CURRENCY}{cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span className="font-semibold">{CURRENCY}{cartTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg border-t border-gray-200 pt-2">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-blue-600">{CURRENCY}{cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      disabled={cart.length === 0}
                      className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}

              {/* INVENTORY */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Inventory Management ({products.length})</h3>
                    <div className="flex items-center space-x-3">
                      <label className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg flex items-center space-x-2 cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Import CSV</span>
                        <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
                      </label>
                      <button onClick={() => setShowProductModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg flex items-center space-x-2">
                        <Plus className="w-4 h-4" /><span>Add Product</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
                     <strong>CSV Format:</strong> Name, SKU, Price, Stock, Category — first row must be headers. Example: <code className="bg-white px-2 py-0.5 rounded text-xs">Shampoo, SKU001, 500, 20, Beauty</code>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {products.length === 0 ? (
                      <div className="p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-900 font-medium mb-1">No products yet</p>
                        <p className="text-gray-500 text-sm">Click "Add Product" to get started</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Product</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">SKU</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Category</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Price</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Stock</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                              <td className="px-6 py-4 text-gray-600 font-mono text-sm">{p.sku}</td>
                              <td className="px-6 py-4 text-gray-600">{p.category || '-'}</td>
                              <td className="px-6 py-4 font-semibold text-gray-900">{CURRENCY}{p.price.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                  {p.stock}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                                  <Trash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Customer Management ({customers.length})</h3>
                    <button onClick={() => setShowCustomerModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" /><span>Add Customer</span>
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {customers.length === 0 ? (
                      <div className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-900 font-medium mb-1">No customers yet</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Customer</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Email</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Phone</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Balance</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.map(c => (
                            <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{c.name.charAt(0)}</div>
                                  <span className="font-medium text-gray-900">{c.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{c.email}</td>
                              <td className="px-6 py-4 text-gray-600">{c.phone}</td>
                              <td className="px-6 py-4 font-semibold">{CURRENCY}{c.balance.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                <button onClick={() => deleteCustomer(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                                  <Trash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Appointments</h3>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg flex items-center space-x-2">
                      <Plus className="w-4 h-4" /><span>Book Appointment</span>
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-1">No appointments yet</p>
                    <p className="text-gray-500 text-sm">Book your first appointment to get started</p>
                  </div>
                </div>
              )}

              {/* STAFF */}
              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Staff Management ({staff.length})</h3>
                    <button onClick={() => setShowStaffModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" /><span>Add Staff</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.length === 0 ? (
                      <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-gray-200">
                        <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-900 font-medium mb-1">No staff members yet</p>
                      </div>
                    ) : staff.map(s => (
                      <div key={s.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">{s.name.charAt(0)}</div>
                          <div>
                            <h4 className="font-bold text-gray-900">{s.name}</h4>
                            <p className="text-sm text-gray-500">{s.role}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{s.email}</p>
                        <p className="text-sm text-gray-600 mb-4">{s.phone}</p>
                        <div className="flex space-x-2">
                          <button onClick={() => deleteStaff(s.id)} className="flex-1 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium text-sm">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BRANCHES */}
              {activeTab === 'branches' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Branches ({branches.length})</h3>
                    <button onClick={() => setShowBranchModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg flex items-center space-x-2">
                      <Plus className="w-4 h-4" /><span>Add Branch</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {branches.length === 0 ? (
                      <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-gray-200">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-900 font-medium mb-1">No branches yet</p>
                        <p className="text-gray-500 text-sm">Add your first branch location</p>
                      </div>
                    ) : branches.map(b => (
                      <div key={b.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                              <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{b.name}</h4>
                              {b.isMain && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">Main Branch</span>}
                            </div>
                          </div>
                          <button onClick={() => deleteBranch(b.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {b.address}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {b.phone}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REPORTS */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Reports & Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Transactions', value: transactions.length, icon: Receipt, color: 'from-blue-400 to-blue-600' },
                      { label: 'Total Revenue', value: `${CURRENCY}${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'from-green-400 to-emerald-500' },
                      { label: 'Avg Order Value', value: transactions.length > 0 ? `${CURRENCY}${(totalRevenue / transactions.length).toFixed(2)}` : `${CURRENCY}0.00`, icon: DollarSign, color: 'from-purple-400 to-purple-600' },
                      { label: 'Products Sold', value: transactions.reduce((s: number, t: any) => s + (t.items?.reduce((x: number, i: any) => x + i.quantity, 0) || 0), 0), icon: Package, color: 'from-orange-400 to-red-500' },
                    ].map((stat, idx) => (
                      <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-4">Weekly Sales</h4>
                      <div className="flex items-end space-x-2 h-48">
                        {weeklyData.map((d, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <motion.div initial={{ height: 0 }} animate={{ height: `${d.value}%` }} transition={{ duration: 0.8, delay: idx * 0.05 }} className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer relative group">
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 whitespace-nowrap">{CURRENCY}{d.sales}</div>
                            </motion.div>
                            <span className="text-xs text-gray-500 mt-2">{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-4">Recent Transactions</h4>
                      <div className="space-y-3">
                        {transactions.length === 0 ? (
                          <p className="text-center text-gray-400 py-4">No transactions yet. Make a sale in POS!</p>
                        ) : transactions.slice(-5).reverse().map((t: any) => (
                          <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{t.customerName || 'Walk-in'}</p>
                              <p className="text-xs text-gray-500">{t.invoiceNo} • {t.paymentMethod}</p>
                            </div>
                            <p className="font-bold text-green-600">{CURRENCY}{t.total?.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FINANCE */}
              {activeTab === 'finance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Finance</h3>
                    <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-lg flex items-center space-x-2">
                      <Plus className="w-4 h-4" /><span>Add Expense</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
                      <p className="text-sm opacity-90 mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold">{CURRENCY}{totalRevenue.toFixed(2)}</p>
                      <p className="text-sm mt-2 opacity-90">{transactions.length} transactions</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
                      <p className="text-sm opacity-90 mb-1">Total Expenses</p>
                      <p className="text-3xl font-bold">{CURRENCY}{totalExpenses.toFixed(2)}</p>
                      <p className="text-sm mt-2 opacity-90">{expenses.length} entries</p>
                    </div>
                    <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-red-500'} rounded-2xl p-6 text-white shadow-lg`}>
                      <p className="text-sm opacity-90 mb-1">Net Profit</p>
                      <p className="text-3xl font-bold">{CURRENCY}{netProfit.toFixed(2)}</p>
                      <p className="text-sm mt-2 opacity-90">{netProfit >= 0 ? 'Profitable' : 'Loss'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-4">Recent Income</h4>
                      <div className="space-y-3">
                        {transactions.length === 0 ? (
                          <p className="text-center text-gray-400 py-4">No income yet</p>
                        ) : transactions.slice(-5).reverse().map((t: any) => (
                          <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{t.customerName}</p>
                              <p className="text-xs text-gray-500">{t.invoiceNo}</p>
                            </div>
                            <p className="font-bold text-green-600">+{CURRENCY}{t.total?.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-4">Recent Expenses</h4>
                      <div className="space-y-3">
                        {expenses.length === 0 ? (
                          <p className="text-center text-gray-400 py-4">No expenses yet</p>
                        ) : expenses.slice(-5).reverse().map((e: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{e.category}</p>
                              <p className="text-xs text-gray-500">{e.description}</p>
                            </div>
                            <p className="font-bold text-red-600">-{CURRENCY}{e.amount.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LICENSE */}
              {activeTab === 'license' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">My License</h3>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    {user?.licenseKey ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                          <div className="flex items-center space-x-3">
                            <Check className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="font-bold text-green-700">License Active</p>
                              <p className="text-sm text-green-600">Your subscription is valid</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">License Key</label>
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-mono font-bold">{user.licenseKey}</code>
                            <button onClick={() => navigator.clipboard.writeText(user.licenseKey!)} className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium">Copy</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Plan</p>
                            <p className="font-bold text-gray-900">Half-Yearly</p>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Status</p>
                            <p className="font-bold text-green-600">Active</p>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Business</p>
                            <p className="font-bold text-gray-900">{user.businessName || '-'}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Expires</p>
                            <p className="font-bold text-gray-900">Nov 20, 2026</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Key className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No license assigned</p>
                        <p className="text-sm text-gray-400 mt-1">Contact admin to get your license key</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Settings</h3>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input type="text" defaultValue={user?.businessName || ''} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" placeholder="Enter phone" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500">
                          <option>USD ($)</option><option>PKR (Rs)</option><option>GBP (£)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                      <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg flex items-center space-x-2">
                        <Save className="w-4 h-4" /><span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* POS Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
              <button onClick={() => setShowCheckout(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input type="text" value={posCustomer} onChange={(e) => setPosCustomer(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select value={posPayment} onChange={(e) => setPosPayment(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile">Mobile Payment</option>
                </select>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{CURRENCY}{cartSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Tax</span><span>{CURRENCY}{cartTax.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2"><span>Total</span><span className="text-blue-600">{CURRENCY}{cartTotal.toFixed(2)}</span></div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setShowCheckout(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                <button onClick={handleCheckout} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg flex items-center justify-center space-x-2">
                  <Check className="w-5 h-5" /><span>Complete Sale</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Checkout Success Toast */}
      {checkoutSuccess && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 z-50">
          <Check className="w-6 h-6" />
          <div>
            <p className="font-bold">Sale Completed!</p>
            <p className="text-sm opacity-90">Transaction recorded successfully</p>
          </div>
        </motion.div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label><input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">SKU</label><input type="text" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Category</label><input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Price *</label><input type="number" value={productForm.price || ''} onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label><input type="number" value={productForm.stock || ''} onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowProductModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                <button onClick={handleAddProduct} disabled={!productForm.name || productForm.price <= 0} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" /><span>Add Product</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Customer</h3>
              <button onClick={() => setShowCustomerModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input type="text" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label><input type="tel" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowCustomerModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                <button onClick={handleAddCustomer} disabled={!customerForm.name || !customerForm.phone} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" /><span>Add Customer</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Staff</h3>
              <button onClick={() => setShowStaffModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input type="text" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Role *</label><input type="text" value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} placeholder="Manager, Cashier, etc." className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label><input type="tel" value={staffForm.phone} onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowStaffModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                <button onClick={handleAddStaff} disabled={!staffForm.name || !staffForm.role || !staffForm.phone} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" /><span>Add Staff</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Branch</h3>
              <button onClick={() => setShowBranchModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label><input type="text" value={branchForm.name} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Address *</label><input type="text" value={branchForm.address} onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label><input type="tel" value={branchForm.phone} onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={branchForm.isMain} onChange={(e) => setBranchForm({ ...branchForm, isMain: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Set as main branch</span>
              </label>
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowBranchModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                <button onClick={handleAddBranch} disabled={!branchForm.name || !branchForm.address || !branchForm.phone} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" /><span>Add Branch</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Category *</label><input type="text" value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} placeholder="Rent, Utilities, Salary..." className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label><input type="number" value={expenseForm.amount || ''} onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 resize-none" /></div>
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowExpenseModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</button>
                <button onClick={handleAddExpense} disabled={!expenseForm.category || expenseForm.amount <= 0} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" /><span>Add Expense</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
