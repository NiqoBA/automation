'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HowItWorks() {
  const { t } = useLanguage()

  const steps = [
    {
      number: '01',
      titleKey: 'howitworks.step1.title',
      descriptionKey: 'howitworks.step1.description',
    },
    {
      number: '02',
      titleKey: 'howitworks.step2.title',
      descriptionKey: 'howitworks.step2.description',
      isHighlighted: true,
    },
    {
      number: '03',
      titleKey: 'howitworks.step3.title',
      descriptionKey: 'howitworks.step3.description',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FBFBFB' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-teal-700" />
            <span className="text-sm font-medium text-teal-700 uppercase tracking-wider">{t('howitworks.eyebrow')}</span>
            <div className="h-px w-12 bg-teal-700" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 tracking-tight">
            {t('howitworks.title')}
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            {t('howitworks.subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Connector Line (Desktop only) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
            {steps.map((step, index) => {
              const isHighlighted = step.isHighlighted

              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Number */}
                  <div className="relative mb-6">
                    <div className={`text-7xl sm:text-8xl font-bold tracking-tight ${
                      isHighlighted ? 'text-teal-600' : 'text-gray-200'
                    }`} style={{
                      WebkitTextStroke: isHighlighted ? 'none' : '1px',
                      WebkitTextStrokeColor: '#e5e7eb',
                      textStroke: isHighlighted ? 'none' : '1px',
                      textStrokeColor: '#e5e7eb',
                    }}>
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${
                      isHighlighted ? 'text-teal-700' : 'text-black'
                    }`}>
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                      {t(step.descriptionKey)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

