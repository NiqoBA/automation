'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CaseCTA() {
  const handleConsultoria = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  return (
    <section className="border-t border-zinc-800 bg-[#0a0a0a] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-14 sm:px-10"
        >
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            ¿Necesitás una solución similar?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              onClick={handleConsultoria}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
            >
              Agendar consultoría
              <ArrowRight size={18} />
            </motion.button>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800"
            >
              Ver más casos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
