'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import CaseModal from './CaseModal'

type Filter = 'Todos' | 'Automatización' | 'Integraciones' | 'Datos & Dashboards' | 'Marketing/SEO' | 'IA'

interface Project {
  id: string
  name: string
  summary: string
  tags: string[]
  category: Filter
  before: string
  after: string
  metrics: string[]
  previewType: 'whatsapp' | 'seo' | 'dashboard' | 'receipt' | 'landing'
  // Modal data
  duration: string
  problem: string[]
  construction: string[]
  result: string[]
  integrations: string[]
  stack: string[]
  automations: string[]
}

const projects: Project[] = [
  {
    id: 'sara',
    name: 'Sara — Ventas por WhatsApp + Odoo',
    summary: 'Asistente de ventas que toma pedidos por WhatsApp y los ejecuta en Odoo.',
    tags: ['Automatización', 'Integraciones', 'Odoo', 'WhatsApp'],
    category: 'Integraciones',
    before: 'Ventas manuales, carga repetitiva en Odoo, seguimiento inconsistente.',
    after: 'Flujo automático: contacto → oportunidad → orden → factura → envío.',
    metrics: ['Menos carga manual', 'Ciclo de venta más rápido', 'Menos errores de registro'],
    previewType: 'whatsapp',
    duration: '3–4 semanas',
    problem: [
      'Ventas manuales por WhatsApp sin seguimiento estructurado',
      'Carga repetitiva de datos en Odoo',
      'Seguimiento inconsistente de oportunidades'
    ],
    construction: [
      'Integración WhatsApp Business API con Odoo',
      'Flujo automatizado de captura de datos del comprador',
      'Creación automática de contactos, oportunidades y órdenes',
      'Generación y envío automático de facturas'
    ],
    result: [
      'Flujo completo automatizado desde el primer contacto',
      'Reducción significativa de carga manual',
      'Ciclo de venta más rápido y consistente',
      'Menos errores en el registro de datos'
    ],
    integrations: ['Odoo', 'WhatsApp', 'Automation'],
    stack: ['Python', 'Odoo API', 'WhatsApp Business API'],
    automations: [
      'Captura datos del comprador',
      'Crea contacto en Odoo',
      'Crea oportunidad + orden de venta',
      'Genera factura',
      'Envía factura al comprador'
    ]
  },
  {
    id: 'paternidad',
    name: 'Web Paternidad Prenatal — SEO para captación',
    summary: 'Web enfocada en SEO para vender test de paternidad prenatal en Colombia.',
    tags: ['Marketing/SEO', 'Web', 'CRO'],
    category: 'Marketing/SEO',
    before: 'Dependencia de campañas pagas / baja visibilidad orgánica.',
    after: 'Estrategia SEO + estructura orientada a conversión.',
    metrics: ['Más tráfico orgánico', 'Mejor tasa de conversión', 'Mayor calidad de leads'],
    previewType: 'seo',
    duration: '4–6 semanas',
    problem: [
      'Alta dependencia de campañas pagas',
      'Baja visibilidad orgánica en búsquedas',
      'Estructura web no optimizada para SEO'
    ],
    construction: [
      'Arquitectura SEO: páginas, intención, interlinking',
      'Copy orientado a confianza (salud)',
      'Performance y diseño mobile-first',
      'Estructura orientada a conversión'
    ],
    result: [
      'Mayor tráfico orgánico',
      'Mejor tasa de conversión',
      'Mayor calidad de leads',
      'Reducción de dependencia de campañas pagas'
    ],
    integrations: [],
    stack: ['Next.js', 'TailwindCSS', 'SEO Tools'],
    automations: []
  },
  {
    id: 'profit-loss',
    name: 'Profit & Loss App — Márgenes por producto (Odoo)',
    summary: 'App para contadores: costo y margen por producto + dashboard de ingresos.',
    tags: ['Datos & Dashboards', 'Integraciones', 'Odoo', 'Web App'],
    category: 'Datos & Dashboards',
    before: 'Márgenes dispersos, cálculo manual, poca visibilidad por producto.',
    after: 'Interfaz intuitiva + métricas + seguimiento continuo.',
    metrics: ['Visibilidad por producto', 'Decisiones más rápidas', 'Menos tiempo en reportes'],
    previewType: 'dashboard',
    duration: '3–4 semanas',
    problem: [
      'Márgenes dispersos en diferentes sistemas',
      'Cálculo manual de costos y márgenes',
      'Poca visibilidad por producto'
    ],
    construction: [
      'Integración con Odoo para datos de productos y costos',
      'Interfaz intuitiva para visualización de márgenes',
      'Dashboard de ingresos y KPIs',
      'Seguimiento continuo por producto'
    ],
    result: [
      'Visibilidad completa por producto',
      'Decisiones más rápidas basadas en datos',
      'Menos tiempo en generación de reportes',
      'Seguimiento continuo de márgenes'
    ],
    integrations: ['Odoo'],
    stack: ['Next.js', 'Odoo API', 'Chart.js'],
    automations: [
      'Cálculo automático de márgenes',
      'Sincronización de costos desde Odoo',
      'Generación de reportes'
    ]
  },
  {
    id: 'bonvoyage',
    name: 'BonVoyageApp — Gastos de viajes con IA',
    summary: 'Control de gastos: foto de factura → IA extrae y registra el gasto.',
    tags: ['IA', 'Automatización', 'Web App'],
    category: 'IA',
    before: 'Gastos en papel/Excel, errores, demoras en rendiciones.',
    after: 'Carga con foto + extracción automática + registro consistente.',
    metrics: ['Menos errores', 'Rendiciones más rápidas', 'Trazabilidad completa'],
    previewType: 'receipt',
    duration: '4–5 semanas',
    problem: [
      'Gastos registrados en papel o Excel',
      'Errores frecuentes en el registro',
      'Demoras en rendiciones de gastos'
    ],
    construction: [
      'Sistema de upload de comprobantes',
      'Extracción de monto/fecha/comercio/categoría con IA',
      'Registro y trazabilidad por empleado/viaje',
      'Interfaz para revisión y aprobación'
    ],
    result: [
      'Menos errores en el registro',
      'Rendiciones más rápidas',
      'Trazabilidad completa de gastos',
      'Proceso más eficiente para empleados'
    ],
    integrations: ['AI/ML', 'Storage'],
    stack: ['Next.js', 'OpenAI API', 'Image Processing'],
    automations: [
      'Extracción automática de datos de facturas',
      'Clasificación automática de gastos',
      'Registro automático en sistema'
    ]
  },
  {
    id: 'solara',
    name: 'SolaraAI — Landing Page',
    summary: 'Landing minimalista para una app de IA para instaladores de paneles solares.',
    tags: ['Marketing/SEO', 'Web', 'CRO'],
    category: 'Marketing/SEO',
    before: 'Propuesta difusa / baja conversión.',
    after: 'Mensaje claro + CTA + estructura orientada a demo.',
    metrics: ['Mayor claridad del mensaje', 'Mejor conversión a demo', 'Experiencia mobile sólida'],
    previewType: 'landing',
    duration: '2–3 semanas',
    problem: [
      'Propuesta de valor difusa',
      'Baja conversión a demo',
      'Estructura no optimizada para conversión'
    ],
    construction: [
      'Hero claro con mensaje directo',
      'Sección de beneficios',
      'CTA prominente a demo',
      'Diseño responsive minimal'
    ],
    result: [
      'Mayor claridad del mensaje',
      'Mejor conversión a demo',
      'Experiencia mobile sólida',
      'Estructura orientada a conversión'
    ],
    integrations: [],
    stack: ['Next.js', 'TailwindCSS'],
    automations: []
  }
]

