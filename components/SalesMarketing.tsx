'use client'

import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, Mail, Calendar, Send } from 'lucide-react'

export default function SalesMarketing() {
  return (
    <section id="sales-marketing" className="pt-16 pb-28 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Panel - Content */}
          <div className="max-w-md mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Label */}
              <span className="inline-block px-3.5 py-1.5 bg-black border border-white rounded-lg text-white text-[10px] font-medium uppercase tracking-wide mb-4">
                Ventas y Marketing
              </span>

              {/* Headline */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
                Acelera el Crecimiento de Ventas
              </h3>

              {/* Subheadline */}
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
                Herramientas de IA para generación de leads, alcance personalizado y creación automatizada de contenido que escala tus esfuerzos de ventas y construye una presencia de marca más fuerte.
              </p>

              {/* Feature Buttons */}
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-medium hover:bg-white/10 transition-all">
                  Leads
                </button>
                <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-medium hover:bg-white/10 transition-all">
                  Contenido
                </button>
                <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-medium hover:bg-white/10 transition-all">
                  Publicación social
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Email Interface Mockup */}
          <div className="relative max-w-[400px] mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-xl p-3.5 sm:p-4 border border-white/10"
              style={{
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.1)',
              }}
            >
              {/* Top Status Bar */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <Loader2 className="text-purple-500 animate-spin" size={12} />
                  <span className="text-white text-[10px] font-medium">Enviando correo...</span>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white text-[9px] font-medium">
                  LinkedIn
                </span>
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white text-[9px] font-medium">
                  Servicios IT
                </span>
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white text-[9px] font-medium">
                  Fundadores
                </span>
              </div>

              {/* Contact Cards */}
              <div className="space-y-2 mb-3">
                {/* First Contact Card - Active */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2.5 hover:bg-white/10 transition-all"
                  style={{
                    boxShadow: '0 0 12px rgba(168, 85, 247, 0.2)',
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Profile Icon */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs">MT</span>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <h4 className="text-white font-semibold text-[10px]">Miguel Torres</h4>
                        <div className="flex items-center gap-0.5 px-1 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-[8px] text-green-400">
                          <CheckCircle2 size={7} />
                          <span>Verificado</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-[9px] mb-0.5">Fundador</p>
                      <p className="text-gray-300 text-[9px] mb-0.5">miguel@CMb.com</p>
                      <p className="text-gray-400 text-[9px]">CMB LLC</p>
                    </div>
                  </div>
                </motion.div>

                {/* Second Contact Card - Dimmed */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-white/3 backdrop-blur-sm border border-white/5 rounded-lg p-2.5 opacity-60"
                >
                  <div className="flex items-start gap-2.5">
                    {/* Profile Icon */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs">TS</span>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <h4 className="text-white font-semibold text-[10px]">Tomás Silva</h4>
                      </div>
                      <p className="text-gray-400 text-[9px] mb-0.5">CEO</p>
                      <p className="text-gray-400 text-[9px] mb-0.5">tomas@silva.com</p>
                      <p className="text-gray-500 text-[9px]">Silva Company</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex items-center gap-1.5 pt-2.5 border-t border-white/10">
                <button className="flex-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-[10px] font-medium hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-center gap-1">
                    <Mail size={12} />
                    <span>Borrador</span>
                  </div>
                </button>
                <button className="flex-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-[10px] font-medium hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar size={12} />
                    <span>Programar</span>
                  </div>
                </button>
                <button 
                  className="flex-1 px-2.5 py-1.5 rounded-lg text-white text-[10px] font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Send size={12} />
                    <span>Enviar</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

