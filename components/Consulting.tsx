'use client'

import { 
  CheckCircle2, 
  Code, 
  FileText, 
  Target, 
  BarChart,
  Workflow,
  FileCode,
  Zap,
  Brain,
  Shield,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Consulting() {
  const takeaways = [
    { icon: <FileText size={20} />, text: 'Plantillas de workflows reutilizables' },
    { icon: <Target size={20} />, text: 'Checklist de arquitectura para automatizaciones' },
    { icon: <BarChart size={20} />, text: 'Plan de estudio/práctica según tu stack' }
  ]

  const learnings = [
    { icon: <Code size={20} />, text: 'Integraciones con APIs (auth, webhooks, retries, rate limits)' },
    { icon: <Workflow size={20} />, text: 'Automatización con n8n (triggers, branching, error handling)' },
    { icon: <FileCode size={20} />, text: 'Low-code + código: cuándo usar cada uno' },
    { icon: <Zap size={20} />, text: 'Diseño de flujos robustos (idempotencia, colas, observabilidad)' },
    { icon: <Brain size={20} />, text: 'Agentes de IA: herramientas, memoria, prompts y evaluación' },
    { icon: <Shield size={20} />, text: 'Buenas prácticas de producción (logs, seguridad, costos)' }
  ]

  const handleBookDevs = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'devs')
      modal.showModal()
    }
  }

  return (
    <section id="consulting" className="bg-black py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="mb-5">
            <span className="inline-block px-3.5 py-1.5 bg-black border border-white rounded-lg text-white text-[10px] font-medium uppercase tracking-wide">
              Asesorías
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
            Asesoramos devs
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto mb-6">
            De Scripts a Sistemas de Producción. Sesiones prácticas para aprender integración de APIs, automatización con n8n y construcción de agentes de IA listos para producción.
          </p>
          <p className="inline-block px-5 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white font-semibold">
            20 USD — curso completo de 6 semanas
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 sm:p-8"
        >
          
          {/* Two Column Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Left: Takeaways */}
            <div>
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
                Te llevás
              </h3>

              <div className="space-y-3">
                {takeaways.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="text-purple-400 mt-0.5 flex-shrink-0">
                      {item.icon}
                    </div>
                    <p className="text-white text-sm flex-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: What We Work On */}
            <div>
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
                En qué trabajamos
              </h3>

              <div className="space-y-3">
                {learnings.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="text-purple-400 mt-0.5 flex-shrink-0">
                      {item.icon}
                    </div>
                    <p className="text-white text-sm flex-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
            <motion.button
              onClick={handleBookDevs}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-6 py-3 bg-white text-black rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 transition-all duration-300"
            >
              Agendar 1:1 para devs
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              Ver temario
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
