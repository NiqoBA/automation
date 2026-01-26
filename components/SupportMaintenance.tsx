'use client'

import { useState } from 'react'
import {
  Check,
  ArrowRight,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Plan {
  id: string
  name: string
  price: string
  period: string
  badge?: string
  features: string[]
  idealFor: string
}

const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    price: '100',
    period: ' USD/mes',
    features: [
      'Dashboard con métricas básicas',
      'Sistema de tickets (respuesta en 48hrs hábiles)',
      '2 horas/mes de ajustes menores',
      'Monitoreo semanal de rendimiento',
      'Documentación y acceso a sistema',
    ],
    idealFor: 'Proyectos simples ya estabilizados',
  },
  {
    id: 'estandar',
    name: 'Estándar',
    price: '200',
    period: ' USD/mes',
    badge: 'MÁS POPULAR',
    features: [
      'Todo lo de Básico +',
      'Dashboard avanzado con alertas automáticas',
      'Sistema de tickets (respuesta en 24hrs hábiles)',
      '5 horas/mes de ajustes y mejoras',
      'Monitoreo diario + optimización proactiva',
      'Reuniones semanales',
      'Soporte por WhatsApp',
    ],
    idealFor: 'Automatizaciones en producción con volumen medio',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '300',
    period: ' USD/mes',
    features: [
      'Todo lo de Estándar +',
      'Dashboard personalizado con métricas custom',
      'Sistema de tickets (respuesta en 12hrs hábiles)',
      '10 horas/mes de desarrollo de nuevas features',
      'Monitoreo 24/7 con alertas en tiempo real',
      'Reuniones quincenales de estrategia',
      'Soporte prioritario por WhatsApp/Slack',
      'Acceso a roadmap de producto',
    ],
    idealFor: 'Sistemas críticos de alto volumen o múltiples automatizaciones',
  },
]

const planFaqs = [
  {
    q: '¿Puedo cambiar de plan después?',
    a: 'Sí. Puedes subir o bajar de plan en cualquier momento. Si subes, el cambio aplica de forma prorrateada. Si bajas, se refleja en el siguiente ciclo de facturación.',
  },
  {
    q: '¿Qué pasa si necesito más horas de soporte?',
    a: 'Las horas extra se cotizan por separado. Puedes comprar bloques de horas adicionales o pasar al plan superior. Te avisamos cuando te acerques al límite mensual.',
  },
  {
    q: '¿El soporte está incluido en el precio del proyecto?',
    a: 'No. El desarrollo e implementación se facturan aparte. Los planes de soporte y mantenimiento son opcionales y comienzan después del lanzamiento. Incluimos un período de cortesía post‑go‑live en la mayoría de proyectos.',
  },
]

function PlanCard({
  plan,
  index,
  isPopular,
}: {
  plan: Plan
  index: number
  isPopular: boolean
}) {
  const handleCta = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-2xl border transition-all duration-300 hover:border-white/20 ${
        isPopular
          ? 'border-purple-500/50 bg-[#0d0d0d] shadow-[0_0_40px_rgba(139,92,246,0.12)] p-6 pt-10 sm:p-8 sm:pt-12'
          : 'border-white/10 bg-[#0a0a0a] hover:bg-[#0d0d0d] p-6 sm:p-8'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">${plan.price}</span>
          <span className="text-gray-400">{plan.period}</span>
        </div>
      </div>

      <ul className="mb-6 flex-1 space-y-3" role="list">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check
              size={18}
              className="mt-0.5 flex-shrink-0 text-purple-400"
              aria-hidden
            />
            <span className="text-sm text-gray-300">{f}</span>
          </li>
        ))}
      </ul>

      <p className="mb-6 text-xs text-gray-500">
        Ideal para: <span className="text-gray-400">{plan.idealFor}</span>
      </p>

      <motion.button
        onClick={handleCta}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ${
          isPopular
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
            : 'border border-white/20 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'
        }`}
      >
        Contratar plan
      </motion.button>
    </motion.div>
  )
}

export default function SupportMaintenance() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const handleCta = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  return (
    <section
      id="support-maintenance"
      className="bg-[#000000] py-28 px-4 sm:px-6 lg:px-8"
      aria-labelledby="support-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="mb-5">
            <span className="inline-block rounded-lg border border-white/20 bg-black px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-white">
              Post-implementación
            </span>
          </div>
          <h2
            id="support-heading"
            className="text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Soporte y Mantenimiento
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 md:text-lg">
            Mantén tus automatizaciones estables, monitoreadas y mejorando con planes flexibles
            adaptados a cada etapa.
          </p>
        </motion.header>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={i}
              isPopular={plan.id === 'estandar'}
            />
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-24"
        >
          <div className="mb-8 flex items-center gap-2">
            <HelpCircle size={20} className="text-purple-400" />
            <h3 className="text-lg font-semibold text-white">
              Preguntas sobre los planes
            </h3>
          </div>
          <div className="space-y-3">
            {planFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="rounded-xl border border-white/10 bg-[#0a0a0a] transition-colors hover:border-white/15"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={faqOpen === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      faqOpen === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  className={`grid overflow-hidden border-t border-white/10 transition-[grid-template-rows] duration-200 ${
                    faqOpen === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
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
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d0d0d] to-transparent px-6 py-10 text-center sm:px-10"
        >
          <p className="mb-6 text-base text-gray-300 sm:text-lg">
            ¿No estás seguro qué plan necesitas? Agenda una llamada y te ayudamos a
            elegir.
          </p>
          <motion.button
            onClick={handleCta}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Agendar llamada
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
