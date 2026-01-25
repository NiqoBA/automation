'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function PricingCTA() {
  const handleConsultoria = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  const handleCasos = () => {
    window.location.href = '/#work'
  }

  return (
    <section className="bg-[#000000] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-14 backdrop-blur sm:px-10 sm:py-16"
        >
          <h2 className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
            ¿Listo para automatizar tu negocio?
          </h2>
          <p className="mt-4 text-base text-gray-400 sm:text-lg">
            Agendá una consultoría gratuita de 30 minutos. Analizamos tu caso, te
            damos recomendaciones y cotizamos sin compromiso.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              onClick={handleConsultoria}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
            >
              Agendar consultoría
              <ArrowRight size={18} />
            </motion.button>
            <motion.button
              onClick={handleCasos}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800/50"
            >
              Ver casos de éxito
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
