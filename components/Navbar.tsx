'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isLanguageMenuOpen && !target.closest('.language-selector')) {
        setIsLanguageMenuOpen(false)
      }
    }
    if (isLanguageMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isLanguageMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleBookDemo = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  const handleBookOneOnOne = () => {
    const element = document.querySelector('#cta') || document.querySelector('section:last-of-type')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'backdrop-blur-md shadow-sm border-gray-400/30' 
          : 'backdrop-blur-sm border-gray-400/20'
      }`}
      style={{ background: isScrolled ? '#FFFFFF' : 'linear-gradient(to right, rgba(15, 118, 110, 0.90), rgba(12, 74, 110, 0.90))' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.a
            href="/"
            className="flex items-center gap-3 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              isScrolled ? 'bg-teal-700' : 'bg-white'
            }`}>
              <span className={`text-2xl font-bold transition-colors ${
                isScrolled ? 'text-white' : 'text-teal-700'
              }`}>W</span>
            </div>
            <span className={`text-lg font-bold ${
              isScrolled 
                ? 'text-teal-700 hover:text-teal-800' 
                : 'text-white'
            }`}
            >
              We Automate
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '#work', key: 'nav.work' },
              { href: '#consulting', key: 'nav.consulting' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm transition-colors font-medium relative group ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-black' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {t(link.key)}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? 'bg-gray-700' : 'bg-gray-400'
                }`} />
              </a>
            ))}
            <a
              href="#cta"
              onClick={(e) => {
                e.preventDefault()
                handleBookOneOnOne()
              }}
              className={`text-sm transition-colors font-medium ${
                isScrolled 
                  ? 'text-gray-700 hover:text-black' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {t('nav.book1on1')}
            </a>
            
            {/* Language Selector */}
            <div className="relative language-selector">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLanguageMenuOpen(!isLanguageMenuOpen)
                }}
                className={`p-2 transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-black' 
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-label="Select language"
              >
                <Globe size={20} />
              </button>
              {isLanguageMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsLanguageMenuOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      language === 'en' 
                        ? 'bg-gray-50 text-gray-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('es')
                      setIsLanguageMenuOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      language === 'es' 
                        ? 'bg-gray-50 text-gray-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Español
                  </button>
                </div>
              )}
            </div>
            
            <motion.button
              onClick={handleBookDemo}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md ${
                isScrolled 
                  ? 'bg-teal-700 text-white hover:bg-teal-800' 
                  : 'bg-white text-teal-700 hover:bg-teal-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('nav.bookDemo')}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled 
                ? 'text-gray-700 hover:text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-gray-300/20"
          style={{ background: 'linear-gradient(to right, #0f766e, #0c4a6e)' }}
        >
          <div className="px-4 py-4 space-y-4">
            {[
              { href: '#work', key: 'nav.work' },
              { href: '#consulting', key: 'nav.consulting' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block transition-colors py-2 font-medium ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-black' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {t(link.key)}
              </a>
            ))}
            <a
              href="#cta"
              onClick={(e) => {
                e.preventDefault()
                handleBookOneOnOne()
              }}
              className={`block transition-colors py-2 font-medium ${
                isScrolled 
                  ? 'text-gray-700 hover:text-black' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {t('nav.book1on1')}
            </a>
            
            {/* Language Selector Mobile */}
            <div className="flex items-center gap-2 py-2">
              <Globe size={18} className={isScrolled ? 'text-gray-700' : 'text-gray-300'} />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setLanguage('en')
                  }}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    language === 'en' 
                      ? (isScrolled ? 'bg-gray-900 text-white' : 'bg-gray-500 text-white')
                      : (isScrolled ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white')
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    setLanguage('es')
                  }}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    language === 'es' 
                      ? (isScrolled ? 'bg-gray-900 text-white' : 'bg-gray-500 text-white')
                      : (isScrolled ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white')
                  }`}
                >
                  ES
                </button>
              </div>
            </div>
            
            <button
              onClick={handleBookDemo}
              className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md ${
                isScrolled 
                  ? 'bg-teal-700 text-white hover:bg-teal-800' 
                  : 'bg-white text-teal-700 hover:bg-teal-50'
              }`}
            >
              {t('nav.bookDemo')}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
