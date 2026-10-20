import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import BusinessTypes from '@/components/landing/BusinessTypes'
import Pricing from '@/components/landing/Pricing'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <BusinessTypes />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}
