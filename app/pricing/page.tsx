import Navbar from '@/components/Navbar'
import PricingHero from '@/components/PricingHero'
import PricingHowItWorks from '@/components/PricingHowItWorks'
import DevelopmentPricing from '@/components/DevelopmentPricing'
import SupportPlans from '@/components/SupportPlans'
import PricingFAQ from '@/components/PricingFAQ'
import PricingCTA from '@/components/PricingCTA'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'

export const metadata = {
  title: 'Pricing - Inflexo AI | Automatización desde $500',
  description:
    'Pricing transparente para automatización con IA. Proyectos desde $500. Soporte desde $100/mes. Sin costos ocultos.',
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#000000]">
      <Navbar />
      <PricingHero />
      <PricingHowItWorks />
      <DevelopmentPricing />
      <SupportPlans />
      <PricingFAQ />
      <PricingCTA />
      <Footer />
      <BookingModal />
    </main>
  )
}
