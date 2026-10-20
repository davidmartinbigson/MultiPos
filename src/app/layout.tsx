import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MultiPOS — All Your Businesses. One Powerful Platform.',
  description: 'Complete Multi-Business POS & Management SaaS Platform. Manage retail, restaurant, salon, events, schools, and wholesale from a single unified platform.',
  keywords: 'POS, Point of Sale, Multi-Business, SaaS, Retail, Restaurant, Salon, ERP, School Management, Event Management',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
