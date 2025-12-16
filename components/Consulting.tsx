'use client'

import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Consulting() {
  const [selectedTrack, setSelectedTrack] = useState<'empresas' | 'devs'>('empresas')

  const handleBookConsulting = (type: 'empresas' | 'devs') => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', type === 'empresas' ? 'empresas' : 'developer')
      modal.showModal()
    }
  }

  const handleViewWork = () => {
    const element = document.querySelector('#work')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="consulting" className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-blue-600" />
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Asesorías 1:1</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 tracking-tight">
            Construimos claridad técnica y sistemas autosuficientes.
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-3xl">
            Sesiones prácticas para migrar de procesos manuales a sistemas centralizados, automatizados e integrados con IA.
          </p>
        </motion.div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex rounded-full bg-gradient-to-r from-blue-900 from-0% via-blue-900 via-50% via-orange-600 to-orange-600 to-100% p-1">
            <motion.div
              className={`absolute top-1 bottom-1 rounded-full ${
                selectedTrack === 'empresas' ? 'bg-blue-900' : 'bg-orange-500'
              }`}
              initial={false}
              animate={{
                left: selectedTrack === 'empresas' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
            <button
              onClick={() => setSelectedTrack('empresas')}
              className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors rounded-full ${
                selectedTrack === 'empresas' ? 'text-white' : 'text-gray-200'
              }`}
            >
              Empresas
            </button>
            <button
              onClick={() => setSelectedTrack('devs')}
              className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors rounded-full ${
                selectedTrack === 'devs' ? 'text-white' : 'text-gray-200'
              }`}
            >
              Developers
            </button>
          </div>
        </div>

        {/* Dynamic Card */}
        <div className="w-full mb-16">
          <AnimatePresence mode="wait">
            {selectedTrack === 'empresas' ? (
              <motion.div
                key="empresas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-900 rounded-2xl p-8 sm:p-10 lg:p-12 text-white"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                      Para <span className="text-white">Empresas</span>
                    </h3>
                    <p className="text-base text-blue-100 mb-6 leading-relaxed">
                      Migramos tu operación a un sistema más autosuficiente: datos centralizados, procesos claros, automatización e IA donde aporta.
                    </p>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Te llevás</h4>
                      <ul className="space-y-2">
                        <li className="text-sm text-blue-100 flex items-start gap-2">
                          <span className="text-white mt-1">✓</span>
                          <span>Un roadmap priorizado (impacto vs esfuerzo)</span>
                        </li>
                        <li className="text-sm text-blue-100 flex items-start gap-2">
                          <span className="text-white mt-1">✓</span>
                          <span>Blueprint técnico (arquitectura + integraciones + datos)</span>
                        </li>
                        <li className="text-sm text-blue-100 flex items-start gap-2">
                          <span className="text-white mt-1">✓</span>
                          <span>Plan de implementación por fases (piloto → producción)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleBookConsulting('empresas')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold"
                      >
                        Agendar asesoría
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={handleViewWork}
                        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white hover:text-blue-100 transition-colors border border-white/30 rounded-lg hover:bg-white/10"
                      >
                        Ver proyectos
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">En qué trabajamos</h4>
                    <ul className="space-y-2.5">
                      <li className="text-sm text-blue-100 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Mapeo de procesos y detección de cuellos de botella</span>
                      </li>
                      <li className="text-sm text-blue-100 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Formalización de datos: de Sheets a base estructurada</span>
                      </li>
                      <li className="text-sm text-blue-100 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Centralización: una sola fuente de verdad (ERP/CRM + DB)</span>
                      </li>
                      <li className="text-sm text-blue-100 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Automatización de tareas repetitivas (ventas, soporte, admin)</span>
                      </li>
                      <li className="text-sm text-blue-100 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Integración de IA en puntos críticos (triage, clasificación, drafting)</span>
                      </li>
                      <li className="text-sm text-blue-100 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Seguridad, permisos y trazabilidad (auditoría)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="devs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-orange-600 rounded-2xl p-8 sm:p-10 lg:p-12 text-white"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                      Para <span className="text-white">Developers</span>
                    </h3>
                    <p className="text-base text-orange-50 mb-6 leading-relaxed">
                      Sesiones prácticas para aprender integración de APIs, automatización con n8n y construcción de agentes de IA listos para producción.
                    </p>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Te llevás</h4>
                      <ul className="space-y-2">
                        <li className="text-sm text-orange-50 flex items-start gap-2">
                          <span className="text-white mt-1">✓</span>
                          <span>Plantillas de workflows reutilizables</span>
                        </li>
                        <li className="text-sm text-orange-50 flex items-start gap-2">
                          <span className="text-white mt-1">✓</span>
                          <span>Checklist de arquitectura para automatizaciones</span>
                        </li>
                        <li className="text-sm text-orange-50 flex items-start gap-2">
                          <span className="text-white mt-1">✓</span>
                          <span>Plan de estudio/práctica según tu stack</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleBookConsulting('devs')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-semibold"
                      >
                        Agendar 1:1
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => {
                          const element = document.querySelector('#consulting-temario')
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' })
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white hover:text-orange-50 transition-colors border border-white/30 rounded-lg hover:bg-white/10"
                      >
                        Ver temario
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">En qué trabajamos</h4>
                    <ul className="space-y-2.5">
                      <li className="text-sm text-orange-50 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Integraciones con APIs (auth, webhooks, retries, rate limits)</span>
                      </li>
                      <li className="text-sm text-orange-50 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Automatización con n8n (triggers, branching, error handling)</span>
                      </li>
                      <li className="text-sm text-orange-50 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Low-code + código: cuándo usar cada uno</span>
                      </li>
                      <li className="text-sm text-orange-50 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Diseño de flujos robustos (idempotencia, colas, observabilidad)</span>
                      </li>
                      <li className="text-sm text-orange-50 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Agentes de IA: herramientas, memoria, prompts y evaluación</span>
                      </li>
                      <li className="text-sm text-orange-50 flex items-start gap-2">
                        <span className="text-white mt-1 font-bold">•</span>
                        <span>Buenas prácticas de producción (logs, seguridad, costos)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 pt-8 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-semibold text-black mb-2">1) Diagnóstico</div>
              <p className="text-sm text-gray-600">Análisis de procesos y puntos de mejora</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-black mb-2">2) Diseño</div>
              <p className="text-sm text-gray-600">Arquitectura y plan de implementación</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-black mb-2">3) Implementación</div>
              <p className="text-sm text-gray-600">Ejecución por fases con seguimiento</p>
            </div>
          </div>
        </motion.div>

        {/* Session Formats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-gray-500"
        >
          Formatos: 60 min 1:1 · Workshops para equipos · Acompañamiento mensual
        </motion.div>
      </div>
    </section>
  )
}
