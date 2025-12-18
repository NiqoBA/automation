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
    <section id="core-systems" className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#FBFBFB' }}>
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-50/30 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto border border-gray-300 rounded-2xl p-8 sm:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-teal-700" />
            <span className="text-sm font-medium text-teal-700 uppercase tracking-wider">{t('core.eyebrow')}</span>
            <div className="h-px w-12 bg-teal-700" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-2 tracking-tight">
            {t('core.title')}
          </h2>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {systems.map((system, index) => {
              const Icon = system.icon
              return (
                <button
                  key={system.id}
                  onClick={() => setActiveTab(index)}
                  className={`group relative px-4 py-4 rounded-lg font-medium transition-all duration-300 w-24 h-24 flex items-center justify-center border ${
                    activeTab === index
                      ? 'bg-white text-black shadow-sm border-gray-300'
                      : 'text-gray-700 hover:text-gray-900 border-gray-200'
                  }`}
                  style={{
                    backgroundColor: activeTab === index ? '#FFFFFF' : '#FBFBFB',
                  }}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <Icon size={18} className={activeTab === index ? 'text-black' : 'text-gray-500'} />
                    <span className="text-xs text-center leading-tight px-1">{t(system.tabKey)}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="relative min-h-[400px]">
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
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch"
                >
                  {/* Left: Text Content Card */}
                  <div className="relative rounded-xl p-6 lg:p-8 flex flex-col justify-center overflow-hidden" style={{
                    background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 60%, rgba(251, 251, 251, 0.8) 100%)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                  }}>
                    <h3 className="text-3xl sm:text-4xl font-bold text-black mb-3 tracking-tight leading-tight">
                      {t(system.titleKey)}
                    </h3>
                    {system.description1Key && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {t(system.description1Key)}
                        {system.description1BoldKey && (
                          <>
                            <strong className="font-semibold text-gray-900"> {t(system.description1BoldKey)}</strong>
                            {system.description1EndKey && t(system.description1EndKey)}
                          </>
                        )}
                      </p>
                    )}
                    {system.description2Key && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {system.description2BoldKey ? (
                          <>
                            <strong className="font-semibold text-gray-900">{t(system.description2BoldKey)}</strong>
                            {' '}
                            {t(system.description2Key)}
                          </>
                        ) : (
                          t(system.description2Key)
                        )}
                      </p>
                    )}
                    {system.description3Key && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {t(system.description3Key).split('*').map((part, idx) => 
                          idx % 2 === 1 ? (
                            <strong key={idx} className="font-semibold text-gray-900">{part}</strong>
                          ) : (
                            <span key={idx}>{part}</span>
                          )
                        )}
                      </p>
                    )}
                    {system.useCasesKey && (
                      <div className="flex flex-wrap gap-2">
                        {t(system.useCasesKey).split(', ').map((useCase, idx) => {
                          const colors = [
                            'bg-pink-50 text-pink-700 border-pink-200',
                            'bg-blue-50 text-blue-700 border-blue-200',
                            'bg-purple-50 text-purple-700 border-purple-200',
                            'bg-green-50 text-green-700 border-green-200',
                            'bg-orange-50 text-orange-700 border-orange-200',
                            'bg-yellow-50 text-yellow-700 border-yellow-200',
                          ]
                          const colorClass = colors[idx % colors.length]
                          return (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
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
                    <div className="flex items-center justify-center w-full overflow-visible">
                      <img 
                        src="/imgs/sistema 1.png" 
                        alt="Sistema 1" 
                        className="object-contain"
                        style={{ width: '120%', height: 'auto', maxWidth: 'none', transform: 'scale(1.5)' }}
                      />
                    </div>
                  ) : system.id === 'rag-brain' ? (
                    <div className="flex items-center justify-center w-full">
                      <img 
                        src="/imgs/sistema2.jpg" 
                        alt="Sistema 2" 
                        className="object-contain w-full h-auto max-w-[280px]"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-xl p-6 lg:p-8 flex items-center justify-center overflow-hidden" style={{
                      background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 60%, rgba(251, 251, 251, 0.8) 100%)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/20 pointer-events-none" />
                      <div className="relative z-10">
                        <SystemMockup systemId={system.id} />
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
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
          <div className="max-w-[75%] bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-800">Quiero reservar para mañana</div>
            <div className="text-[10px] text-gray-400 mt-0.5">10:23</div>
          </div>
        </div>

        {/* Bot Response */}
        <div className="flex justify-end">
          <div className="max-w-[75%] bg-green-500 rounded-2xl rounded-tr-sm px-3 py-2 shadow-sm">
            <div className="text-xs text-white">¡Claro! Tengo espacio a las 8PM. ¿Confirmo?</div>
            <div className="text-[10px] text-green-100 mt-0.5">10:23</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-700" />
            <span className="text-[10px] font-medium text-blue-600">Confirmado</span>
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
        {/* Search indicator */}
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Buscando en: Manual v4...</span>
        </div>

        {/* Response */}
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-200 rounded w-full" />
          <div className="h-2 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Source Citation */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <div className="w-0.5 h-6 bg-blue-500 rounded-full" />
            <div className="text-[10px] text-gray-500">
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
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 relative overflow-hidden">
        {/* Scanning Line Animation */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-blue-500 opacity-50"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Ticket Content */}
        <div className="relative space-y-2">
          <div className="h-1.5 bg-gray-300 rounded w-20" />
          <div className="h-1.5 bg-gray-200 rounded w-16" />
          <div className="pt-1.5 border-t border-gray-200">
            <div className="h-1.5 bg-gray-300 rounded w-14" />
          </div>
        </div>
      </div>

      {/* Extracted Data */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
          <div className="text-[10px] text-blue-600 font-medium mb-0.5">Monto</div>
          <div className="text-xs font-semibold text-blue-900">$450</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2 border border-green-100">
          <div className="text-[10px] text-green-600 font-medium mb-0.5">Listo</div>
          <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mt-1" />
        </div>
      </div>
    </div>
  )
}
