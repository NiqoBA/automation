export type CaseCategory =
  | 'Todos'
  | 'Automatización'
  | 'Ventas'
  | 'Marketing/SEO'
  | 'Datos & Dashboards'
  | 'IA Conversacional'

export type CaseCategoryFilter = Exclude<CaseCategory, 'Todos'>

export interface CaseStudyCard {
  slug: string
  title: string
  client: { name: string; logo?: string }
  description: string
  metricHighlight: string
  category: CaseCategoryFilter
  tags: string[]
  image: string
  featured?: boolean
  externalUrl?: string
}

export interface CaseStudyDetail extends CaseStudyCard {
  challenge: string[]
  solution: string[]
  solutionFeatures?: string[]
  techStack: { name: string; description?: string; logo?: string }[]
  results: { label: string; value: string; icon?: string }[]
  beforeAfter?: { before: string; after: string }
  testimonial?: { quote: string; name: string; role: string; company: string; image?: string }
  gallery?: string[]
  architecture?: string
}

export const CASE_FILTERS: CaseCategory[] = [
  'Todos',
  'Automatización',
  'Ventas',
  'Marketing/SEO',
  'Datos & Dashboards',
  'IA Conversacional',
]

export const CASE_STUDIES: CaseStudyDetail[] = [
  {
    slug: 'sara-whatsapp-ventas',
    title: 'Sara: Asistente de Ventas por WhatsApp',
    client: { name: 'SouthGenetics', logo: '/imgs/logo-web-southgenetics.svg' },
    description:
      'Agente de IA que toma pedidos por WhatsApp y los ejecuta automáticamente en Odoo, desde el primer contacto hasta la factura.',
    metricHighlight: '847 pedidos procesados en 3 meses',
    category: 'Automatización',
    tags: ['WhatsApp', 'Odoo', 'Claude AI', 'Python'],
    image: '/imgs/sara.jpg',
    featured: true,
    challenge: [
      'SouthGenetics recibía cientos de consultas por WhatsApp sobre tests de paternidad prenatal, un producto complejo que requiere explicación detallada. El equipo de ventas pasaba horas respondiendo las mismas preguntas, creando cotizaciones manualmente y cargando pedidos en Odoo.',
      'El proceso manual generaba: tiempo de respuesta lento (hasta 24hrs en horario no laboral), pérdida de ventas por consultas no atendidas, errores en la carga de pedidos, falta de trazabilidad de conversaciones, e imposibilidad de escalar sin contratar más personal.',
      'Necesitaban un sistema que atendiera 24/7, explicara el producto correctamente, tomara pedidos y los ejecutara automáticamente en Odoo sin intervención humana.',
    ],
    solution: [
      'Desarrollamos Sara, un agente conversacional impulsado por Claude AI que vive en WhatsApp y se integra directamente con Odoo.',
      'Sara puede: responder consultas sobre el test de paternidad prenatal; explicar el proceso, requisitos y tiempos de entrega; tomar pedidos completos con datos del cliente; crear automáticamente contactos en Odoo; generar oportunidades de venta; crear órdenes de venta; emitir facturas; enviar la factura al cliente por WhatsApp.',
      'Todo esto sin intervención humana, con trazabilidad completa de cada interacción guardada en base de datos. El sistema usa n8n para orquestar el flujo completo, Claude AI (API) para procesamiento de lenguaje natural, WhatsApp Business API para la interfaz, Odoo API para crear y actualizar registros, y Supabase para almacenar historial de conversaciones.',
    ],
    solutionFeatures: [
      'Respuesta a consultas sobre paternidad prenatal',
      'Toma de pedidos completos por chat',
      'Creación automática de contactos y oportunidades en Odoo',
      'Generación y envío de facturas por WhatsApp',
      'Trazabilidad completa en base de datos',
      'Disponibilidad 24/7',
    ],
    techStack: [
      { name: 'n8n', description: 'Workflow automation' },
      { name: 'Claude AI API', description: 'NLP y decisiones' },
      { name: 'WhatsApp Business API' },
      { name: 'Odoo 16', description: 'ERP' },
      { name: 'Supabase', description: 'Database' },
      { name: 'Python', description: 'Scripts custom' },
    ],
    results: [
      { label: 'Pedidos procesados', value: '847 en 3 meses' },
      { label: 'Horas ahorradas/semana', value: '15 hrs' },
      { label: 'Errores en facturación', value: '0 (vs 8-10/mes previo)' },
      { label: 'Consultas sin intervención', value: '94%' },
      { label: 'Tiempo de respuesta', value: '<2 min promedio' },
    ],
    gallery: ['/imgs/sara.jpg', '/imgs/Sistema 1.png', '/imgs/sistema2.jpg'],
  },
  {
    slug: 'web-paternidad-prenatal',
    title: 'Web de Captación SEO - Paternidad Prenatal',
    client: { name: 'SouthGenetics', logo: '/imgs/logo-web-southgenetics.svg' },
    description:
      'Sitio web optimizado para SEO que captura leads orgánicos de test de paternidad prenatal en Colombia.',
    metricHighlight: 'Top 3 en Google Colombia',
    category: 'Marketing/SEO',
    tags: ['Next.js', 'SEO', 'Vercel', 'Analytics'],
    image: '/imgs/paternidadprenatal.png',
    externalUrl: 'https://paternidadprenatal.com/',
    challenge: [
      'SouthGenetics dependía 100% de campañas pagas para adquirir clientes en Colombia. No tenían presencia orgánica y cada lead costaba entre $15-$30 USD.',
      'Necesitaban: reducir dependencia de ads, capturar búsquedas orgánicas de "test de paternidad prenatal", sitio optimizado para conversión, y performance móvil excelente (80% del tráfico en LATAM).',
    ],
    solution: [
      'Desarrollamos un sitio web enfocado 100% en SEO y conversión: arquitectura de información optimizada para keywords objetivo, contenido educativo sobre paternidad prenatal, landing pages específicas por tipo de búsqueda, formulario de contacto con validación, performance optimizada (<2s carga en 4G), mobile-first design, schema markup para rich snippets, y blog integrado para contenido long-tail.',
      'Built with Next.js 14 para SSR y SEO óptimo.',
    ],
    techStack: [
      { name: 'Next.js 14', description: 'SSR/SEO' },
      { name: 'Tailwind CSS' },
      { name: 'Vercel', description: 'Hosting' },
      { name: 'Google Analytics' },
      { name: 'Google Search Console' },
    ],
    results: [
      { label: 'Posicionamiento', value: 'Top 3 Google Colombia' },
      { label: 'Visitas orgánicas/mes', value: '2,400+' },
      { label: 'Leads/mes desde orgánico', value: '180+' },
      { label: 'Costo por lead orgánico', value: '$0 (vs $15-30 ads)' },
      { label: 'Bounce rate', value: '42%' },
    ],
    gallery: ['/imgs/paternidadprenatal.png'],
  },
  {
    slug: 'profit-loss-dashboard',
    title: 'Dashboard de Márgenes por Producto',
    client: { name: 'SouthGenetics', logo: '/imgs/logo-web-southgenetics.svg' },
    description:
      'Aplicación web integrada con Odoo que muestra costo y margen por producto en tiempo real, con KPIs de ingresos.',
    metricHighlight: '100% visibilidad de márgenes',
    category: 'Datos & Dashboards',
    tags: ['Odoo', 'React', 'Dashboard', 'Supabase'],
    image: '/imgs/proffitandloss.jpg',
    externalUrl: 'https://productos-y-precios.vercel.app/login',
    challenge: [
      'El equipo de finanzas de SouthGenetics no tenía visibilidad clara de márgenes por producto. Los datos estaban en Odoo pero dispersos y requerían exportación manual a Excel.',
      'Problemas: cálculo manual de márgenes (propenso a errores), no sabían qué productos eran más rentables, decisiones de pricing sin datos concretos, reportes tardaban 2-3 días en armarse.',
    ],
    solution: [
      'Dashboard web que se conecta a Odoo en tiempo real y muestra: margen bruto y neto por producto, costo de insumos actualizado, precio de venta vs precio sugerido, KPIs de ingresos mensuales, top productos por rentabilidad, alertas de productos con margen negativo.',
      'Interfaz intuitiva para contadores sin conocimiento técnico.',
    ],
    techStack: [
      { name: 'React', description: '+ Vite' },
      { name: 'Odoo XML-RPC API' },
      { name: 'Tailwind CSS' },
      { name: 'Recharts', description: 'Gráficos' },
      { name: 'Vercel' },
    ],
    results: [
      { label: 'Visibilidad de márgenes', value: '100% en tiempo real' },
      { label: 'Horas ahorradas/mes', value: '8 hrs en reportes' },
      { label: 'Productos con margen negativo', value: '3 identificados' },
      { label: 'ROI en decisiones', value: '~$12K USD/año' },
    ],
    gallery: ['/imgs/proffitandloss.jpg', '/imgs/pyl.png'],
  },
  {
    slug: 'email-classification-ai',
    title: 'Clasificación Inteligente de Emails',
    client: { name: 'SouthGenetics', logo: '/imgs/logo-web-southgenetics.svg' },
    description:
      'Sistema que clasifica y distribuye automáticamente emails entrantes según departamento, prioridad y tipo de solicitud.',
    metricHighlight: '300+ emails/semana clasificados',
    category: 'Automatización',
    tags: ['n8n', 'Claude AI', 'Gmail', 'Automation'],
    image: '/imgs/Sistema 1.png',
    challenge: [
      'SouthGenetics recibía 300+ emails semanales en una sola bandeja. El equipo perdía tiempo clasificándolos manualmente y muchos emails importantes se perdían entre spam y consultas generales.',
    ],
    solution: [
      'Sistema de n8n + Claude AI que: lee emails entrantes automáticamente, identifica departamento destino (ventas, soporte, finanzas, etc.), clasifica por prioridad (urgente, normal, bajo), detecta tipo (consulta, reclamo, pedido, cotización), etiqueta y mueve a carpetas correspondientes, notifica al equipo relevante por Slack. Todo en tiempo real, sin intervención manual.',
    ],
    techStack: [
      { name: 'n8n' },
      { name: 'Claude AI API' },
      { name: 'Gmail API' },
      { name: 'Slack API' },
      { name: 'Google Sheets', description: 'Logs' },
    ],
    results: [
      { label: 'Accuracy en clasificación', value: '94%' },
      { label: 'Emails/semana procesados', value: '300+' },
      { label: 'Horas ahorradas/semana', value: '6 hrs' },
      { label: 'Emails importantes perdidos', value: '0' },
      { label: 'Mejora tiempo de respuesta', value: '60%' },
    ],
    gallery: ['/imgs/Sistema 1.png'],
  },
]

export function getCaseBySlug(slug: string): CaseStudyDetail | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

export function getCasesForFilter(category: CaseCategory): CaseStudyCard[] {
  if (category === 'Todos') return CASE_STUDIES as CaseStudyCard[]
  return CASE_STUDIES.filter((c) => c.category === category) as CaseStudyCard[]
}
