'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap, ShoppingBag, UtensilsCrossed, Scissors, Calendar, GraduationCap, Building2,
  ChevronRight, ChevronLeft, Check, ArrowRight, AlertCircle, Loader2, User, Mail, Phone, Lock, Building
} from 'lucide-react'

const businessTypes = [
  { id: 'retail', icon: ShoppingBag, name: 'Retail & Grocery', color: 'from-blue-500 to-cyan-500' },
  { id: 'restaurant', icon: UtensilsCrossed, name: 'Restaurant & Cafe', color: 'from-orange-500 to-red-500' },
  { id: 'barber', icon: Scissors, name: 'Barber & Beauty Salon', color: 'from-pink-500 to-purple-500' },
  { id: 'hall', icon: Calendar, name: 'Hall & Event Management', color: 'from-green-500 to-emerald-500' },
  { id: 'school', icon: GraduationCap, name: 'School & Academy', color: 'from-indigo-500 to-blue-500' },
  { id: 'erp', icon: Building2, name: 'ERP & Wholesale', color: 'from-purple-500 to-pink-500' },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Step 1: Business Category (already selected)

  // Step 2: Business Details
  const [businessName, setBusinessName] = useState('')
  const [legalName, setLegalName] = useState('')
  const [country, setCountry] = useState('Pakistan')
  const [currency, setCurrency] = useState('USD')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  // Step 3: Owner Account
  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Step 4: Business Setup
  const [branchCount, setBranchCount] = useState('1')
  const [staffCount, setStaffCount] = useState('1')
  const [posTerminals, setPosTerminals] = useState('1')

  const validateStep2 = () => {
    if (!businessName.trim()) return 'Business name is required'
    if (!phone.trim()) return 'Business phone is required'
    return ''
  }

  const validateStep3 = () => {
    if (!ownerName.trim()) return 'Owner name is required'
    if (!email.trim()) return 'Email is required'
    if (!ownerPhone.trim()) return 'Phone number is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (password !== confirmPassword) return 'Passwords do not match'
    if (!acceptTerms) return 'You must accept terms and conditions'
    return ''
  }

  const handleNext = () => {
    setError('')
    if (step === 2) {
      const err = validateStep2()
      if (err) { setError(err); return }
    }
    if (step === 3) {
      const err = validateStep3()
      if (err) { setError(err); return }
    }
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    setError('')
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: ownerName,
          businessName,
          businessType: selectedCategory || 'retail',
          phone: ownerPhone,
          businessPhone: phone,
          country,
          currency,
          address,
          branchCount: parseInt(branchCount),
          staffCount: parseInt(staffCount),
          posTerminals: parseInt(posTerminals),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccessMsg('Account created successfully! Please wait for admin approval.')
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent-200/40 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MultiPOS</span>
          </Link>
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            {['Category', 'Business', 'Account', 'Setup'].map((label, idx) => (
              <div key={label} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step > idx + 1 ? 'bg-primary-500 text-white' :
                  step === idx + 1 ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                {idx < 3 && <div className={`w-12 sm:w-20 h-0.5 mx-1 ${step > idx + 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Error / Success */}
        <div className="max-w-3xl mx-auto px-6">
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start space-x-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-700">{successMsg}</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 pb-12">
          {/* Step 1: Category */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">What type of business are you registering?</h1>
                <p className="text-gray-600">Select your business category</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {businessTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCategory(type.id)}
                    className={`p-6 rounded-2xl transition-all text-left ${
                      selectedCategory === type.id
                        ? 'bg-white border-2 border-primary-500 shadow-xl'
                        : 'bg-white border border-gray-200 hover:border-primary-300 hover:shadow-lg'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 ${selectedCategory === type.id ? 'scale-110' : ''} transition-transform shadow-lg`}>
                      <type.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={handleNext}
                  disabled={!selectedCategory}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 font-semibold text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Business Details</h1>
                <p className="text-gray-600">Tell us about your business</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="My Awesome Business"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Legal Name (Optional)</label>
                    <input
                      type="text"
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      placeholder="Registered legal name"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="UAE">UAE</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="India">India</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PKR">PKR (Rs)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AED">AED (د.إ)</option>
                      <option value="SAR">SAR ()</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full business address"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <button onClick={handleBack} className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium flex items-center space-x-2">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button onClick={handleNext} className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 font-semibold text-white shadow-xl flex items-center space-x-2">
                    <span>Continue</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Owner Account */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Owner Account</h1>
                <p className="text-gray-600">Create your admin account</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password * <span className="text-gray-400 font-normal">(min 8 characters)</span></label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>
                </div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 bg-white text-primary-500 focus:ring-primary-500/50 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
                  </span>
                </label>
                <div className="flex items-center justify-between pt-4">
                  <button onClick={handleBack} className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium flex items-center space-x-2">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button onClick={handleNext} className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 font-semibold text-white shadow-xl flex items-center space-x-2">
                    <span>Continue</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Business Setup */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Business Setup</h1>
                <p className="text-gray-600">Configure your workspace</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Branches</label>
                    <select
                      value={branchCount}
                      onChange={(e) => setBranchCount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="1">1 Branch</option>
                      <option value="2">2 Branches</option>
                      <option value="3">3 Branches</option>
                      <option value="5">5 Branches</option>
                      <option value="10">10+ Branches</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Staff Members</label>
                    <select
                      value={staffCount}
                      onChange={(e) => setStaffCount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="1">1-5 Staff</option>
                      <option value="10">5-10 Staff</option>
                      <option value="25">10-25 Staff</option>
                      <option value="50">25+ Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">POS Terminals</label>
                    <select
                      value={posTerminals}
                      onChange={(e) => setPosTerminals(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="1">1 Terminal</option>
                      <option value="2">2 Terminals</option>
                      <option value="5">3-5 Terminals</option>
                      <option value="10">5-10 Terminals</option>
                    </select>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Business:</span>
                      <p className="text-gray-900 font-medium">{businessName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <p className="text-gray-900 font-medium">{businessTypes.find(t => t.id === selectedCategory)?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Country:</span>
                      <p className="text-gray-900 font-medium">{country}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Owner:</span>
                      <p className="text-gray-900 font-medium">{ownerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="text-gray-900 font-medium">{email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Branches:</span>
                      <p className="text-gray-900 font-medium">{branchCount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button onClick={handleBack} className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium flex items-center space-x-2">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 font-semibold text-white shadow-xl flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
