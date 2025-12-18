import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Integrations from '@/components/Integrations'
import CoreSystems from '@/components/CoreSystems'
import Work from '@/components/Work'
import HowItWorks from '@/components/HowItWorks'
import Consulting from '@/components/Consulting'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F7F6F2' }}>
      <Navbar />
      <Hero />
      <Integrations />
              <CoreSystems />
              <Work />
              <HowItWorks />
              <Consulting />
              <Contact />
      <Footer />
      <BookingModal />
    </main>
  )
}
