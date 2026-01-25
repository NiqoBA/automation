import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Clients from '@/components/Clients'
import CoreSystems from '@/components/CoreSystems'
import Services from '@/components/Services'
import SalesMarketing from '@/components/SalesMarketing'
import Integrations from '@/components/Integrations'
import CaseStudiesSection from '@/components/case-studies/CaseStudiesSection'
import HowItWorks from '@/components/HowItWorks'
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
      <CaseStudiesSection />
      <FAQ />
      <Contact />
      <Footer />
      <BookingModal />
    </main>
  )
}
