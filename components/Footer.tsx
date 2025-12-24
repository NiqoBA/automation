'use client'

import { Mail, Linkedin, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  
  const handleContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-black py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-4">Autonomo AI</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md">
              Automatizamos procesos repetitivos e integramos IA en tus sistemas actuales mediante la construcción de software hiper personalizado.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/company/we-automate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:contacto@weautomate.com"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Servicios</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Automatización
                </a>
              </li>
              <li>
                <a href="#consulting" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Asesorías
                </a>
              </li>
              <li>
                <a href="#work" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Casos de Éxito
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Nuestro Proceso
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:contacto@weautomate.com"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  contacto@weautomate.com
                </a>
              </li>
              <li>
                <button
                  onClick={handleContact}
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Formulario de contacto
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">{t('footer.copyright')}</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="#faq"
              className="hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href="https://linkedin.com/company/we-automate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
