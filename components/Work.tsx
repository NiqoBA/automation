'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CaseStudy from './CaseStudy'

type Category = 'Automatización' | 'Marketing/SEO' | 'Datos & Dashboards' | 'IA'

interface Case {
  id: string
  name: string
  descriptor: string
  tags: string
  category: Category
  type: 'sara' | 'paternidad' | 'profit-loss' | 'bonvoyage' | 'solara'
  logos?: string[]
  imageSrc?: string
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

const cases: Case[] = [
  {
    id: 'sara',
    name: 'Sara — Ventas por WhatsApp + Odoo',
    descriptor: 'Asistente de ventas automatizado',
    tags: 'WhatsApp · Odoo · Automatización',
    category: 'Automatización',
    type: 'sara',
    logos: ['/imgs/WhatsApp.svg.webp', '/imgs/Odoo_logo_rgb.svg.png'],
    imageSrc: '/imgs/sara.jpg',
    description:
      'Asistente de ventas que toma pedidos por WhatsApp y los ejecuta automáticamente en Odoo. Crea contactos, oportunidades, órdenes de venta y facturas, enviando la factura al comprador sin intervención manual.',
    before: 'Ventas manuales, carga repetitiva en Odoo, seguimiento inconsistente.',
    after: 'Flujo automático desde el primer contacto hasta la factura y envío.',
    results: [
      'Menos carga manual en operaciones',
      'Ciclo de venta más rápido',
      'Menos errores de registro',
    ],
    delivered: [
      'Integración con Odoo',
      'Automatización end-to-end',
      'Registro en base de datos / trazabilidad',
      'Envío automático de facturas',
    ],
    layout: 'left',
  },
  {
    id: 'paternidad',
    name: 'Web Paternidad Prenatal — SEO para captación',
    descriptor: 'Sitio web orientado a SEO y conversión',
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
    results: [
      'Mayor visibilidad orgánica',
      'Mayor calidad de leads',
      'Mejor claridad de conversión',
    ],
    delivered: [
      'Arquitectura SEO completa',
      'Estructura orientada a conversión',
      'Performance optimizada',
      'Diseño mobile-first',
    ],
    layout: 'right',
  },
  {
    id: 'profit-loss',
    name: 'Profit & Loss App — Márgenes por producto (Odoo)',
    descriptor: 'App web para contadores integrada con Odoo',
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
    results: [
      'Visibilidad por producto',
      'Decisiones más rápidas',
      'Menos tiempo en reportes',
    ],
    delivered: [
      'Integración con Odoo',
      'Dashboard de KPIs',
      'Cálculo automático de márgenes',
      'Interfaz intuitiva',
    ],
    layout: 'left',
  },
  {
    id: 'bonvoyage',
    name: 'BonVoyageApp — Gastos de viajes con IA',
    descriptor: 'Control de gastos con extracción automática',
    tags: 'IA · Automatización · Web App',
    category: 'IA',
    type: 'bonvoyage',
    description:
      'Aplicación de control de gastos de viajes para empleados. Permite tomar foto de la factura y la IA extrae automáticamente monto, fecha, comercio y categoría, registrando el gasto con trazabilidad completa por empleado y viaje.',
    before: 'Gastos en papel/Excel, errores, demoras en rendiciones.',
    after: 'Carga con foto, extracción automática y registro consistente.',
    results: [
      'Menos errores',
      'Rendiciones más rápidas',
      'Trazabilidad completa',
    ],
    delivered: [
      'Extracción automática con IA',
      'Registro y trazabilidad',
      'Interfaz de revisión y aprobación',
      'Integración con sistemas de contabilidad',
    ],
    layout: 'right',
  },
  {
    id: 'solara',
    name: 'SolaraAI — Landing Page',
    descriptor: 'Landing minimalista para producto de IA',
    tags: 'Web · CRO · Marketing',
    category: 'Marketing/SEO',
    type: 'solara',
    description:
      'Landing page minimalista para una aplicación de IA dirigida a instaladores de paneles solares. Hero claro, sección de beneficios y CTA prominente a demo, con diseño responsive y experiencia mobile sólida.',
    before: 'Propuesta difusa, baja conversión a demo.',
    after: 'Mensaje claro con estructura orientada a conversión.',
    results: [
      'Mayor claridad del mensaje',
      'Mejor conversión a demo',
      'Experiencia mobile sólida',
    ],
    delivered: [
      'Hero claro con mensaje directo',
      'Sección de beneficios',
      'CTA prominente a demo',
      'Diseño responsive minimal',
    ],
    layout: 'left',
  },
]

const categories: Category[] = ['Automatización', 'Marketing/SEO', 'Datos & Dashboards', 'IA']

export default function Work() {
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos')
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredCases = activeCategory === 'Todos' 
    ? cases 
    : cases.filter((c) => c.category === activeCategory)

  const nextCase = () => {
    if (filteredCases.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredCases.length)
    }
  }

  const prevCase = () => {
    if (filteredCases.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredCases.length) % filteredCases.length)
    }
  }

  const handleCategoryChange = (category: Category | 'Todos') => {
    setActiveCategory(category)
    setCurrentIndex(0)
  }

  const currentCase = filteredCases.length > 0 ? filteredCases[currentIndex] : null

  return (
    <section id="work" className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F7F6F2' }}>
      <div className="max-w-7xl mx-auto border border-gray-300 rounded-lg p-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-blue-600" />
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Experience</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-3 tracking-tight">
            Proyectos
          </h2>
          <p className="text-lg text-gray-600 font-light">Sistemas reales de automatización, IA e integraciones.</p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryChange('Todos')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === 'Todos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200/60'
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="relative">
          {filteredCases.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                {currentCase && (
                  <motion.div
                    key={`${activeCategory}-${currentIndex}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CaseStudy {...currentCase} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              {filteredCases.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={prevCase}
                    className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>
                  <div className="flex items-center gap-2">
                    {filteredCases.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                        }`}
                        aria-label={`Ir a caso ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextCase}
                    className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No hay casos en esta categoría.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

