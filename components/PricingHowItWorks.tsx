'use client'

import { motion } from 'framer-motion'
import { Code2, RefreshCw } from 'lucide-react'

const items = [
  {
    icon: Code2,
    title: 'Costo único de implementación',
    description:
      'Construimos tu sistema de automatización desde cero. El precio varía según complejidad, integraciones y tiempo estimado.',
    badge: 'Desde $500',
  },
  {
    icon: RefreshCw,
    title: 'Planes mensuales opcionales',
    description:
      'Una vez implementado, elegís el nivel de soporte que necesitás. Incluye dashboard, tickets, optimización y ajustes continuos.',
    badge: 'Desde $100/mes',
  },
]

export default function PricingHowItWorks() {
  return (
    <section className="bg-[#000000] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur sm:p-8 transition-all duration-300 hover:border-purple-500/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {item.description}
                </p>
                <span className="mt-4 inline-block rounded-lg bg-purple-600/20 px-3 py-1.5 text-sm font-medium text-purple-400">
                  {item.badge}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
