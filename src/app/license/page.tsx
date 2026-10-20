'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Key, Shield, ArrowRight, Check, AlertCircle, Loader2, Copy, CheckCircle2 } from 'lucide-react'

export default function LicensePage() {
  const router = useRouter()
  const [licenseKey, setLicenseKey] = useState('')
  const [activating, setActivating] = useState(false)
  const [activated, setActivated] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleKeyChange = (value: string) => {
    let cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    setLicenseKey(cleaned)
    setError('')
  }

  const validateKeyFormat = (key: string): boolean => {
    const pattern = /^MP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    return pattern.test(key)
  }

  const handleActivate = async () => {
    setError('')

    if (!licenseKey.trim()) {
      setError('Please enter your license key')
      return
    }

    if (!validateKeyFormat(licenseKey)) {
      setError('Invalid license key format. Expected format: MP-XXXX-XXXX-XXXX-XXXX')
      return
    }

    setActivating(true)

    try {
      const response = await fetch('/api/auth/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'License verification failed')
      }

      setActivated(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err: any) {
      setError(err.message || 'License verification failed. Please check your key and try again.')
    } finally {
      setActivating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gray-50">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 max-w-lg w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MultiPOS</span>
          </Link>

          {!activated ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Activate Your License</h1>
              <p className="text-gray-600 text-lg">Enter your license key to activate your workspace</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">License Activated!</h1>
              <p className="text-gray-600 text-lg">Redirecting to dashboard...</p>
            </>
          )}
        </motion.div>

        {!activated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl bg-white border border-gray-200 p-8 shadow-xl"
          >
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Secure License Verification</p>
                  <p>Your license key is cryptographically verified on our secure servers.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  License Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    placeholder="MP-XXXX-XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono text-center text-lg tracking-wider"
                  />
                  {licenseKey && (
                    <button
                      onClick={handleCopy}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Format: MP-XXXX-XXXX-XXXX-XXXX (X = letter or number)
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <button
                onClick={handleActivate}
                disabled={activating || !licenseKey.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold text-white shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Activate License</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Don't have a license key?{' '}
                <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium">
                  Purchase a plan
                </Link>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-white border border-gray-200 p-8 shadow-xl"
          >
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-green-50 border border-green-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-700 font-medium">Your license is now active!</p>
              </div>

              <Link
                href="/dashboard"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold text-white text-center shadow-xl"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
