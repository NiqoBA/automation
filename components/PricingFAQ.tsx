'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: '¿Cómo se determina el precio final del proyecto?',
    a: 'Agendamos una llamada de descubrimiento gratuita donde entendemos tus necesidades. Luego entregamos propuesta detallada con alcance, tiempos y precio fijo.',
  },
  {
    q: '¿Hay costos ocultos?',
    a: 'No. El precio incluye todo lo especificado en la propuesta. Si durante el desarrollo surgiera la necesidad de algo fuera de scope, lo conversamos antes de continuar.',
  },
  {
    q: '¿Puedo pagar en cuotas?',
    a: 'Para automatizaciones avanzadas >$2,000 USD ofrecemos planes de pago: 40% al inicio, 40% a mitad de proyecto, 20% al entregar.',
  },
  {
    q: '¿Qué pasa después de los días de soporte incluido?',
    a: 'Podés elegir cualquiera de nuestros planes de soporte o manejar el sistema internamente. No hay lock-in.',
  },
  {
    q: '¿Puedo empezar sin plan de soporte?',
    a: 'Sí. Los planes de soporte son opcionales. Sin embargo, recomendamos al menos el plan Básico para garantizar que el sistema se mantiene optimizado.',
  },
  {
    q: '¿Ofrecen garantía?',
    a: 'Sí. Si el sistema no funciona según lo acordado, lo arreglamos sin costo. Además, los primeros 30 días incluyen soporte básico o profesional, dependiendo el plan.',
  },
]

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-[#000000] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Preguntas frecuentes sobre pricing
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={openIndex === i}
                aria-controls={`pricing-faq-${i}`}
                id={`pricing-faq-q-${i}`}
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={`pricing-faq-${i}`}
                role="region"
                aria-labelledby={`pricing-faq-q-${i}`}
                className={`grid overflow-hidden border-t border-zinc-800 transition-[grid-template-rows] duration-200 ${
                  openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="min-h-0">
                  <p className="px-5 py-4 text-sm leading-relaxed text-gray-400">
                    {faq.a}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
