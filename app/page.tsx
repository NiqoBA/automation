import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Integrations from '@/components/Integrations'
import Work from '@/components/Work'
import Consulting from '@/components/Consulting'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F7F6F2' }}>
      <Navbar />
      <Hero />
      <Integrations />
      <Work />
      <Consulting />
      <CTA />
      <Footer />
      <BookingModal />
    </main>
  )
}
