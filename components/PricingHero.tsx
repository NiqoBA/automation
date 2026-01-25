'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function PricingHero() {
  const handleCta = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#000000] px-4 pt-32 pb-20 sm:px-6 sm:pt-40 sm:pb-28 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block rounded-lg border border-white/20 bg-black px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white">
            Pricing
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Inversión transparente,
          <br />
          resultados medibles
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg"
        >
          Proyectos desde $500. Sin letra chica, sin costos ocultos. Pagás
          por valor entregado.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <motion.button
            onClick={handleCta}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Agendar consultoría gratuita
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
