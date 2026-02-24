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
  devTime: string
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
    title: 'Sara: IA para Automatización de Ventas',
    client: { name: 'SouthGenetics', logo: '/imgs/logo-web-southgenetics.svg' },
    description:
      'Agente RAG que procesa reportes de ventas por WhatsApp y los sincroniza en Odoo al instante.',
    metricHighlight: 'Eliminación del 100% de la carga manual',
    category: 'Automatización',
    tags: ['IA', 'Odoo', 'WhatsApp', 'Eficiencia'],
    image: '/imgs/image.png',
    featured: true,
    challenge: [
      'Un proceso manual de 3 pasos (Email → Sheets → Odoo) generaba retrasos de hasta 12 horas y errores frecuentes de transcripción.',
      'El equipo administrativo perdía 15 horas semanales solo en tareas de carga repetitiva, sin visibilidad de datos en tiempo real.',
    ],
    solution: [
      'Creamos a **Sara**, un agente con IA avanzada (RAG) que vive en WhatsApp. Los vendedores reportan en lenguaje natural y Sara hace el resto: extrae datos, valida stock/precios contra el catálogo real y genera la orden en Odoo en segundos.',
      'Además, implementamos un **Dashboard integral** para la gerencia, permitiendo el monitoreo total de las conversaciones y métricas de rendimiento en tiempo real, asegurando un control absoluto del flujo comercial.',
      '**Situación actual:** Tras el éxito de la fase inicial, el sistema está en pleno proceso de expansión para ser aplicado en los distintos países de Latam donde la empresa tiene presencia.',
    ],
    solutionFeatures: [
      'Reporte de ventas en lenguaje natural por WhatsApp',
      'Sincronización instantánea con Odoo',
      'Dashboard de control y analítica para gerencia',
      'Monitoreo total de conversaciones con IA',
      'Validación automática de datos y políticas',
    ],
    devTime: '24 días',
    results: [
      { label: 'Trabajo manual', value: 'Reducido a 0' },
      { label: 'Ventas procesadas (3 meses)', value: '523' },
      { label: 'Ahorro administrativo', value: '20h semanales' },
      { label: 'Tiempo de registro', value: '< 2 minutos' },
      { label: 'Error de datos', value: '0%' },
      { label: 'Visibilidad centralizada', value: '100%' },
    ],
    ragExplanation: [
      'Sara no es un bot rígido; gracias al RAG, entiende el contexto de la empresa, valida precios dinámicos y responde con precisión humana, eliminando las alucinaciones típicas de los modelos de IA genéricos.',
    ],
    testimonial: {
      quote:
        'Pasamos de un caos de Excel y demoras a un sistema donde las ventas se asientan solas. Sara nos devolvió tiempo valioso y eliminó los errores de carga por completo.',
      name: '',
      role: '',
      company: '',
    },
    gallery: ['/imgs/image.png'],
  },
  {
    slug: 'web-paternidad-prenatal',
    title: 'Ecosistema de Ventas 95% Automatizado - Paternidad Prenatal',
    client: { name: 'Paternidad Prenatal', logo: '' },
    description:
      'Lanzamiento de producto con captación híbrida (SEO + Ads) y cierre asistido por IA. Un sistema diseñado para generar ventas de forma prácticamente pasiva.',
    metricHighlight: 'Ventas 95% Automatizadas',
    category: 'Marketing/SEO',
    tags: ['Next.js', 'SEO', 'Google Ads', 'IA RAG'],
    image: '/imgs/paternidadprenatal.png',
    externalUrl: 'https://paternidadprenatal.com/',
    challenge: [
      'El cliente buscaba lanzar un nuevo producto de alto valor sin quedar atrapado en la gestión operativa. El desafío era crear una máquina de ventas que funcionara sola, captando, filtrando y convenciendo sin intervención humana constante.'
    ],
    solution: [
      'Diseñamos un embudo de ventas de "cero fricción": una web optimizada para dominar Google orgánicamente y campañas de Ads de alta precisión que alimentan el sistema con 20+ leads diarios.',
      'La pieza clave: un **recepcionista RAG con IA** que actúa como el mejor vendedor de la empresa. Atiende, educa y califica a los leads por WhatsApp y Email en tiempo real. El sistema entrega ventas "llave en mano", donde el equipo humano solo debe procesar el pago cuando el cliente ya está listo.',
      '**Presencia Internacional:** El sistema ya se encuentra operativo con éxito en **Colombia, Venezuela y Argentina**, y se proyecta su expansión continua hacia nuevos mercados de la región.',
    ],
    devTime: '15 días',
    results: [
      { label: 'Automatización del funnel', value: '95%' },
      { label: 'Ingresos generados', value: 'Prácticamente pasivos' },
      { label: 'Leads diarios calificados', value: '20+' },
      { label: 'Ventas mínimas', value: '2 por semana' },
      { label: 'Operación del sistema', value: '24/7 sin descanso' },
    ],
    testimonial: {
      quote:
        'Lanzamos el producto en tiempo récord y las ventas empezaron a caer solas. El recepcionista de IA filtra todo el ruido y solo nos ocupamos de cobrar.',
      name: 'Andrés G.',
      role: 'Director de Marketing',
      company: 'Paternidad Prenatal',
    },
    gallery: ['/imgs/paternidadprenatal.png'],
  },
  {
    slug: 'profit-loss-dashboard',
    title: 'BI & Analytics Centralizado - El Cerebro Financiero Regional',
    client: { name: 'SouthGenetics', logo: '/imgs/logo-web-southgenetics.svg' },
    description:
      'Ecosistema de Business Intelligence que centraliza Odoo, Google Sheets y archivos locales en una única fuente de verdad para el control total de ventas y rentabilidad en LATAM.',
    metricHighlight: 'Centralización de información -> mejores decisiones',
    category: 'Datos & Dashboards',
    tags: ['Odoo', 'React', 'Data Sync', 'BI'],
    image: '/imgs/proffitandloss.jpg',
    externalUrl: 'https://productos-y-precios.vercel.app/login',
    challenge: [
      'La información vivía fragmentada: cada empleado manejaba sus propios datos, Sheets y archivos locales, lo que generaba discrepancias críticas. No había una fuente de verdad única para tomar decisiones.',
      'Era imposible conocer la rentabilidad líquida real por país o comparar de forma ágil el rendimiento de los más de 150 productos debido a la descentralización de la información financiera.'
    ],
    solution: [
      'Construimos el "Cerebro Financiero": un sistema web avanzado que unifica Odoo con Google Sheets y bases de datos locales. Ahora, toda la organización opera sobre los mismos números, sin errores de conciliación.',
      'El sistema ofrece un desglose atómico de la operación: registro de cada venta, proyecciones vs. objetivos, márgenes operativos para los 150+ productos, gastos detallados, descuentos aplicados y la ganancia líquida real por cada transacción.',
      'Integramos analítica avanzada para descubrir patrones: qué categorías venden más, cuáles son los picos de demanda y cómo rinde cada país de Latinoamérica en una comparativa regional instantánea.',
      '**Sincronización Total:** Las nuevas ventas se registran automáticamente al entrar al sistema de facturación de SouthGenetics, lo que garantiza que la actualización de la información sea 100% automática y en tiempo real.',
    ],
    solutionFeatures: [
      'Sincronización Odoo + Google Sheets + Local Data',
      'Integración automática con sistema de facturación',
      'Control de márgenes para 150+ productos',
      'Cálculo de ganancia bruta y líquida en tiempo real',
      'Dashboard de proyecciones y objetivos de venta',
      'Comparativa de performance regional (LATAM)',
      'Analítica de tendencias: qué, cuándo y cuánto se vende',
    ],
    devTime: '30 días',
    results: [
      { label: 'Automatización de carga', value: '100% (Sync Facturación)' },
      { label: 'Unificación de datos', value: '100% (Cero discrepancias)' },
      { label: 'Visibilidad de productos', value: '150+ monitoreados' },
      { label: 'Métricas regionales', value: 'Total LATAM' },
      { label: 'Precisión de rentabilidad', value: 'Margen Líquido Real' },
    ],
    testimonial: {
      quote:
        'Hubo un antes y un después en nuestra operación. Poder ver realmente qué se vende, qué genera ganancia y qué pérdida. Nos dio el control absoluto para tomar decisiones basadas en datos reales y no en suposiciones.',
      name: 'Mariana R.',
      role: 'Gerente de Finanzas',
      company: 'SouthGenetics',
    },
    gallery: ['/imgs/proffitandloss.jpg', '/imgs/pyl.png'],
  },
  {
    slug: 'email-classification-ai',
    title: 'IA Inbox Copilot - Zero Inbox & Gestión de Tareas Automática',
    client: { name: 'Operación Inteligente', logo: '' },
    description:
      'Sistema inteligente de gestión de correo que clasifica, redacta borradores y organiza tareas automáticamente, eliminando el caos operativo y el exceso de reuniones.',
    metricHighlight: 'Gestión de Inbox 100% Organizada',
    category: 'Automatización',
    tags: ['n8n', 'Claude AI', 'Gmail', 'Productividad'],
    image: '/imgs/inbox.jpg',
    challenge: [
      'Bandejas de entrada desbordadas con cientos de correos acumulados sin orden ni prioridad clara.',
      'Tareas críticas sepultadas bajo spam y consultas generales, lo que generaba pérdida de oportunidades.',
      'Exceso de reuniones de coordinación para intentar poner orden al flujo constante de información por email.',
    ],
    solution: [
      'Implementamos un sistema autónomo que añade etiquetas personalizadas a cada email entrante, clasificándolos instantáneamente por intención, departamento y urgencia.',
      'La IA genera borradores de respuesta sugeridos que aprenden del comportamiento del usuario: el sistema se vuelve más preciso y natural con cada corrección o envío.',
      'Integramos una gestión proactiva del calendario y un Dashboard centralizado donde las tareas se segmentan automáticamente, asegurando que el usuario tenga visibilidad total y nunca olvide un compromiso.',
    ],
    devTime: '10 días',
    results: [
      { label: 'Clasificación de correos', value: '100% Automática' },
      { label: 'Redacción de respuestas', value: 'Borradores sugeridos con IA' },
      { label: 'Seguimiento de tareas', value: 'Dashboard visual' },
      { label: 'Tiempo en Inbox', value: 'Reducción del 70%' },
      { label: 'Reuniones de orden', value: 'Eliminadas' },
    ],
    gallery: ['/imgs/inbox.jpg'],
    testimonial: {
      quote:
        'Fue un cambio radical en nuestra productividad. Antes el Inbox era una lista de problemas sin fin, ahora es un centro de trabajo ordenado donde la IA nos adelanta el 80% de la tarea administrativa.',
      name: 'Daniel S.',
      role: 'Director de Operaciones',
      company: '',
    },
  },
]

export function getCaseBySlug(slug: string): CaseStudyDetail | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

export function getCasesForFilter(category: CaseCategory): CaseStudyCard[] {
  if (category === 'Todos') return CASE_STUDIES as CaseStudyCard[]
  return CASE_STUDIES.filter((c) => c.category === category) as CaseStudyCard[]
}
