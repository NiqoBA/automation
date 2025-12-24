'use client'

import { useState } from 'react'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: '¿Cuánto cuesta automatizar mi negocio?',
      answer: 'El precio varía según la complejidad del proyecto. Nuestro modelo de pricing generalmente incluye dos componentes: un pago único por desarrollo e implementación, y luego una cuota mensual opcional por mantenimiento y soporte técnico continuo.'
    },
    {
      question: '¿Cuánto tiempo toma implementar una automatización?',
      answer: 'Depende del alcance del proyecto. Hay automatizaciones simples que se pueden realizar en pocos días, mientras que proyectos más personalizados e integraciones complejas pueden tardar varias semanas o incluso meses. Te proporcionamos un timeline claro y realista después del análisis inicial de tus necesidades.'
    },
    {
      question: '¿Necesito contratar personal técnico para mantener las automatizaciones?',
      answer: 'No necesariamente. Nosotros ofrecemos planes de soporte y mantenimiento mensuales. Además, capacitamos a tu equipo para que puedan hacer ajustes simples. Las automatizaciones que construimos son robustas y requieren mínima intervención una vez implementadas. Para cambios mayores, siempre estamos disponibles.'
    },
    {
      question: '¿Pueden integrarse con nuestro software actual?',
      answer: 'Sí, absolutamente. Si tu software tiene una API (la mayoría la tienen), podemos integrarnos. Hemos trabajado con Odoo, Salesforce, SAP, sistemas custom, ERPs propietarios, y más. Si no tiene API, exploramos alternativas como web scraping o integraciones indirectas. En la llamada inicial evaluamos la viabilidad técnica.'
    },
    {
      question: '¿Qué tipos de procesos se pueden automatizar?',
      answer: 'Casi cualquier proceso repetitivo: atención al cliente (chatbots, respuestas automáticas), ventas (CRM, seguimiento, facturación), operaciones (reportes, sincronización de datos), marketing (emails, publicaciones), HR (onboarding, documentación). Si lo haces más de 2 veces al día, probablemente se puede automatizar.'
    },
    {
      question: '¿Los agentes de IA realmente funcionan o son solo hype?',
      answer: 'Funcionan muy bien para casos de uso específicos: atención al cliente (FAQs, derivación), análisis de datos (extraer insights), generación de contenido (emails, reportes), y asistencia en ventas. NO son mágicos: necesitan buenos prompts, validación humana en loops críticos, y contexto adecuado. Te ayudamos a identificar dónde IA agrega valor real vs donde es overkill.'
    },
    {
      question: '¿Cómo garantizan la seguridad y privacidad de nuestros datos?',
      answer: 'Usamos APIs con OAuth2, encriptación en tránsito y reposo, tokens seguros, y nunca almacenamos credenciales en texto plano. Para datos sensibles, implementamos arquitecturas zero-trust. Cumplimos con mejores prácticas de seguridad y podemos firmar NDAs. Si tienes compliance específico (HIPAA, GDPR), lo diseñamos según esos estándares.'
    },
    {
      question: '¿Cómo es el proceso de trabajo?',
      answer: 'Seguimos 5 pasos: (1) Discovery - entendemos tu negocio y necesidades, (2) Propuesta - diseñamos la solución y presupuesto, (3) Desarrollo - construimos en sprints iterativos con feedback continuo, (4) Testing - validamos con casos reales, (5) Deploy y Soporte - lanzamos y te acompañamos post-implementación. Comunicación constante por Slack/WhatsApp.'
    },
    {
      question: '¿Ofrecen garantía o prueba gratuita?',
      answer: 'Ofrecemos una llamada de discovery gratuita donde evaluamos viabilidad. Para ciertos proyectos, podemos hacer un piloto/MVP reducido para validar antes de escalar. Garantizamos que la automatización funcione según especificaciones acordadas. Si algo falla por nuestra culpa, lo arreglamos sin costo. Queremos que estés 100% satisfecho.'
    },
    {
      question: '¿Funciona para empresas pequeñas o solo grandes corporaciones?',
      answer: 'Trabajamos con ambas. Startups y pequeños negocios se benefician de automatizaciones simples que ahorran horas semanales. Empresas medianas/grandes requieren integraciones más robustas multi-sistema. Nuestras soluciones escalan: empiezas pequeño y creces según lo necesites. El ROI es claro sin importar el tamaño.'
    },
    {
      question: '¿Qué pasa si necesitamos cambiar algo después de la implementación?',
      answer: 'Ofrecemos planes de mantenimiento mensuales que incluyen ajustes, mejoras, y soporte técnico. También puedes contratar horas ad-hoc para cambios puntuales. Las automatizaciones se documentan completamente, así que cualquier desarrollador (o nosotros) puede modificarlas en el futuro. Te damos autonomía o soporte continuo, tú eliges.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="faq" className="bg-[#0a0a0a] py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-5">
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
              FAQ
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
            Preguntas Frecuentes
          </h2>
          
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre nuestros servicios de automatización
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-gradient-to-b from-[#0d0d0d] to-transparent rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                openIndex === index 
                  ? 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' 
                  : 'border-white/[0.08] hover:border-purple-500/30'
              }`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 flex items-start justify-between gap-4 text-left"
              >
                <span className="text-white text-base md:text-lg font-semibold flex-1">
                  {faq.question}
                </span>
                
                <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  {openIndex === index ? (
                    <Minus size={20} className="text-purple-400" />
                  ) : (
                    <Plus size={20} className="text-purple-400" />
                  )}
                </div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">
            ¿No encuentras tu respuesta?
          </p>
          
          <motion.button
            onClick={handleContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300"
          >
            Contáctanos
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

      </div>
    </section>
  )
}
