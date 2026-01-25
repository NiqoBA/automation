import Navbar from '@/components/Navbar'
import Consulting from '@/components/Consulting'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'

export const metadata = {
  title: 'Asesorías | Inflexo AI',
  description:
    'Asesorías 1:1 para devs y empresas. De scripts a sistemas de producción. Integración de APIs, automatización con n8n y agentes de IA.',
}

export default function AsesoriasPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Consulting />
      <Footer />
      <BookingModal />
    </main>
  )
}