const filters: Filter[] = ['Todos', 'Automatización', 'Integraciones', 'Datos & Dashboards', 'Marketing/SEO', 'IA']

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Todos')
  const [selectedCase, setSelectedCase] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProjects = activeFilter === 'Todos' 
    ? projects 
    : projects.filter(p => p.category === activeFilter)

  const handleOpenModal = (project: Project) => {
    setSelectedCase(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedCase(null), 200)
  }

  const renderPreview = (type: Project['previewType']) => {
    switch (type) {
      case 'whatsapp':
        return (
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl space-y-3 border border-gray-200/40">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 shadow-sm" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-300/80 rounded-md w-3/4" />
                <div className="h-3 bg-gray-300/60 rounded-md w-1/2" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium pt-2 border-t border-gray-200/60">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-sm" />
              <span>Pipeline: Contacto → Oportunidad → Orden</span>
            </div>
          </div>
        )
      case 'seo':
        return (
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl space-y-3 border border-gray-200/40">
            <div className="space-y-2">
              <div className="h-2.5 bg-blue-500/80 rounded-md w-full shadow-sm" />
              <div className="h-2.5 bg-gray-300/70 rounded-md w-4/5" />
              <div className="h-2.5 bg-gray-200/60 rounded-md w-3/5" />
            </div>
            <div className="text-xs text-gray-600 font-medium pt-2 border-t border-gray-200/60">SERP: Posición 1–3</div>
          </div>
        )
      case 'dashboard':
        return (
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl grid grid-cols-2 gap-3 border border-gray-200/40">
            <div className="h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-sm border border-blue-200/40" />
            <div className="h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow-sm border border-green-200/40" />
            <div className="h-14 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg shadow-sm border border-yellow-200/40" />
            <div className="h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-sm border border-purple-200/40" />
          </div>
        )
      case 'receipt':
        return (
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl space-y-3 border border-gray-200/40">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-300/80 rounded shadow-sm" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 bg-gray-200/80 rounded-md w-full" />
                <div className="h-2.5 bg-gray-200/60 rounded-md w-2/3" />
              </div>
            </div>
            <div className="text-xs text-gray-600 font-medium pt-2 border-t border-gray-200/60">IA: Monto, Fecha, Comercio</div>
          </div>
        )
      case 'landing':
        return (
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl space-y-3 border border-gray-200/40">
            <div className="h-10 bg-gray-200/80 rounded-lg shadow-sm" />
            <div className="h-5 bg-gray-300/70 rounded-md w-3/4" />
            <div className="h-8 bg-blue-500 rounded-lg w-1/2 shadow-sm" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section id="work" className="py-32 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F7F6F2' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-4 tracking-tight">
            <span className="relative inline-block">
              Portfolio
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" style={{ height: '4px' }} />
            </span>
          </h2>
          <p className="text-gray-600 text-xl font-light max-w-2xl">
            Proyectos en los que hemos trabajado.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 flex flex-wrap gap-3"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white rounded-2xl border border-gray-200/60 p-8 hover:border-gray-300 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 cursor-pointer"
              onClick={() => handleOpenModal(project)}
            >
              {/* Project Name */}
              <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                {project.name}
              </h3>

              {/* Summary */}
              <p className="text-base text-gray-600 mb-6 leading-relaxed font-light">
                {project.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Before → After */}
              <div className="mb-6 space-y-3 text-sm border-l-2 border-gray-200 pl-4">
                <div>
                  <span className="text-gray-500 font-medium">Antes: </span>
                  <span className="text-gray-700">{project.before}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Después: </span>
                  <span className="text-gray-700 font-medium">{project.after}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.metrics.map((metric, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100"
                  >
                    {metric}
                  </span>
                ))}
              </div>

              {/* Mini Preview */}
              <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {renderPreview(project.previewType)}
              </div>

              {/* Link */}
              <button
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group/link transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenModal(project)
                }}
              >
                Ver caso
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform duration-200" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <CaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        caseData={selectedCase}
      />
    </section>
  )
}
