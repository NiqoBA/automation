'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

const logos = [
  { src: '/imgs/Odoo_logo_rgb.svg.png', alt: 'Odoo' },
  { src: '/imgs/Salesforce.com_logo.svg.png', alt: 'Salesforce' },
  { src: '/imgs/Google_Sheets_logo_(2014-2020).svg.png', alt: 'Google Sheets' },
  { src: '/imgs/logo-Gmail-1.png', alt: 'Gmail' },
  { src: '/imgs/Microsoft_Office_Teams_(2025–present).svg.png', alt: 'Microsoft Teams' },
  { src: '/imgs/Slack-logo.png', alt: 'Slack' },
  { src: '/imgs/WhatsApp.svg.webp', alt: 'WhatsApp' },
]

export default function Integrations() {
  const { t } = useLanguage()

  // Duplicar los logos para el efecto infinito
  const duplicatedLogos = [...logos, ...logos]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: '#F7F6F2' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-lg sm:text-xl font-medium text-gray-600 mb-4">
            {t('integrations.title')}
          </h2>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center gap-12"
              animate={{
                x: ['0%', '-50%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 30,
                  ease: 'linear',
                },
              }}
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.alt}-${index}`}
                  className="relative h-16 w-auto flex-shrink-0"
                  style={{ minWidth: '150px' }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={150}
                    height={64}
                    className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
