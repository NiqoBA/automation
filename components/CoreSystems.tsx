'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Brain, Receipt } from 'lucide-react'
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
                      <img 
                        src="/imgs/sistema 1.png" 
                        alt="Sistema 1" 
                        className="w-full h-full object-contain"
                        style={{ transform: 'scale(1.8)' }}
                      />
                    </div>
                  ) : system.id === 'rag-brain' ? (
                    <div className="flex items-center justify-center w-full">
                      <img 
                        src="/imgs/sistema2.jpg" 
                        alt="Sistema 2" 
                        className="w-full h-auto object-contain max-w-[280px]"
                      />
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
