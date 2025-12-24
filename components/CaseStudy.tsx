'use client'

import { ArrowRight, Bot } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import MockImage from './MockImage'

interface CaseStudyProps {
  id: string
  name: string
  descriptor: string
  tags: string
  type: 'sara' | 'paternidad' | 'profit-loss' | 'bonvoyage' | 'solara'
  imageSrc?: string
  logos?: string[]
  websiteUrl?: string
  testCredentials?: {
    email: string
    password: string
  }
  description: string
  before: string
  after: string
  results: string[]
  delivered?: string[]
  layout: 'left' | 'right'
}

export default function CaseStudy({
  id,
  name,
  descriptor,
  tags,
  type,
  imageSrc,
  logos,
  websiteUrl,
  testCredentials,
  description,
  before,
  after,
  results,
  delivered,
  layout,
}: CaseStudyProps) {
  const { t } = useLanguage()
  const handleSimilar = () => {
    const element = document.querySelector('#consulting') || document.querySelector('#cta')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isLeft = layout === 'left'

  return (
    <section id={id} className="py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            isLeft ? '' : 'lg:grid-flow-dense'
          }`}
        >
          {/* Image */}
          <div className={isLeft ? '' : 'lg:col-start-2'}>
            {/* Logos above image */}
            <div className="flex items-center gap-3 mb-3">
              {logos && logos.length > 0 && (
                <div className="flex items-center gap-2">
                  {logos.map((logo, idx) => (
                    <div key={idx} className="relative h-6 w-6">
                      <Image
                        src={logo}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 px-2.5 py-1 bg-fuchsia-900/30 border border-fuchsia-700/50 rounded-lg">
                <Bot size={16} className="text-fuchsia-400" />
                <span className="text-xs font-medium text-fuchsia-300">{t('work.caseStudy.aiIntegrated')}</span>
              </div>
            </div>
            <div className="w-full h-[300px] lg:h-[350px]">
              <MockImage type={type} imageSrc={imageSrc} />
            </div>
          </div>

          {/* Content */}
          <div className={isLeft ? '' : 'lg:col-start-1 lg:row-start-1'}>
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-1.5">{name}</h3>
              <p className="text-sm text-gray-300 mb-2">{descriptor}</p>
              <p className="text-xs text-gray-400">{tags}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{description}</p>

            {/* Before → After */}
            <div className="mb-4 space-y-1.5 text-sm border-l-2 border-gray-600 pl-3">
              <div>
                <span className="text-gray-400 font-medium">{t('work.caseStudy.before')}</span>
                <span className="text-gray-300">{before}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium">{t('work.caseStudy.after')}</span>
                <span className="text-gray-200 font-medium">{after}</span>
              </div>
            </div>

            {/* Delivered */}
            {delivered && delivered.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">{t('work.caseStudy.delivered')}</h4>
                <ul className="space-y-1.5">
                  {delivered.map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-gray-500 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Test Credentials */}
            {testCredentials && (
              <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                <p className="text-xs font-semibold text-gray-200 mb-2">{t('work.caseStudy.testUser')}</p>
                <div className="space-y-1 text-xs text-gray-300">
                  <p><span className="font-medium">{t('work.caseStudy.email')}</span> {testCredentials.email}</p>
                  <p><span className="font-medium">{t('work.caseStudy.password')}</span> {testCredentials.password}</p>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors text-sm font-semibold"
                >
                  {t('work.caseStudy.viewWeb')}
                  <ArrowRight size={16} />
                </a>
              )}
              <button
                onClick={handleSimilar}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors group border border-fuchsia-600 rounded-lg hover:bg-fuchsia-900/20"
              >
                {t('work.caseStudy.similar')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

