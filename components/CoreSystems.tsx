'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Brain, Receipt, Search } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CoreSystems() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)

  const systems = [
    {
      id: 'voice-whatsapp',
      icon: MessageCircle,
      tabKey: 'core.voice.tab',
      titleKey: 'core.voice.title',
      description1Key: 'core.voice.description1',
      description2Key: 'core.voice.description2',
      description3Key: 'core.voice.description3',
      useCasesKey: 'core.voice.useCases',
    },
    {
      id: 'rag-brain',
      icon: Brain,
      tabKey: 'core.rag.tab',
      titleKey: 'core.rag.title',
      description1Key: 'core.rag.description1',
      description1BoldKey: 'core.rag.description1Bold',
      description1EndKey: 'core.rag.description1End',
      description2Key: 'core.rag.description2',
      useCasesKey: 'core.rag.useCases',
    },
    {
      id: 'accounting-ai',
      icon: Receipt,
      tabKey: 'core.accounting.tab',
      titleKey: 'core.accounting.title',
      description1Key: 'core.accounting.description1',
      description2Key: 'core.accounting.description2',
      description2BoldKey: 'core.accounting.description2Bold',
      useCasesKey: 'core.accounting.useCases',
    },
    {
      id: 'lead-prospecting',
      icon: Search,
      tabKey: 'core.leads.tab',
      titleKey: 'core.leads.title',
      description1Key: 'core.leads.description1',
      description2Key: 'core.leads.description2',
      useCasesKey: 'core.leads.useCases',
    },
  ]

  return (
    <section id="core-systems" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="relative max-w-4xl mx-auto">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.1 }}
          className="text-center mb-6"
        >
          <div className="mb-5">
            <span className="inline-block px-3.5 py-1.5 bg-black border border-white rounded-lg text-white text-[10px] font-medium uppercase tracking-wide">
              Sistemas Core
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
            Los sistemas más pedidos
          </h2>
        </motion.div>

        {/* Core Systems Section */}
        <div className="relative max-w-4xl mx-auto border border-gray-700 rounded-xl p-6 sm:p-8 mt-8" style={{ backgroundColor: '#0A0A0A' }}>
        {/* Tab Navigation */}
        <div className="mb-4 relative z-10">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {systems.map((system, index) => {
              const Icon = system.icon
              return (
                <button
                  key={system.id}
                  onClick={() => setActiveTab(index)}
                  className={`group relative px-3 py-3 rounded-lg font-medium transition-all duration-300 w-20 h-20 flex items-center justify-center border cursor-pointer ${
                    activeTab === index
                      ? 'bg-white text-black shadow-sm border-gray-500'
                      : 'text-gray-400 hover:text-gray-300 border-gray-700'
                  }`}
                  style={{
                    backgroundColor: activeTab === index ? '#FFFFFF' : '#1A1A1A',
                    zIndex: 10,
                    pointerEvents: 'auto',
                  }}
                >
                  <div className="flex flex-col items-center gap-1 pointer-events-none">
                    <Icon size={16} className={activeTab === index ? 'text-black' : 'text-gray-400'} />
                    <span className="text-[10px] text-center leading-tight px-1">{t(system.tabKey)}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="relative min-h-[320px]">
          <AnimatePresence mode="wait">
            {systems.map((system, index) => {
              if (activeTab !== index) return null
              const Icon = system.icon

              return (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-4 items-stretch"
                >
                  {/* Left: Text Content Card */}
                  <div className="relative rounded-lg p-4 lg:p-6 flex flex-col justify-center overflow-hidden" style={{
                    background: 'radial-gradient(ellipse at center, rgba(26, 26, 26, 1) 0%, rgba(20, 20, 20, 0.95) 60%, rgba(10, 10, 10, 0.8) 100%)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2 tracking-tight leading-tight">
                      {t(system.titleKey)}
                    </h3>
                    {system.description1Key && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">
                        {t(system.description1Key)}
                        {system.description1BoldKey && (
                          <>
                            <strong className="font-semibold text-white"> {t(system.description1BoldKey)}</strong>
                            {system.description1EndKey && t(system.description1EndKey)}
                          </>
                        )}
                      </p>
                    )}
                    {system.description2Key && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">
                        {system.description2BoldKey ? (
                          <>
                            <strong className="font-semibold text-white">{t(system.description2BoldKey)}</strong>
                            {' '}
                            {t(system.description2Key)}
                          </>
                        ) : (
                          t(system.description2Key)
                        )}
                      </p>
                    )}
                    {system.description3Key && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">
                        {t(system.description3Key).split('*').map((part, idx) => 
                          idx % 2 === 1 ? (
                            <strong key={idx} className="font-semibold text-white">{part}</strong>
                          ) : (
                            <span key={idx}>{part}</span>
                          )
                        )}
                      </p>
                    )}
                    {system.useCasesKey && (
                      <div className="flex flex-wrap gap-1.5">
                        {t(system.useCasesKey).split(', ').map((useCase, idx) => {
                          const colors = [
                            'bg-pink-900/30 text-pink-300 border-pink-700/50',
                            'bg-blue-900/30 text-blue-300 border-blue-700/50',
                            'bg-purple-900/30 text-purple-300 border-purple-700/50',
                            'bg-green-900/30 text-green-300 border-green-700/50',
                            'bg-orange-900/30 text-orange-300 border-orange-700/50',
                            'bg-yellow-900/30 text-yellow-300 border-yellow-700/50',
                          ]
                          const colorClass = colors[idx % colors.length]
                          return (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClass}`}
                            >
                              {useCase}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right: UI Mockup Card */}
                  {system.id === 'voice-whatsapp' ? (
                    <div className="flex items-center justify-center w-full h-full relative">
                      <WhatsAppConversation />
                    </div>
                  ) : system.id === 'rag-brain' ? (
                    <div className="flex items-center justify-center w-full h-full relative">
                      <RAGConversation />
                    </div>
                  ) : system.id === 'accounting-ai' ? (
                    <div className="flex items-center justify-center w-full h-full relative">
                      <AccountingConversation />
                    </div>
                  ) : system.id === 'lead-prospecting' ? (
                    <div className="flex items-center justify-center w-full h-full relative">
                      <LeadProspectingConversation />
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <SystemMockup systemId={system.id} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </section>
  )
}

// UI Mockup Components
function SystemMockup({ systemId }: { systemId: string }) {
  if (systemId === 'voice-whatsapp') {
    return <WhatsAppMockup />
  } else if (systemId === 'rag-brain') {
    return <RAGMockup />
  } else if (systemId === 'accounting-ai') {
    return <AccountingMockup />
  }
  return null
}

// WhatsApp Conversation Component
function WhatsAppConversation() {
  return (
    <div className="w-full max-w-[320px] h-[400px] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col">
      {/* WhatsApp Header */}
      <div className="bg-[#1f2c33] px-4 py-3 flex items-center gap-3 border-b border-gray-700 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">IA</span>
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-medium">Recepcionista</div>
          <div className="text-gray-400 text-[10px] flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            En línea
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="px-3 py-4 space-y-3 bg-[#0a0a0a] flex-1 overflow-y-auto" style={{ 
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(37, 211, 102, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37, 211, 102, 0.03) 0%, transparent 50%)',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
      }}>
        {/* Customer Message 1 */}
        <div className="flex justify-start">
          <div className="max-w-[75%] bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
            <div className="text-xs text-gray-100 leading-relaxed">Hola, necesito una mesa para 4 personas</div>
            <div className="text-[9px] text-gray-500 mt-1">14:32</div>
          </div>
        </div>

        {/* AI Response 1 - Understanding Intent */}
        <div className="flex justify-end">
          <div className="max-w-[75%] bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 shadow-sm">
            <div className="text-xs text-white leading-relaxed">¡Hola! Para cuándo necesitas la reserva? Y ¿prefieres algún horario en particular?</div>
            <div className="text-[9px] text-[#99beb7] mt-1 flex items-center gap-1 justify-end">
              14:32
              <svg width="12" height="12" viewBox="0 0 16 15" className="ml-0.5">
                <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.175a.366.366 0 0 0-.063-.512z"/>
                <path fill="currentColor" d="M15.654 1.595a.416.416 0 0 0-.609-.163L8.666 7.879a.32.32 0 0 1-.484.033L5.891 5.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.688-8.22a.415.415 0 0 0-.163-.609z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Customer Message 2 */}
        <div className="flex justify-start">
          <div className="max-w-[75%] bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
            <div className="text-xs text-gray-100 leading-relaxed">Mañana a las 8</div>
            <div className="text-[9px] text-gray-500 mt-1">14:33</div>
          </div>
        </div>

        {/* AI Response 2 - State Management & Real Action */}
        <div className="flex justify-end">
          <div className="max-w-[75%] bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 shadow-sm">
            <div className="text-xs text-white leading-relaxed">Perfecto, tengo disponibilidad. ¿Tu nombre para la reserva?</div>
            <div className="text-[9px] text-[#99beb7] mt-1 flex items-center gap-1 justify-end">
              14:33
              <svg width="12" height="12" viewBox="0 0 16 15" className="ml-0.5">
                <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.175a.366.366 0 0 0-.063-.512z"/>
                <path fill="currentColor" d="M15.654 1.595a.416.416 0 0 0-.609-.163L8.666 7.879a.32.32 0 0 1-.484.033L5.891 5.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.688-8.22a.415.415 0 0 0-.163-.609z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Customer Message 3 */}
        <div className="flex justify-start">
          <div className="max-w-[75%] bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
            <div className="text-xs text-gray-100 leading-relaxed">Carlos Martínez</div>
            <div className="text-[9px] text-gray-500 mt-1">14:34</div>
          </div>
        </div>

        {/* AI Response 3 - System Sync & Confirmation */}
        <div className="flex justify-end">
          <div className="max-w-[75%] bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 shadow-sm">
            <div className="text-xs text-white leading-relaxed">Listo Carlos, reserva confirmada para mañana 8PM, 4 personas. Ya quedó registrado en el sistema. Te envío recordatorio mañana.</div>
            <div className="text-[9px] text-[#99beb7] mt-1 flex items-center gap-1 justify-end">
              14:34
              <svg width="12" height="12" viewBox="0 0 16 15" className="ml-0.5">
                <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.175a.366.366 0 0 0-.063-.512z"/>
                <path fill="currentColor" d="M15.654 1.595a.416.416 0 0 0-.609-.163L8.666 7.879a.32.32 0 0 1-.484.033L5.891 5.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.688-8.22a.415.415 0 0 0-.163-.609z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Status Badge - System Sync Indicator */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-900/20 border border-green-700/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-[10px] font-medium text-green-300">Sincronizado con sistema</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified: Only chat bubbles floating
function WhatsAppMockup() {
  return (
    <div className="w-full max-w-[280px] relative">
      <div className="space-y-3">
        {/* Incoming Message */}
        <div className="flex justify-start">
          <div className="max-w-[75%] bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-gray-700">
            <div className="text-xs text-gray-200">Quiero reservar para mañana</div>
            <div className="text-[10px] text-gray-500 mt-0.5">10:23</div>
          </div>
        </div>

        {/* Bot Response */}
        <div className="flex justify-end">
          <div className="max-w-[75%] bg-green-600 rounded-2xl rounded-tr-sm px-3 py-2 shadow-sm">
            <div className="text-xs text-white">¡Claro! Tengo espacio a las 8PM. ¿Confirmo?</div>
            <div className="text-[10px] text-green-200 mt-0.5">10:23</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-900/30 border border-blue-700/50 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-[10px] font-medium text-blue-300">Confirmado</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// RAG Conversation Component
function RAGConversation() {
  return (
    <div className="w-full max-w-[320px] h-[400px] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col">
      {/* RAG Header */}
      <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-gray-700 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
          <Brain size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-medium">Cerebro Empresarial</div>
          <div className="text-gray-400 text-[10px] flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            Indexando documentos...
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="px-3 py-4 space-y-3 bg-[#0a0a0a] flex-1 overflow-y-auto" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
      }}>
        {/* User Question - Left side, gray */}
        <div className="flex justify-start items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] text-white font-medium">U</span>
          </div>
          <div className="max-w-[75%] bg-[#2a2a2a] rounded-lg rounded-tl-none px-3 py-2 shadow-sm border border-gray-700">
            <div className="text-xs text-gray-100 leading-relaxed">¿Cómo está el rendimiento de la sucursal Centro comparado con el mes pasado?</div>
            <div className="text-[9px] text-gray-500 mt-1">10:15</div>
          </div>
        </div>

        {/* RAG Searching Indicator */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 border border-purple-700/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            <span className="text-[10px] font-medium text-purple-300">Consultando base de datos...</span>
          </div>
        </div>

        {/* RAG Response - Right side, purple/blue */}
        <div className="flex justify-end items-start gap-2">
          <div className="max-w-[80%] bg-gradient-to-br from-[#1e3a5f] to-[#2d1b4e] rounded-lg rounded-tr-none px-3 py-2.5 shadow-sm border border-purple-700/40">
            <div className="text-xs text-white leading-relaxed mb-2">
              <div className="mb-2">
                <span className="font-semibold">Sucursal Centro - Comparativo:</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div>• <span className="font-medium">Ventas:</span> $245K (este mes) vs $198K (mes pasado) - <span className="text-green-300">+23.7%</span></div>
                <div>• <span className="font-medium">Clientes:</span> 1,247 vs 1,089 - <span className="text-green-300">+14.5%</span></div>
                <div>• <span className="font-medium">Ticket promedio:</span> $196 vs $182 - <span className="text-green-300">+7.7%</span></div>
              </div>
            </div>
            
            {/* Source Citations */}
            <div className="pt-2 border-t border-purple-600/30 space-y-1.5">
              <div className="flex items-start gap-2">
                <div className="w-0.5 h-4 bg-purple-400 rounded-full mt-0.5 flex-shrink-0"></div>
                <div className="text-[9px] text-purple-200">
                  <span className="font-medium">Reporte Mensual Diciembre 2024</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-0.5 h-4 bg-purple-400 rounded-full mt-0.5 flex-shrink-0"></div>
                <div className="text-[9px] text-purple-200">
                  <span className="font-medium">BD Ventas - Sucursal Centro</span>
                </div>
              </div>
            </div>
            
            <div className="text-[9px] text-purple-300 mt-2 flex items-center gap-1 justify-end">
              10:15
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
            <Brain size={12} className="text-white" />
          </div>
        </div>

        {/* Trust Badge */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/20 border border-purple-700/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <span className="text-[10px] font-medium text-purple-300">Datos en tiempo real</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified: Only chat response with source
function RAGMockup() {
  return (
    <div className="w-full max-w-[280px] relative">
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm p-4 space-y-3">
        {/* Search indicator */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Buscando en: Manual v4...</span>
        </div>

        {/* Response */}
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-700 rounded w-full" />
          <div className="h-2 bg-gray-700 rounded w-5/6" />
        </div>

        {/* Source Citation */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-start gap-2">
            <div className="w-0.5 h-6 bg-blue-400 rounded-full" />
            <div className="text-[10px] text-gray-400">
              Fuente: Página 12, Protocolo
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Accounting Conversation Component
function AccountingConversation() {
  return (
    <div className="w-full max-w-[320px] h-[400px] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col">
      {/* Accounting Header */}
      <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-gray-700 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
          <Receipt size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-medium">Sistema Contable</div>
          <div className="text-gray-400 text-[10px] flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            Procesando documentos...
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="px-3 py-4 space-y-3 bg-[#0a0a0a] flex-1 overflow-y-auto" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
      }}>
        {/* User sends invoice image */}
        <div className="flex justify-start items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] text-white font-medium">U</span>
          </div>
          <div className="max-w-[75%] bg-[#2a2a2a] rounded-lg rounded-tl-none px-3 py-2 shadow-sm border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Receipt size={14} className="text-gray-400" />
              <span className="text-[10px] text-gray-400">factura_enero_2024.pdf</span>
            </div>
            <div className="text-xs text-gray-100 leading-relaxed">📎 Factura de proveedor</div>
            <div className="text-[9px] text-gray-500 mt-1">09:42</div>
          </div>
        </div>

        {/* System Processing Indicator */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-700/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-[10px] font-medium text-green-300">Procesando con OCR + IA...</span>
          </div>
        </div>

        {/* System Response - Extracted Data */}
        <div className="flex justify-end items-start gap-2">
          <div className="max-w-[80%] bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47] rounded-lg rounded-tr-none px-3 py-2.5 shadow-sm border border-green-700/40">
            <div className="text-xs text-white leading-relaxed mb-2">
              <div className="mb-2">
                <span className="font-semibold">✅ Factura procesada automáticamente</span>
              </div>
              <div className="space-y-1.5 text-[11px] bg-green-900/20 rounded p-2 border border-green-700/30">
                <div className="flex justify-between">
                  <span className="text-green-200">Proveedor:</span>
                  <span className="text-white font-medium">Servicios Tech S.A.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200">Monto:</span>
                  <span className="text-white font-medium">$12,450.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200">Fecha:</span>
                  <span className="text-white font-medium">15/01/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200">Categoría:</span>
                  <span className="text-white font-medium">Servicios</span>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-green-200">
                Registrado en contabilidad • Reporte actualizado
              </div>
            </div>
            
            <div className="text-[9px] text-green-300 mt-2 flex items-center gap-1 justify-end">
              09:42
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <Receipt size={12} className="text-white" />
          </div>
        </div>

        {/* User Question */}
        <div className="flex justify-start items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] text-white font-medium">U</span>
          </div>
          <div className="max-w-[75%] bg-[#2a2a2a] rounded-lg rounded-tl-none px-3 py-2 shadow-sm border border-gray-700">
            <div className="text-xs text-gray-100 leading-relaxed">¿Cuál es el total de gastos este mes?</div>
            <div className="text-[9px] text-gray-500 mt-1">09:43</div>
          </div>
        </div>

        {/* System Response - Report */}
        <div className="flex justify-end items-start gap-2">
          <div className="max-w-[80%] bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47] rounded-lg rounded-tr-none px-3 py-2.5 shadow-sm border border-green-700/40">
            <div className="text-xs text-white leading-relaxed mb-2">
              <div className="mb-2">
                <span className="font-semibold">📊 Resumen Enero 2024:</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div>• <span className="font-medium">Total Egresos:</span> <span className="text-green-300">$89,230</span></div>
                <div>• <span className="font-medium">Total Ingresos:</span> <span className="text-green-300">$156,400</span></div>
                <div>• <span className="font-medium">Balance:</span> <span className="text-green-300 font-semibold">+$67,170</span></div>
              </div>
            </div>
            
            <div className="text-[9px] text-green-300 mt-2 flex items-center gap-1 justify-end">
              09:43
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <Receipt size={12} className="text-white" />
          </div>
        </div>

        {/* Success Badge */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-900/20 border border-green-700/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-[10px] font-medium text-green-300">Procesamiento automático</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Lead Prospecting Conversation Component
function LeadProspectingConversation() {
  return (
    <div className="w-full max-w-[320px] h-[400px] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col">
      {/* Lead Prospecting Header */}
      <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-gray-700 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
          <Search size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-medium">Prospección IA</div>
          <div className="text-gray-400 text-[10px] flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
            Escaneando oportunidades...
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="px-3 py-4 space-y-3 bg-[#0a0a0a] flex-1 overflow-y-auto" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
      }}>
        {/* System Auto-detection */}
        <div className="flex justify-end items-start gap-2">
          <div className="max-w-[80%] bg-gradient-to-br from-[#5c2e0f] to-[#7a3d1a] rounded-lg rounded-tr-none px-3 py-2.5 shadow-sm border border-orange-700/40">
            <div className="text-xs text-white leading-relaxed mb-2">
              <div className="mb-2">
                <span className="font-semibold">🎯 Nuevos leads detectados</span>
              </div>
              <div className="space-y-1.5 text-[11px] bg-orange-900/20 rounded p-2 border border-orange-700/30">
                <div className="flex justify-between items-center">
                  <span className="text-orange-200">Empresa:</span>
                  <span className="text-white font-medium">TechSolutions Inc.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-200">Sector:</span>
                  <span className="text-white font-medium">Software B2B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-200">Score:</span>
                  <span className="text-orange-300 font-semibold">87/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-200">Contacto:</span>
                  <span className="text-white font-medium">CEO - LinkedIn</span>
                </div>
              </div>
            </div>
            
            <div className="text-[9px] text-orange-300 mt-2 flex items-center gap-1 justify-end">
              11:30
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
            <Search size={12} className="text-white" />
          </div>
        </div>

        {/* Scanning Indicator */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-900/20 border border-orange-700/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
            <span className="text-[10px] font-medium text-orange-300">Analizando perfil y actividad...</span>
          </div>
        </div>

        {/* System Response - Lead Details */}
        <div className="flex justify-end items-start gap-2">
          <div className="max-w-[80%] bg-gradient-to-br from-[#5c2e0f] to-[#7a3d1a] rounded-lg rounded-tr-none px-3 py-2.5 shadow-sm border border-orange-700/40">
            <div className="text-xs text-white leading-relaxed mb-2">
              <div className="mb-2">
                <span className="font-semibold">📊 Análisis completado:</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div>• <span className="font-medium">Crecimiento:</span> <span className="text-orange-300">+45% empleados (último año)</span></div>
                <div>• <span className="font-medium">Presupuesto estimado:</span> <span className="text-orange-300">$50K - $100K</span></div>
                <div>• <span className="font-medium">Necesidad detectada:</span> <span className="text-orange-300">Automatización de procesos</span></div>
                <div>• <span className="font-medium">Momento ideal:</span> <span className="text-orange-300">Expansión activa</span></div>
              </div>
              <div className="mt-2 text-[10px] text-orange-200">
                Lead calificado • Listo para contacto
              </div>
            </div>
            
            <div className="text-[9px] text-orange-300 mt-2 flex items-center gap-1 justify-end">
              11:31
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
            <Search size={12} className="text-white" />
          </div>
        </div>

        {/* User Question */}
        <div className="flex justify-start items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] text-white font-medium">U</span>
          </div>
          <div className="max-w-[75%] bg-[#2a2a2a] rounded-lg rounded-tl-none px-3 py-2 shadow-sm border border-gray-700">
            <div className="text-xs text-gray-100 leading-relaxed">¿Cuántos leads encontró hoy?</div>
            <div className="text-[9px] text-gray-500 mt-1">11:35</div>
          </div>
        </div>

        {/* System Response - Summary */}
        <div className="flex justify-end items-start gap-2">
          <div className="max-w-[80%] bg-gradient-to-br from-[#5c2e0f] to-[#7a3d1a] rounded-lg rounded-tr-none px-3 py-2.5 shadow-sm border border-orange-700/40">
            <div className="text-xs text-white leading-relaxed mb-2">
              <div className="mb-2">
                <span className="font-semibold">📈 Resumen del día:</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div>• <span className="font-medium">Leads encontrados:</span> <span className="text-orange-300">23</span></div>
                <div>• <span className="font-medium">Calificados (70+):</span> <span className="text-orange-300">15</span></div>
                <div>• <span className="font-medium">Oportunidades:</span> <span className="text-orange-300 font-semibold">$1.2M potencial</span></div>
              </div>
            </div>
            
            <div className="text-[9px] text-orange-300 mt-2 flex items-center gap-1 justify-end">
              11:35
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
            <Search size={12} className="text-white" />
          </div>
        </div>

        {/* Success Badge */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-900/20 border border-orange-700/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <span className="text-[10px] font-medium text-orange-300">Scraping inteligente activo</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified: Only ticket being scanned
function AccountingMockup() {
  return (
    <div className="w-full max-w-[280px] relative">
      <div className="bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 p-4 relative overflow-hidden">
        {/* Scanning Line Animation */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-blue-400 opacity-50"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Ticket Content */}
        <div className="relative space-y-2">
          <div className="h-1.5 bg-gray-600 rounded w-20" />
          <div className="h-1.5 bg-gray-700 rounded w-16" />
          <div className="pt-1.5 border-t border-gray-700">
            <div className="h-1.5 bg-gray-600 rounded w-14" />
          </div>
        </div>
      </div>

      {/* Extracted Data */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-700/50">
          <div className="text-[10px] text-blue-300 font-medium mb-0.5">Monto</div>
          <div className="text-xs font-semibold text-blue-200">$450</div>
        </div>
        <div className="bg-green-900/30 rounded-lg p-2 border border-green-700/50">
          <div className="text-[10px] text-green-300 font-medium mb-0.5">Listo</div>
          <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mt-1" />
        </div>
      </div>
    </div>
  )
}
