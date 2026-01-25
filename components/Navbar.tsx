'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Logo from './Logo'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    if (pathname !== '/') return
    const handleScroll = () => {
      const sections = ['hero', 'services', 'work', 'faq', 'contact']
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element) {
          const offsetTop = element.offsetTop
          if (scrollPosition >= offsetTop) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const handleBookDemo = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
    setIsMobileMenuOpen(false)
  }

  const handleBookOneOnOne = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0">
              <Logo size={40} animated={false} blur={1} />
            </div>
            <span className="text-lg font-bold text-white">
              Inflexo AI
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { href: '#hero', label: 'Inicio', id: 'hero', isPage: false },
              { href: '#services', label: 'Servicios', id: 'services', isPage: false },
              { href: '#work', label: 'Casos de éxito', id: 'work', isPage: false },
              { href: '/pricing', label: 'Pricing', id: 'pricing', isPage: true },
              { href: '#faq', label: 'FAQs', id: 'faq', isPage: false },
              { href: '#contact', label: 'Contacto', id: 'contact', isPage: false },
            ].map((link) => {
              const isSubPage = pathname === '/pricing' || pathname.startsWith('/casos')
              const isActive = link.isPage
                ? pathname === link.href
                : activeSection === link.id
              const href = link.isPage ? link.href : isSubPage ? `/${link.href}` : link.href
              return (
                <a
                  key={link.href}
                  href={href}
                  onClick={(e) => {
                    if (link.isPage) {
                      setIsMobileMenuOpen(false)
                      return
                    }
                    if (isSubPage) {
                      setIsMobileMenuOpen(false)
                      return
                    }
                    handleNavClick(e, link.href)
                  }}
                  className={`text-xs xl:text-sm text-white hover:text-gray-300 font-medium transition-colors relative ${
                    isActive ? 'text-purple-400' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
                  )}
                </a>
              )
            })}
            
            {/* Language Selector */}
            <div className="relative language-selector">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLanguageMenuOpen(!isLanguageMenuOpen)
                }}
                className="p-2 rounded-lg text-white hover:text-gray-300 transition-colors"
                aria-label="Select language"
              >
                <Globe size={20} />
              </button>
              {isLanguageMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-32 rounded-xl bg-[#1a1a1a] border border-gray-700 shadow-xl overflow-hidden z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsLanguageMenuOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      language === 'en' 
                        ? 'bg-purple-500/20 text-purple-400 font-medium' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
                        ? 'bg-purple-500/20 text-purple-400 font-medium' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    Español
                  </button>
                </div>
              )}
            </div>
            
            {/* Login Button */}
            <a
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:text-gray-300 transition-colors"
            >
              Iniciar Sesión
            </a>
            
            {/* CTA Button */}
            <button
              onClick={handleBookDemo}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {t('nav.bookDemo')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:text-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black">
            <div className="px-4 py-4 space-y-4">
              {[
                { href: '#hero', label: 'Inicio', id: 'hero', isPage: false },
                { href: '#services', label: 'Servicios', id: 'services', isPage: false },
                { href: '#work', label: 'Casos de éxito', id: 'work', isPage: false },
                { href: '/pricing', label: 'Pricing', id: 'pricing', isPage: true },
                { href: '#faq', label: 'FAQs', id: 'faq', isPage: false },
                { href: '#contact', label: 'Contacto', id: 'contact', isPage: false },
              ].map((link) => {
                const isSubPage = pathname === '/pricing' || pathname.startsWith('/casos')
                const isActive = link.isPage
                  ? pathname === link.href
                  : activeSection === link.id
                const href = link.isPage ? link.href : isSubPage ? `/${link.href}` : link.href
                return (
                  <a
                    key={link.href}
                    href={href}
                    onClick={(e) => {
                      if (link.isPage) {
                        setIsMobileMenuOpen(false)
                        return
                      }
                      if (isSubPage) {
                        setIsMobileMenuOpen(false)
                        return
                      }
                      handleNavClick(e, link.href)
                    }}
                    className={`block py-2 font-medium transition-colors rounded-lg px-3 ${
                      isActive ? 'text-purple-400' : 'text-white hover:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              })}
              
              {/* Language Selector Mobile */}
              <div className="flex items-center gap-2 py-2 px-3">
                <Globe size={18} className="text-white" />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLanguage('en')
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      language === 'en' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('es')
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      language === 'es' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ES
                  </button>
                </div>
              </div>
              
              {/* Login Button Mobile */}
              <a
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-4 py-3 rounded-lg text-white text-sm font-semibold hover:bg-gray-800 transition-colors text-center border border-gray-700"
              >
                Iniciar Sesión
              </a>
              
              <button
                onClick={handleBookDemo}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t('nav.bookDemo')}
              </button>
            </div>
        </div>
      )}
    </nav>
  )
}
