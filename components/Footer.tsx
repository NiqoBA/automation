'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200" style={{ backgroundColor: '#F7F6F2' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">{t('footer.copyright')}</p>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://linkedin.com/company/we-automate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:hello@weautomate.com"
              className="text-gray-600 hover:text-black transition-colors"
            >
              hello@weautomate.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
