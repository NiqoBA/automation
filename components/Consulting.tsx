'use client'

import { ArrowRight, CheckCircle2, Map, Code2, ShieldCheck, Database, Zap, Workflow, Brain, FileCode, Rocket, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Consulting() {
  const { t } = useLanguage()
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

  const empresasWork = [
    { icon: Map, text: t('consulting.companiesWork1') },
    { icon: Database, text: t('consulting.companiesWork2') },
    { icon: ShieldCheck, text: t('consulting.companiesWork3') },
    { icon: Zap, text: t('consulting.companiesWork4') },
    { icon: Brain, text: t('consulting.companiesWork5') },
    { icon: ShieldCheck, text: t('consulting.companiesWork6') },
  ]

  const empresasDeliverables = [
    { icon: Target, text: t('consulting.companiesDeliverable1') },
    { icon: FileCode, text: t('consulting.companiesDeliverable2') },
    { icon: Rocket, text: t('consulting.companiesDeliverable3') },
  ]

  const devsWork = [
    { icon: Code2, text: t('consulting.devWork1') },
    { icon: Workflow, text: t('consulting.devWork2') },
    { icon: FileCode, text: t('consulting.devWork3') },
    { icon: Zap, text: t('consulting.devWork4') },
    { icon: Brain, text: t('consulting.devWork5') },
    { icon: ShieldCheck, text: t('consulting.devWork6') },
  ]

  const devsDeliverables = [
    { icon: FileCode, text: t('consulting.devDeliverable1') },
    { icon: CheckCircle2, text: t('consulting.devDeliverable2') },
    { icon: Map, text: t('consulting.devDeliverable3') },
  ]

  return (
    <section id="consulting" className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-teal-700" />
            <span className="text-sm font-medium text-teal-700 uppercase tracking-wider">{t('consulting.eyebrow')}</span>
            <div className="h-px w-12 bg-teal-700" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 tracking-tight">
            {t('consulting.title')}
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
            {t('consulting.subtitle')}
          </p>
        </motion.div>

        {/* Modern Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 p-1 border border-slate-300/50 shadow-sm">
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 shadow-md"
              initial={false}
              animate={{
                left: selectedTrack === 'empresas' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
            <button
              onClick={() => setSelectedTrack('empresas')}
              className={`relative z-10 px-8 py-2.5 text-sm font-semibold transition-colors rounded-full ${
                selectedTrack === 'empresas' ? 'text-white' : 'text-slate-600'
              }`}
            >
              Empresas
            </button>
            <button
              onClick={() => setSelectedTrack('devs')}
              className={`relative z-10 px-8 py-2.5 text-sm font-semibold transition-colors rounded-full ${
                selectedTrack === 'devs' ? 'text-white' : 'text-slate-600'
              }`}
            >
              Developers
            </button>
          </div>
        </div>

        {/* Dynamic Card - Deep Teal Premium */}
        <div className="w-full mb-16">
          <AnimatePresence mode="wait">
            {selectedTrack === 'empresas' ? (
              <motion.div
                key="empresas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="relative rounded-2xl overflow-hidden border border-teal-500/20 shadow-2xl"
                style={{
                  background: 'linear-gradient(to bottom right, #0f172a, #112425, #134e4a)',
                }}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }} />
                </div>

                <div className="relative p-8 sm:p-10 lg:p-12 text-white">
                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                      {t('consulting.forCompaniesTitle')}
                    </h3>
                    <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                      {t('consulting.forCompaniesOneLiner')}
                    </p>
                  </div>

                  {/* Grid: Deliverables + Work */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
                    {/* Left: Deliverables */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                          <CheckCircle2 size={20} className="text-teal-400" />
                        </div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Te Llevás</h4>
                      </div>
                      <ul className="space-y-3">
                        {empresasDeliverables.map((item, idx) => {
                          const Icon = item.icon
                          return (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 group"
                            >
                              <div className="mt-0.5 p-1.5 rounded-md bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                                <Icon size={16} className="text-teal-400" />
                              </div>
                              <span className="text-sm text-slate-200 leading-relaxed flex-1">{item.text}</span>
                            </motion.li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* Right: Work */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                          <Workflow size={20} className="text-teal-400" />
                        </div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">En Qué Trabajamos</h4>
                      </div>
                      <ul className="space-y-3">
                        {empresasWork.map((item, idx) => {
                          const Icon = item.icon
                          return (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 group"
                            >
                              <div className="mt-0.5 p-1.5 rounded-md bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                                <Icon size={16} className="text-teal-400" />
                              </div>
                              <span className="text-sm text-slate-200 leading-relaxed flex-1">{item.text}</span>
                            </motion.li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Footer: CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-teal-500/20">
                    <motion.button
                      onClick={() => handleBookConsulting('empresas')}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 border-2 border-white rounded-lg hover:bg-slate-50 transition-all text-sm font-semibold shadow-lg shadow-black/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('consulting.bookCompanies')}
                      <ArrowRight size={16} />
                    </motion.button>
                    <motion.button
                      onClick={handleViewWork}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white border-2 border-teal-400/50 rounded-lg hover:bg-teal-500/10 hover:border-teal-400 transition-all text-sm font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('consulting.viewProjects')}
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="devs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="relative rounded-2xl overflow-hidden border border-teal-500/20 shadow-2xl"
                style={{
                  background: 'linear-gradient(to bottom right, #0f172a, #112425, #134e4a)',
                }}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }} />
                </div>

                <div className="relative p-8 sm:p-10 lg:p-12 text-white">
                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                      {t('consulting.forDevelopersTitle')}
                    </h3>
                    <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                      {t('consulting.forDevelopersOneLiner')}
                    </p>
                  </div>

                  {/* Grid: Deliverables + Work */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
                    {/* Left: Deliverables */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                          <CheckCircle2 size={20} className="text-teal-400" />
                        </div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Te Llevás</h4>
                      </div>
                      <ul className="space-y-3">
                        {devsDeliverables.map((item, idx) => {
                          const Icon = item.icon
                          return (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 group"
                            >
                              <div className="mt-0.5 p-1.5 rounded-md bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                                <Icon size={16} className="text-teal-400" />
                              </div>
                              <span className="text-sm text-slate-200 leading-relaxed flex-1">{item.text}</span>
                            </motion.li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* Right: Work */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                          <Workflow size={20} className="text-teal-400" />
                        </div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">En Qué Trabajamos</h4>
                      </div>
                      <ul className="space-y-3">
                        {devsWork.map((item, idx) => {
                          const Icon = item.icon
                          return (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 group"
                            >
                              <div className="mt-0.5 p-1.5 rounded-md bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                                <Icon size={16} className="text-teal-400" />
                              </div>
                              <span className="text-sm text-slate-200 leading-relaxed flex-1">{item.text}</span>
                            </motion.li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Footer: CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-teal-500/20">
                    <motion.button
                      onClick={() => handleBookConsulting('devs')}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 border-2 border-white rounded-lg hover:bg-slate-50 transition-all text-sm font-semibold shadow-lg shadow-black/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('consulting.bookDevs')}
                      <ArrowRight size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        const element = document.querySelector('#consulting-temario')
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white border-2 border-teal-400/50 rounded-lg hover:bg-teal-500/10 hover:border-teal-400 transition-all text-sm font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('consulting.viewCurriculum')}
                      <ArrowRight size={16} />
                    </motion.button>
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
          className="mb-8 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-semibold text-black mb-2">{t('consulting.step1Title')}</div>
              <p className="text-sm text-gray-600">{t('consulting.step1Desc')}</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-black mb-2">{t('consulting.step2Title')}</div>
              <p className="text-sm text-gray-600">{t('consulting.step2Desc')}</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-black mb-2">{t('consulting.step3Title')}</div>
              <p className="text-sm text-gray-600">{t('consulting.step3Desc')}</p>
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
          {t('consulting.formats')}
        </motion.div>
      </div>
    </section>
  )
}
