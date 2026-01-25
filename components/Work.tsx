'use client'

import { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import MockImage from './MockImage'

type Category = 'Automatización' | 'Marketing/SEO' | 'Datos & Dashboards' | 'IA'

interface CaseStudy {
  id: string
  name: string
  descriptor: string
  tags: string
  category: Category
  type: 'sara' | 'paternidad' | 'profit-loss' | 'bonvoyage' | 'solara'
  description: string
  before: string
  after: string
  delivered?: string[]
  imageSrc?: string
  logos?: string[]
  websiteUrl?: string
  testCredentials?: {
    email: string
    password: string
  }
}

const cases: CaseStudy[] = [
  {
    id: 'sara',
    name: 'Sara',
    descriptor: 'Ventas por WhatsApp + Odoo',
    tags: 'WhatsApp · Odoo · Automatización',
    category: 'Automatización',
    type: 'sara',
    logos: ['/imgs/WhatsApp.svg.webp', '/imgs/Odoo_logo_rgb.svg.png'],
    imageSrc: '/imgs/sara.jpg',
    description:
      'Asistente de ventas que toma pedidos por WhatsApp y los ejecuta automáticamente en Odoo. Crea contactos, oportunidades, órdenes de venta y facturas, enviando la factura al comprador sin intervención manual.',
    before: 'Ventas manuales, carga repetitiva en Odoo, seguimiento inconsistente.',
    after: 'Flujo automático desde el primer contacto hasta la factura y envío.',
    delivered: [
      'Integración con Odoo',
      'Automatización end-to-end',
      'Registro en base de datos / trazabilidad',
      'Envío automático de facturas',
    ],
  },
  {
    id: 'paternidad',
    name: 'Web Paternidad Prenatal',
    descriptor: 'SEO para captación',
    tags: 'SEO · Web · CRO · Marketing',
    category: 'Marketing/SEO',
    type: 'paternidad',
    logos: ['/imgs/WhatsApp.svg.webp', '/imgs/logo-Gmail-1.png'],
    imageSrc: '/imgs/paternidadprenatal.png',
    websiteUrl: 'https://paternidadprenatal.com/',
    description:
      'Sitio web enfocado en SEO para vender test de paternidad prenatal en Colombia. Arquitectura SEO optimizada, estructura orientada a conversión y performance mobile-first para maximizar la visibilidad orgánica y la calidad de leads.',
    before: 'Dependencia de campañas pagas, baja visibilidad orgánica.',
    after: 'Estrategia SEO implementada con estructura orientada a conversión.',
    delivered: [
      'Arquitectura SEO completa',
      'Estructura orientada a conversión',
      'Performance optimizada',
      'Diseño mobile-first',
    ],
  },
  {
    id: 'profit-loss',
    name: 'Profit & Loss App',
    descriptor: 'Márgenes por producto (Odoo)',
    tags: 'Odoo · Datos · Dashboards · Web App',
    category: 'Datos & Dashboards',
    type: 'profit-loss',
    logos: ['/imgs/Odoo_logo_rgb.svg.png', '/imgs/Google_Sheets_logo_(2014-2020).svg.png'],
    imageSrc: '/imgs/proffitandloss.jpg',
    websiteUrl: 'https://productos-y-precios.vercel.app/login',
    testCredentials: {
      email: 'niqodt@gmail.com',
      password: '123123',
    },
    description:
      'Aplicación web para contadores integrada con Odoo que muestra costo y margen por producto, junto con un dashboard de ingresos y KPIs. Permite visibilidad completa de márgenes y toma de decisiones basada en datos.',
    before: 'Márgenes dispersos, cálculo manual, poca visibilidad por producto.',
    after: 'Interfaz intuitiva con métricas claras y seguimiento continuo.',
    delivered: [
      'Integración con Odoo',
      'Dashboard de KPIs',
      'Cálculo automático de márgenes',
      'Interfaz intuitiva',
    ],
  },
  {
    id: 'bonvoyage',
    name: 'BonVoyageApp',
    descriptor: 'Gastos de viajes con IA',
    tags: 'IA · Automatización · Web App',
    category: 'IA',
    type: 'bonvoyage',
    description:
      'Aplicación de control de gastos de viajes para empleados. Permite tomar foto de la factura y la IA extrae automáticamente monto, fecha, comercio y categoría, registrando el gasto con trazabilidad completa por empleado y viaje.',
    before: 'Gastos en papel/Excel, errores, demoras en rendiciones.',
    after: 'Carga con foto, extracción automática y registro consistente.',
    delivered: [
      'Extracción automática con IA',
      'Registro y trazabilidad',
      'Interfaz de revisión y aprobación',
      'Integración con sistemas de contabilidad',
    ],
  },
  {
    id: 'solara',
    name: 'SolaraAI',
    descriptor: 'Landing Page',
    tags: 'Web · CRO · Marketing',
    category: 'Marketing/SEO',
    type: 'solara',
    description:
      'Landing page minimalista para una aplicación de IA dirigida a instaladores de paneles solares. Hero claro, sección de beneficios y CTA prominente a demo, con diseño responsive y experiencia mobile sólida.',
    before: 'Propuesta difusa, baja conversión a demo.',
    after: 'Mensaje claro con estructura orientada a conversión.',
    delivered: [
      'Hero claro con mensaje directo',
      'Sección de beneficios',
      'CTA prominente a demo',
      'Diseño responsive minimal',
    ],
  },
]

const categories: (Category | 'Todos')[] = ['Todos', 'Automatización', 'Marketing/SEO', 'Datos & Dashboards', 'IA']

export default function Work() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos')
  const [showAll, setShowAll] = useState(false)

  const filteredCases = activeCategory === 'Todos' 
    ? cases 
    : cases.filter((c) => c.category === activeCategory)

  const displayedCases = showAll ? filteredCases : filteredCases.slice(0, 3)
  const hasMore = filteredCases.length > 3

  const handleSimilar = () => {
    const element = document.querySelector('#cta')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getBadges = (caseStudy: CaseStudy) => {
    const badges: { icon: string; label: string }[] = []
    if (caseStudy.logos) {
      caseStudy.logos.forEach((logo) => {
        if (logo.includes('WhatsApp')) badges.push({ icon: '💬', label: 'WhatsApp' })
        if (logo.includes('Odoo')) badges.push({ icon: '📦', label: 'Odoo' })
        if (logo.includes('Gmail')) badges.push({ icon: '📧', label: 'Gmail' })
        if (logo.includes('Sheets')) badges.push({ icon: '📊', label: 'Sheets' })
      })
    }
    return badges
  }

  return (
    <section id="work" className="bg-black py-28 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-5">
            <span className="inline-block px-3.5 py-1.5 bg-black border border-white rounded-lg text-white text-[10px] font-medium uppercase tracking-wide">
              Experiencia
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-2">
            {t('work.title')}
          </h2>
          
          <p className="text-gray-400 text-sm">
            {t('work.subtitle')}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setShowAll(false)
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat === 'Todos' ? t('work.filter.all') : cat}
            </button>
          ))}
        </div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedCases.map((caseStudy, index) => {
            const badges = getBadges(caseStudy)
            return (
              <div
                key={caseStudy.id}
                className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 transition-all duration-500"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                }}
              >
                {/* Image Background */}
                <div className="absolute inset-0">
                  {caseStudy.imageSrc ? (
                    <Image
                      src={caseStudy.imageSrc}
                      alt={caseStudy.name}
                      fill
                      className="object-cover opacity-40 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full">
                      <MockImage type={caseStudy.type} imageSrc={caseStudy.imageSrc} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                {/* Badges (Always visible) */}
                {badges.length > 0 && (
                  <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                    {badges.map((badge, i) => (
                      <div
                        key={i}
                        className="bg-black/60 backdrop-blur-sm border border-white/20 rounded px-2 py-1 flex items-center gap-1"
                      >
                        <span className="text-xs">{badge.icon}</span>
                        <span className="text-white text-[10px] font-medium">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Default State - Title */}
                <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-white text-lg font-semibold mb-1">
                    {caseStudy.name}
                  </h3>
                  <p className="text-purple-400 text-xs font-medium">
                    {caseStudy.descriptor}
                  </p>
                </div>

                {/* Hover State - Full Info */}
                <div className="absolute inset-0 p-4 flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 overflow-y-auto">
                  
                  {/* Top Section */}
                  <div className="flex flex-col">
                    <h3 className="text-white text-lg font-semibold mb-1">
                      {caseStudy.name}
                    </h3>
                    <p className="text-purple-400 text-xs font-medium mb-2">
                      {caseStudy.descriptor}
                    </p>
                    
                    <p className="text-gray-300 text-xs leading-relaxed mb-3">
                      {caseStudy.description}
                    </p>

                    {/* Before/After */}
                    <div className="space-y-2 mb-3">
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-red-500/20">
                        <p className="text-red-400 text-[10px] font-semibold mb-1">{t('work.caseStudy.before')}:</p>
                        <p className="text-gray-400 text-[10px]">{caseStudy.before}</p>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-green-500/20">
                        <p className="text-green-400 text-[10px] font-semibold mb-1">{t('work.caseStudy.after')}:</p>
                        <p className="text-gray-300 text-[10px]">{caseStudy.after}</p>
                      </div>
                    </div>

                    {/* Deliverables */}
                    {caseStudy.delivered && caseStudy.delivered.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {caseStudy.delivered.map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <Check size={12} className="text-purple-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-[10px]">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-auto pt-2 space-y-1.5">
                    {caseStudy.websiteUrl && (
                      <a
                        href={caseStudy.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 group/btn"
                      >
                        {t('work.caseStudy.viewWeb')}
                        <ArrowUpRight size={12} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </a>
                    )}
                    <button
                      onClick={handleSimilar}
                      className="w-full bg-transparent border border-purple-500 text-purple-400 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-purple-500 hover:text-white transition-all duration-300 group/btn"
                    >
                      {t('work.caseStudy.similar')}
                      <ArrowUpRight size={12} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ver más Button */}
        {hasMore && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
            >
              Ver más
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        {showAll && (
          <div className="text-center mt-8">
            <button
              onClick={handleSimilar}
              className="group inline-flex items-center gap-2 px-6 py-2.5 bg-transparent border border-purple-500 text-purple-400 rounded-full text-sm font-medium hover:bg-purple-500 hover:text-white transition-all duration-300"
            >
              {t('work.caseStudy.similar')}
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
