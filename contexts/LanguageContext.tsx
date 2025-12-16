'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navbar
    'nav.work': 'Projects',
    'nav.consulting': 'Consulting',
    'nav.results': 'Results',
    'nav.book1on1': 'Contact',
    'nav.bookDemo': 'Start Now',
    
    // Hero
    'hero.badge': 'AI + Automation Studio',
    'hero.title': 'Digital transformation for companies',
    'hero.subtitle': 'We automate repetitive processes and integrate AI into your current systems.',
    'hero.cta.demo': 'Start Now',
    'hero.cta.work': 'View Work',
    'hero.microline.erp': 'ERP/CRM',
    'hero.microline.sheets': 'Sheets → DB',
    'hero.microline.automations': 'Production automations',
    
    // Portfolio
    'portfolio.title': 'Selected Work',
    'portfolio.viewCase': 'View Case',
    'portfolio.problem': 'Problem',
    'portfolio.build': 'Build',
    'portfolio.outcome': 'Outcome',
    'portfolio.techStack': 'Tech Stack',
    'portfolio.result': 'Result',
    
    // Consulting
    'consulting.eyebrow': '1:1 Consulting',
    'consulting.title': 'We build technical clarity and self-sufficient systems.',
    'consulting.subtitle': 'Hands-on sessions to migrate from manual processes to centralized, automated, and AI-integrated systems.',
    'consulting.forCompaniesTitle': 'For Companies',
    'consulting.forCompaniesOneLiner': 'We migrate your operation to a more self-sufficient system: centralized data, clear processes, automation, and AI where it adds value.',
    'consulting.companiesWork1': 'Process mapping and bottleneck detection',
    'consulting.companiesWork2': 'Data formalization: from Sheets to structured database',
    'consulting.companiesWork3': 'Centralization: a single source of truth (ERP/CRM + DB)',
    'consulting.companiesWork4': 'Automation of repetitive tasks (sales, support, admin)',
    'consulting.companiesWork5': 'AI integration at critical points (triage, classification, drafting)',
    'consulting.companiesWork6': 'Security, permissions, and traceability (audit)',
    'consulting.companiesDeliverable1': 'A prioritized roadmap (impact vs effort)',
    'consulting.companiesDeliverable2': 'Technical blueprint (architecture + integrations + data)',
    'consulting.companiesDeliverable3': 'Phased implementation plan (pilot → production)',
    'consulting.bookCompanies': 'Schedule company consulting',
    'consulting.viewProjects': 'View projects →',
    'consulting.forDevelopersTitle': 'For Developers',
    'consulting.forDevelopersOneLiner': 'Hands-on sessions to learn API integration, n8n automation, and building production-ready AI agents.',
    'consulting.devWork1': 'API integrations (auth, webhooks, retries, rate limits)',
    'consulting.devWork2': 'Automation with n8n (triggers, branching, error handling)',
    'consulting.devWork3': 'Low-code + code: when to use each',
    'consulting.devWork4': 'Designing robust flows (idempotence, queues, observability)',
    'consulting.devWork5': 'AI agents: tools, memory, prompts, and evaluation',
    'consulting.devWork6': 'Production best practices (logs, security, costs)',
    'consulting.devDeliverable1': 'Reusable workflow templates',
    'consulting.devDeliverable2': 'Automation architecture checklist',
    'consulting.devDeliverable3': 'Study/practice plan according to your stack',
    'consulting.bookDevs': 'Schedule 1:1 for devs',
    'consulting.viewCurriculum': 'View curriculum →',
    'consulting.howItWorks': 'How it works',
    'consulting.step1Title': '1) Diagnosis',
    'consulting.step1Desc': 'Process analysis and bottleneck detection',
    'consulting.step2Title': '2) Design',
    'consulting.step2Desc': 'Architecture and implementation plan',
    'consulting.step3Title': '3) Implementation',
    'consulting.step3Desc': 'Phased execution with monitoring',
    'consulting.formats': 'Formats: 60 min 1:1 · Team workshops · Monthly accompaniment',
    
    // Results
    'results.title': 'Results',
    'results.hoursSaved': 'Hours saved / month',
    'results.fasterResponse': 'Faster response time',
    'results.lowerErrors': 'Lower manual errors',
    'results.workflows': 'Workflows automated',
    'results.timeToShip': 'Time to ship',
    'results.credibility': 'Small team. Senior execution. Systems that keep running.',
    
    // CTA
    'cta.title': 'Start today',
    'cta.description': 'Tell us the workflow. We\'ll map it, build it, and integrate it into your stack.',
    'cta.bookDemo': 'Start Now',
    'cta.book1on1': 'Book 1:1',
    
    // Integrations
    'integrations.title': 'We work with your stack',
    
    // Footer
    'footer.copyright': '© We Automate',
    
    // Project names and descriptions
    'project.reception.name': 'Reception + Scheduling Automation',
    'project.reception.description': 'AI-powered reception bot handles inquiries, books appointments, and sends confirmations automatically.',
    'project.lead.name': 'Lead Qualification + Follow-Up',
    'project.lead.description': 'Automated lead scoring, qualification workflows, and AI-powered follow-up sequences.',
    'project.erp.name': 'ERP/CRM Integration (Odoo)',
    'project.erp.description': 'Bidirectional sync between Odoo and external systems with automated data flows.',
    'project.sheets.name': 'Google Sheets → Structured DB + Admin',
    'project.sheets.description': 'Migrated from fragile spreadsheets to production database with intuitive admin interface.',
    'project.dashboard.name': 'Internal Operations Dashboard',
    'project.dashboard.description': 'Real-time operations console for monitoring automations, KPIs, and system health.',
    'project.recruiting.name': 'Recruiting / ATS Workflow Automation',
    'project.recruiting.description': 'Automated resume parsing, candidate scoring, interview scheduling, and follow-up workflows.',
  },
  es: {
    // Navbar
    'nav.work': 'Proyectos',
    'nav.consulting': 'Asesorías',
    'nav.results': 'Resultados',
    'nav.book1on1': 'Contacto',
    'nav.bookDemo': 'Comienza Ya',
    
    // Hero
    'hero.badge': 'Estudio de IA + Automatización',
    'hero.title': 'Transformación digital para empresas',
    'hero.subtitle': 'Automatizamos procesos repetitivos e integramos IA en tus sistemas actuales.',
    'hero.cta.demo': 'Comienza Ya',
    'hero.cta.work': 'Ver Trabajo',
    'hero.microline.erp': 'ERP/CRM',
    'hero.microline.sheets': 'Hojas → BD',
    'hero.microline.automations': 'Automatizaciones en producción',
    
    // Portfolio
    'portfolio.title': 'Trabajos Seleccionados',
    'portfolio.viewCase': 'Ver Caso',
    'portfolio.problem': 'Problema',
    'portfolio.build': 'Construcción',
    'portfolio.outcome': 'Resultado',
    'portfolio.techStack': 'Stack Tecnológico',
    'portfolio.result': 'Resultado',
    
    // Consulting
    'consulting.eyebrow': 'Asesorías 1:1',
    'consulting.title': 'Construimos claridad técnica y sistemas autosuficientes.',
    'consulting.subtitle': 'Sesiones prácticas para migrar de procesos manuales a sistemas centralizados, automatizados e integrados con IA.',
    'consulting.forCompaniesTitle': 'Para Empresas',
    'consulting.forCompaniesOneLiner': 'Migramos tu operación a un sistema más autosuficiente: datos centralizados, procesos claros, automatización e IA donde aporta.',
    'consulting.companiesWork1': 'Mapeo de procesos y detección de cuellos de botella',
    'consulting.companiesWork2': 'Formalización de datos: de Sheets a base estructurada',
    'consulting.companiesWork3': 'Centralización: una sola fuente de verdad (ERP/CRM + DB)',
    'consulting.companiesWork4': 'Automatización de tareas repetitivas (ventas, soporte, admin)',
    'consulting.companiesWork5': 'Integración de IA en puntos críticos (triage, clasificación, drafting)',
    'consulting.companiesWork6': 'Seguridad, permisos y trazabilidad (auditoría)',
    'consulting.companiesDeliverable1': 'Un roadmap priorizado (impacto vs esfuerzo)',
    'consulting.companiesDeliverable2': 'Blueprint técnico (arquitectura + integraciones + datos)',
    'consulting.companiesDeliverable3': 'Plan de implementación por fases (piloto → producción)',
    'consulting.bookCompanies': 'Agendar asesoría para empresas',
    'consulting.viewProjects': 'Ver proyectos →',
    'consulting.forDevelopersTitle': 'Para Developers',
    'consulting.forDevelopersOneLiner': 'Sesiones prácticas para aprender integración de APIs, automatización con n8n y construcción de agentes de IA listos para producción.',
    'consulting.devWork1': 'Integraciones con APIs (auth, webhooks, retries, rate limits)',
    'consulting.devWork2': 'Automatización con n8n (triggers, branching, error handling)',
    'consulting.devWork3': 'Low-code + código: cuándo usar cada uno',
    'consulting.devWork4': 'Diseño de flujos robustos (idempotencia, colas, observabilidad)',
    'consulting.devWork5': 'Agentes de IA: herramientas, memoria, prompts y evaluación',
    'consulting.devWork6': 'Buenas prácticas de producción (logs, seguridad, costos)',
    'consulting.devDeliverable1': 'Plantillas de workflows reutilizables',
    'consulting.devDeliverable2': 'Checklist de arquitectura para automatizaciones',
    'consulting.devDeliverable3': 'Plan de estudio/práctica según tu stack',
    'consulting.bookDevs': 'Agendar 1:1 para devs',
    'consulting.viewCurriculum': 'Ver temario →',
    'consulting.howItWorks': 'Cómo funciona',
    'consulting.step1Title': '1) Diagnóstico',
    'consulting.step1Desc': 'Análisis de procesos y puntos de mejora',
    'consulting.step2Title': '2) Diseño',
    'consulting.step2Desc': 'Arquitectura y plan de implementación',
    'consulting.step3Title': '3) Implementación',
    'consulting.step3Desc': 'Ejecución por fases con seguimiento',
    'consulting.formats': 'Formatos: 60 min 1:1 · Workshops para equipos · Acompañamiento mensual',
    
    // Results
    'results.title': 'Resultados',
    'results.hoursSaved': 'Horas ahorradas / mes',
    'results.fasterResponse': 'Tiempo de respuesta más rápido',
    'results.lowerErrors': 'Menos errores manuales',
    'results.workflows': 'Flujos de trabajo automatizados',
    'results.timeToShip': 'Tiempo de entrega',
    'results.credibility': 'Equipo pequeño. Ejecución senior. Sistemas que siguen funcionando.',
    
    // CTA
    'cta.title': 'Empieza hoy',
    'cta.description': 'Cuéntanos el flujo de trabajo. Lo mapearemos, lo construiremos y lo integraremos en tu stack.',
    'cta.bookDemo': 'Comienza Ya',
    'cta.book1on1': 'Reservar 1:1',
    
    // Integrations
    'integrations.title': 'Trabajamos con tu stack',
    
    // Footer
    'footer.copyright': '© We Automate',
    
    // Project names and descriptions
    'project.reception.name': 'Automatización de Recepción + Programación',
    'project.reception.description': 'Bot de recepción con IA que maneja consultas, reserva citas y envía confirmaciones automáticamente.',
    'project.lead.name': 'Calificación de Leads + Seguimiento',
    'project.lead.description': 'Puntuación automatizada de leads, flujos de trabajo de calificación y secuencias de seguimiento con IA.',
    'project.erp.name': 'Integración ERP/CRM (Odoo)',
    'project.erp.description': 'Sincronización bidireccional entre Odoo y sistemas externos con flujos de datos automatizados.',
    'project.sheets.name': 'Google Sheets → BD Estructurada + Admin',
    'project.sheets.description': 'Migrado de hojas de cálculo frágiles a base de datos de producción con interfaz de administración intuitiva.',
    'project.dashboard.name': 'Panel de Operaciones Internas',
    'project.dashboard.description': 'Consola de operaciones en tiempo real para monitorear automatizaciones, KPIs y salud del sistema.',
    'project.recruiting.name': 'Automatización de Flujo de Trabajo de Reclutamiento / ATS',
    'project.recruiting.description': 'Análisis automatizado de CVs, puntuación de candidatos, programación de entrevistas y flujos de trabajo de seguimiento.',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

