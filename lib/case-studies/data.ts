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
  /** Explicación opcional "Por qué RAG" u otra tecnología fue clave */
  ragExplanation?: string[]
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
    slug: 'sara-sistema-carga-ventas',
    title: 'Sara: Sistema Interno de Carga de Ventas',
    client: { name: 'SouthGenetics', logo: '/imgs/logo-web-southgenetics.svg' },
    description:
      'Agente RAG que recibe reportes de vendedores por WhatsApp y carga automáticamente en Odoo, eliminando 3 pasos manuales.',
    metricHighlight: '15 hrs/semana ahorradas',
    category: 'Automatización',
    tags: ['WhatsApp', 'Odoo', 'RAG', 'Claude AI', 'n8n'],
    image: '/imgs/sara.jpg',
    featured: true,
    challenge: [
      'SouthGenetics tenía un proceso de carga de ventas completamente manual y propenso a errores que involucraba a múltiples personas.',
      'Proceso anterior: 1) Vendedor cierra venta → Notifica por email al equipo administrativo. 2) Empleado A recibe el email → Carga datos en Google Sheets. 3) Empleado B revisa el Sheet → Carga manualmente en Odoo (ERP).',
      'Este flujo generaba: retrasos de 4-12 horas entre venta cerrada y registro en sistema; errores de transcripción en cada paso manual; doble trabajo innecesario (Sheet + Odoo); pérdida de información en la cadena de comunicación; imposibilidad de tener datos en tiempo real; 2 personas dedicando 15+ horas/semana solo a carga de datos.',
      'El equipo necesitaba eliminar los pasos manuales y que los vendedores pudieran reportar ventas directamente al sistema, sin intermediarios.',
    ],
    solution: [
      'Desarrollamos Sara, un agente RAG (Retrieval-Augmented Generation) especializado que vive en WhatsApp y entiende el proceso completo de ventas de SouthGenetics.',
      'Cómo funciona Sara: los vendedores reportan la venta por WhatsApp a Sara (como lo harían con un colega). Sara procesa el mensaje usando Claude AI con RAG sobre documentación de productos, procesos y políticas de la empresa. Extrae información clave: cliente, producto, cantidad, precio, método de pago, etc. Valida que los datos sean correctos (precios, productos existentes, etc.). Carga automáticamente la venta en Odoo con todos los campos necesarios. Confirma al vendedor que la venta fue registrada. Genera registro de auditoría en base de datos. El vendedor solo escribe un mensaje natural; Sara hace todo el resto.',
      'Ejemplo de interacción: Vendedor: "Hola Sara, vendí 2 kits de paternidad prenatal a Juan Pérez, DNI 12345678, total $450 USD, pago con transferencia". Sara: "Perfecto! Registré la venta #VT-2847 en Odoo. Cliente: Juan Pérez. 2x Kit Paternidad Prenatal. Total: $450 USD. ✅"',
      'Sara entiende variaciones de lenguaje natural, maneja información incompleta preguntando lo faltante, y tiene contexto sobre productos, precios y políticas gracias a RAG.',
    ],
    solutionFeatures: [
      'Vendedores reportan por WhatsApp en lenguaje natural',
      'Procesamiento con Claude AI + RAG sobre documentación interna',
      'Extracción y validación automática de datos (cliente, producto, precio, etc.)',
      'Carga automática en Odoo con todos los campos',
      'Confirmación inmediata al vendedor',
      'Registro de auditoría en base de datos',
      'Disponible 24/7',
    ],
    techStack: [
      { name: 'n8n', description: 'Orquestación de workflow' },
      { name: 'Claude AI API', description: 'NLP + RAG' },
      { name: 'WhatsApp Business API', description: 'Interfaz' },
      { name: 'Odoo 16 API', description: 'Destino de datos' },
      { name: 'Supabase', description: 'Base vectorial para RAG + logs' },
      { name: 'Python', description: 'Scripts de validación' },
    ],
    results: [
      { label: 'Pasos manuales', value: 'De 3 → 0' },
      { label: 'Delay venta → registro', value: 'De 4-12h → <2 min' },
      { label: 'Horas ahorradas/semana', value: '15 hrs equipo administrativo' },
      { label: 'Empleados liberados', value: '2 para tareas de mayor valor' },
      { label: 'Errores de carga', value: 'De 8-12/mes → 0' },
      { label: 'Ventas procesadas (3 meses)', value: '847' },
      { label: 'Reportes correctos 1er intento', value: '94%' },
      { label: 'Downtime desde implementación', value: '0' },
    ],
    ragExplanation: [
      'A diferencia de un simple chatbot con reglas, Sara necesitaba: entender lenguaje natural variable de vendedores; conocer el catálogo completo y precios actualizados; validar que productos y precios sean correctos; manejar casos especiales según políticas de empresa; aprender de nuevas situaciones sin reprogramación.',
      'RAG (Retrieval-Augmented Generation) permite que Sara: 1) Busque en la base de conocimiento cuando es necesario. 2) Tome decisiones informadas basadas en documentación real. 3) Valide contra el catálogo actual sin hardcodear precios. 4) Se mantenga actualizada cuando cambian productos o políticas. 5) Dé respuestas precisas sin alucinar información.',
      'Esto hace que Sara sea más inteligente que un bot de reglas y más confiable que un LLM genérico.',
    ],
    testimonial: {
      quote:
        'Sara eliminó completamente el trabajo manual de carga de ventas. Antes teníamos 2 personas dedicadas casi exclusivamente a esto, con errores constantes y demoras. Ahora los vendedores reportan en 30 segundos y el sistema se actualiza solo. Fue un gran cambio.',
      name: '',
      role: '',
      company: '',
    },
    gallery: ['/imgs/sara.jpg'],
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
