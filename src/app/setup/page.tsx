'use client'

import { useState, useEffect } from 'react'
import { Zap, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react'
import Link from 'next/link'

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle')
  const [message, setMessage] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  const handleSetup = async () => {
    setStatus('loading')
    setMessage('Creating master admin account...')

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (response.status === 400 && data.admin) {
        // Master admin already exists
        setStatus('exists')
        setAdminEmail(data.admin.email)
        setMessage('Master admin account already exists')
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Setup failed')
      }

      setStatus('success')
      setAdminEmail(data.admin.email)
      setMessage('Master admin account created successfully!')
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Setup failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl animated-gradient flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Initial Setup</h1>
          <p className="text-gray-600">Create master admin account for first time</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
          {status === 'idle' && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-12 h-12 text-primary-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">Ready to Setup?</h2>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Click below to create the master admin account.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Email:</span> davidmartinbigson@gmail.com
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Password:</span> 123papers
                  </p>
                </div>
              </div>
              <button
                onClick={handleSetup}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all font-semibold text-white shadow-xl shadow-primary-500/25"
              >
                Create Master Admin
              </button>
            </>
          )}

          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-700">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
              <p className="text-green-600 mb-2">{message}</p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm mb-6">
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Login Email:</span> {adminEmail}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Password:</span> 123papers
                </p>
              </div>
              <Link
                href="/admin/login"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all font-semibold text-white shadow-xl shadow-primary-500/25"
              >
                Go to Admin Login
              </Link>
            </div>
          )}

          {status === 'exists' && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Already Setup</h2>
              <p className="text-blue-600 mb-2">{message}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm mb-6">
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Admin Email:</span> {adminEmail}
                </p>
              </div>
              <Link
                href="/admin/login"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all font-semibold text-white shadow-xl shadow-primary-500/25"
              >
                Go to Admin Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Setup Failed</h2>
              <p className="text-red-600 mb-6">{message}</p>
              <button
                onClick={() => setStatus('idle')}
                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all font-medium text-gray-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
