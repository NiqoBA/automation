'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Layers, Clock } from 'lucide-react'

const tiers = [
  {
    id: 'simple',
    icon: Zap,
    name: 'Automatización simple',
    price: 'Desde $500 a $2,000',
    timeframe: '2-4 semanas',
    badge: null,
    includes: [
      'Integraciones básicas (2-3 sistemas)',
      'Dashboard básico',
      'Soporte básico incluido por 1 mes',
      'Documentación completa',
    ],
    examples: [
      'Chatbot simple integrado a WhatsApp',
      'RAG básico',
      'Web scraper',
    ],
  },
  {
    id: 'avanzadas',
    icon: Layers,
    name: 'Automatizaciones avanzadas',
    price: 'Desde $2,000 a $5,000',
    timeframe: '4-8 semanas',
    badge: null,
    includes: [
      'Todo lo de Automatización simple +',
      'Múltiples integraciones (4-6 sistemas)',
      'Dashboard personalizado con métricas',
      'Agente conversacional con IA',
      'Soporte Profesional incluido por 1 mes',
    ],
    examples: [
      'Chatbot avanzado con integraciones múltiples',
      'RAG avanzado',
      'Sistemas completos que involucren varias automatizaciones',
    ],
  },
]

export default function DevelopmentPricing() {
  const handleQuote = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  return (
    <section
      id="development-pricing"
      className="bg-[#000000] px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            ¿Cuánto cuesta
            <br />
            automatizar tu negocio?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">
            El costo de implementación depende de la complejidad técnica,
            cantidad de integraciones y alcance del proyecto. Estos son rangos
            orientativos:
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {tiers.map((tier, i) => {
            const Icon = tier.icon
            const isPopular = tier.badge !== null
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-xl border p-4 transition-all duration-300 sm:p-5 ${
                  isPopular
                    ? 'border-purple-500/50 bg-zinc-900/50 shadow-[0_0_40px_rgba(139,92,246,0.12)]'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-purple-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className={`flex items-center gap-2.5 ${tier.badge ? 'mt-1' : ''}`}>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {tier.name}
                  </h3>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white sm:text-3xl">
                    {tier.price}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  {tier.timeframe}
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Incluye
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {tier.includes.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-purple-400"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Ejemplos
                  </h4>
                  <ul className="mt-1.5 space-y-1 text-sm text-gray-400">
                    {tier.examples.map((ex, j) => (
                      <li key={j}>• {ex}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          ¿Tu proyecto no encaja en estos rangos?{' '}
          <button
            onClick={handleQuote}
            className="font-medium text-purple-400 underline decoration-purple-500/50 underline-offset-2 hover:text-purple-300"
          >
            Agendemos una llamada
          </button>{' '}
          y te damos una cotización personalizada sin compromiso.
        </motion.p>
      </div>
    </section>
  )
}
