'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    id: 'basico',
    name: 'Básico',
    price: '100',
    period: '/mes',
    badge: null,
    features: [
      'Dashboard con métricas',
      'Sistema de tickets (<72hrs)',
      'Monitoreo semanal',
      'Reuniones quincenales',
      'Acceso a documentación',
    ],
    cta: 'Seleccionar plan',
    primary: false,
  },
  {
    id: 'profesional',
    name: 'Profesional',
    price: '300',
    period: '/mes',
    badge: 'Más popular',
    features: [
      'Todo lo de Básico +',
      'Alertas automáticas',
      'Sistema de tickets prioritarios <48 hrs',
      '6 horas/mes de ajustes',
      'Monitoreo diario',
      'Reunión mensual',
      'Soporte por WhatsApp',
    ],
    cta: 'Seleccionar plan',
    primary: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '500',
    period: '/mes',
    badge: null,
    features: [
      'Todo lo de Profesional +',
      'Dashboard personalizado',
      'Respuesta en <12hrs',
      '12 horas/mes de desarrollo',
      'Monitoreo 24/7',
      'Reuniones quincenales',
      'Soporte prioritario',
      'Acceso anticipado features',
    ],
    cta: 'Contactar',
    primary: false,
  },
]

export default function SupportPlans() {
  const handleCta = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  return (
    <section
      id="support-plans"
      className="bg-[#000000] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Tu proyecto sigue
            <br />
            creciendo con vos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">
            Una vez implementado, elegís el nivel de soporte que necesitás
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const isPopular = plan.badge !== null
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
                  isPopular
                    ? 'border-purple-500/50 bg-zinc-900/50 shadow-[0_0_40px_rgba(139,92,246,0.12)] p-6 pt-10 sm:p-8 sm:pt-12'
                    : 'border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 hover:border-zinc-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-purple-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="mt-0.5 flex-shrink-0 text-purple-400"
                      />
                      <span className="text-sm text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={handleCta}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mt-8 w-full rounded-xl py-3.5 text-sm font-semibold transition-all ${
                    plan.primary
                      ? 'bg-purple-600 text-white hover:bg-purple-500'
                      : 'border border-zinc-700 bg-zinc-800/50 text-white hover:border-zinc-600 hover:bg-zinc-800'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">Nota importante:</strong> Horas
            incluidas son para ajustes, optimizaciones y fixes. Nuevas
            funcionalidades se cotizan aparte.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
