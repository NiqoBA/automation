import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Clients from '@/components/Clients'
import CoreSystems from '@/components/CoreSystems'
import Services from '@/components/Services'
import SalesMarketing from '@/components/SalesMarketing'
import Integrations from '@/components/Integrations'
import Work from '@/components/Work'
import HowItWorks from '@/components/HowItWorks'
import Consulting from '@/components/Consulting'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F7F6F2' }}>
      <Navbar />
      <Hero />
      <Clients />
      <Services />
      <SalesMarketing />
      <Integrations />
      <CoreSystems />
      <HowItWorks />
      <Work />
      <Consulting />
      <FAQ />
      <Contact />
      <Footer />
      <BookingModal />
    </main>
  )
}
