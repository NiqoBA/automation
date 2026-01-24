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
    'nav.home': 'Home',
    'nav.work': 'Projects',
    'nav.consulting': 'Consulting',
    'nav.results': 'Results',
    'nav.book1on1': 'Contact',
    'nav.bookDemo': 'Schedule Meeting',
    
    // Hero
    'hero.badge': 'AI + Automation Studio',
    'hero.badgeText': 'Automated Lead Generation',
    'hero.title': 'Intelligent Automation for Modern Businesses',
    'hero.subtitle': 'We automate repetitive processes and integrate AI into your current systems through the construction of highly customized software.',
    'hero.cta.demo': 'Schedule Meeting',
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
    'consulting.forCompaniesOneLiner': 'Operational clarity and proprietary assets. We migrate your operation to a more self-sufficient system: centralized data, clear processes, automation, and AI where it adds value.',
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
    'consulting.forDevelopersOneLiner': 'From Scripts to Production Systems. Hands-on sessions to learn API integration, n8n automation, and building production-ready AI agents.',
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
    
    // How It Works
    'howitworks.eyebrow': 'Process',
    'howitworks.title': 'How We Work',
    'howitworks.subtitle': 'A systematic approach to digital transformation that guarantees results.',
    'howitworks.step1.title': 'Discovery Call',
    'howitworks.step1.description': 'We meet to understand your business objectives, your workflows, and the key processes where AI can generate the greatest impact.',
    'howitworks.step2.title': 'Solution Engineering & Stress Testing',
    'howitworks.step2.description': 'We create a functional demo integrated with your stack and test it before releasing anything. We test load, errors, edge cases, and real usage. If it passes all protocols, only then is it deployed: stable, secure, and ready for production.',
    'howitworks.step3.title': 'Precision Deployment',
    'howitworks.step3.description': 'We deploy in your real environment without stopping operations. We monitor performance, adjust in real-time, and train your team. The goal: fast production deployment, adopted and generating value from day one.',
    
    // Results
    'results.title': 'Results',
    'results.hoursSaved': 'Hours saved / month',
    'results.fasterResponse': 'Faster response time',
    'results.lowerErrors': 'Lower manual errors',
    'results.workflows': 'Workflows automated',
    'results.timeToShip': 'Time to ship',
    'results.credibility': 'Small team. Senior execution. Systems that keep running.',
    
    // Contact
    'contact.title': 'Ready to scale?',
    'contact.subtitle': 'Tell us the challenge. We design the solution.',
    'contact.trustStatement': 'Small team. Senior execution. Systems that keep running.',
    'contact.fields.name': 'Full Name',
    'contact.fields.email': 'Corporate Email',
    'contact.fields.company': 'Company',
    'contact.fields.phone': 'Phone',
    'contact.fields.service': 'Service',
    'contact.fields.message': 'Message',
    'contact.placeholders.name': 'John Doe',
    'contact.placeholders.email': 'john@company.com',
    'contact.placeholders.company': 'Your Company',
    'contact.placeholders.phone': '+1 (555) 000-0000',
    'contact.placeholders.message': 'What process would you like to automate? (Optional)',
    'contact.services.automations': 'Automations',
    'contact.services.consulting': 'Consulting',
    'contact.submit': 'Send Request',
    'contact.submitting': 'Sending...',
    'contact.success.title': 'Request Sent',
    'contact.success.message': 'We\'ll get back to you within 24 hours.',
    'contact.errors.name': 'Name is required',
    'contact.errors.emailRequired': 'Email is required',
    'contact.errors.emailInvalid': 'Please enter a valid email address',
    'contact.errors.company': 'Company is required',
    'contact.errors.service': 'Please select a service',
    
    // Profile Modal
    'profile.title': 'Complete Your Profile',
    'profile.subtitle': 'Please provide your name and age to continue.',
    'profile.fields.name': 'Full Name',
    'profile.fields.age': 'Age',
    'profile.placeholders.name': 'John Doe',
    'profile.placeholders.age': '25',
    'profile.submit': 'Save',
    'profile.errors.nameRequired': 'Name is required',
    'profile.errors.ageRequired': 'Age is required',
    'profile.errors.ageInvalid': 'Please enter a valid age (1-150)',
    
    // CTA
    'cta.title': 'Start today',
    'cta.description': 'Tell us the workflow. We\'ll map it, build it, and integrate it into your stack.',
    'cta.bookDemo': 'Start Now',
    'cta.book1on1': 'Book 1:1',
    
    // Core Systems
    'core.servicesBadge': 'Our Services',
    'core.mainTitle': 'AI Solutions That Take\nYour Business to the Next Level',
    'core.mainSubtitle': 'We design, develop, and implement automation tools that help you work smarter, not harder',
    'core.eyebrow': 'Core Systems',
    'core.title': 'Enterprise AI Infrastructure',
    'core.voice.tab': 'Omnichannel Agent',
    'core.voice.title': 'Virtual Receptionist',
    'core.voice.description1': 'AI-powered conversational phone agent, designed to handle calls in real-time, operate 24/7, and execute real actions within the business.',
    'core.voice.description2': 'The system understands intent, manages reservations and appointments with state control, and syncs every interaction with WhatsApp, databases, and internal systems, eliminating missed calls and operational errors.',
    'core.voice.description3': 'For businesses where *each incoming contact represents a direct revenue opportunity* and human attention doesn\'t scale.',
    'core.voice.useCases': 'Restaurants, clinics, hotels, retail stores, and service companies',
    'core.rag.tab': 'Corporate Brain',
    'core.rag.title': 'RAG – Intelligent Corporate Brain',
    'core.rag.description1': 'A RAG (Retrieval-Augmented Generation) system that converts all ',
    'core.rag.description1Bold': 'internal company information into an intelligent, structured, and queryable memory in real-time',
    'core.rag.description1End': '.',
    'core.rag.description2': 'Indexes documents, manuals, processes, and operational knowledge to generate precise, auditable responses without hallucinations, always based on your own data. Integrates as internal chat, web, or WhatsApp, enabling scalable support, sales, or operations without losing control over information.',
    'core.rag.useCases': 'High volume of documentation, support teams, complex operations, or need for reliable corporate-level AI',
    'core.accounting.tab': 'AI Audit',
    'core.accounting.title': 'Automated Accounting System',
    'core.accounting.description1': 'An automated accounting system that intelligently processes financial information, reducing manual workload and increasing real-time visibility.',
    'core.accounting.description2': 'All integrated with WhatsApp, web, and enterprise systems, enabling remote, organized, and scalable accounting operations.',
    'core.accounting.description2Bold': 'Uses document detection and reading (OCR + AI) to interpret invoices and receipts, automatically organizes income and expenses, and generates actionable financial reports.',
    'core.accounting.useCases': 'SMEs and growing companies that need financial control, operational efficiency, and less dependence on manual processes',
    'core.leads.tab': 'Lead Prospecting',
    'core.leads.title': 'AI Lead Prospecting',
    'core.leads.description1': 'Intelligent scraping system that uses AI to identify and qualify potential clients, automatically analyzing company profiles, growth indicators, and business needs.',
    'core.leads.description2': 'Scans multiple sources (LinkedIn, company websites, public data) to find high-quality leads, scores them based on fit and opportunity, and delivers qualified prospects ready for your sales team. Increases your sales pipeline without manual research.',
    'core.leads.useCases': 'Sales teams, B2B companies, agencies, and businesses looking to scale lead generation and increase conversion rates',
    
    // Work / Portfolio
    'work.eyebrow': 'Experience',
    'work.title': 'Success Cases',
    'work.subtitle': 'Real automation, AI, and integration systems.',
    'work.filter.all': 'All',
    'work.caseStudy.aiIntegrated': 'AI Integrated',
    'work.caseStudy.before': 'Before: ',
    'work.caseStudy.after': 'After: ',
    'work.caseStudy.delivered': 'Delivered',
    'work.caseStudy.viewWeb': 'View Website',
    'work.caseStudy.similar': 'I want something similar',
    'work.caseStudy.testUser': 'Test User:',
    'work.caseStudy.email': 'Email:',
    'work.caseStudy.password': 'Password:',
    
    // Integrations
    'integrations.title': 'We work with your stack',
    
    // Footer
    'footer.copyright': '© INFLEXO AI',
    
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
    'nav.home': 'Inicio',
    'nav.work': 'Proyectos',
    'nav.consulting': 'Asesorías',
    'nav.results': 'Resultados',
    'nav.book1on1': 'Contacto',
    'nav.bookDemo': 'Agendar reunión',
    
    // Hero
    'hero.badge': 'Estudio de IA + Automatización',
    'hero.badgeText': 'Generación Automatizada de Leads',
    'hero.title': 'Automatización Inteligente para Empresas',
    'hero.subtitle': 'Automatizamos procesos repetitivos e integramos IA en tus sistemas actuales mediante la construcción de software hiper personalizado.',
    'hero.cta.demo': 'Agendar reunión',
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
    'consulting.forCompaniesOneLiner': 'Claridad operativa y activos propios. Migramos tu operación a un sistema más autosuficiente: datos centralizados, procesos claros, automatización e IA donde aporta.',
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
    'consulting.forDevelopersOneLiner': 'De Scripts a Sistemas de Producción. Sesiones prácticas para aprender integración de APIs, automatización con n8n y construcción de agentes de IA listos para producción.',
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
    
    // How It Works
    'howitworks.eyebrow': 'Proceso',
    'howitworks.title': 'Cómo Trabajamos',
    'howitworks.subtitle': 'Un enfoque sistemático de transformación digital que garantiza resultados.',
    'howitworks.step1.title': 'Discovery Call',
    'howitworks.step1.description': 'Nos reunimos para entender tus objetivos de negocio, tus flujos de trabajo y los procesos clave donde la IA puede generar el mayor impacto.',
    'howitworks.step2.title': 'Ingeniería de Soluciones & Pruebas de Estrés',
    'howitworks.step2.description': 'Creamos una demo funcional integrada a tu stack y la ponemos a prueba antes de liberar nada. Testeamos carga, errores, casos límite y uso real. Si pasa todos los protocolos, recién ahí se despliega: estable, seguro y listo para producir.',
    'howitworks.step3.title': 'Despliegue de Precisión',
    'howitworks.step3.description': 'Hacemos el deploy en tu entorno real sin frenar la operación. Monitoreamos el rendimiento, ajustamos en vivo y entrenamos a tu equipo. El objetivo: puesta en producción rápida, adoptada y generando valor desde el primer día.',
    
    // Contact
    'contact.title': '¿Listo para escalar?',
    'contact.subtitle': 'Cuéntanos el reto. Nosotros diseñamos la solución.',
    'contact.trustStatement': 'Equipo pequeño. Ejecución senior. Sistemas que siguen funcionando.',
    'contact.fields.name': 'Nombre Completo',
    'contact.fields.email': 'Email Corporativo',
    'contact.fields.company': 'Empresa',
    'contact.fields.phone': 'Teléfono',
    'contact.fields.service': 'Servicio',
    'contact.fields.message': 'Mensaje',
    'contact.placeholders.name': 'Juan Pérez',
    'contact.placeholders.email': 'juan@empresa.com',
    'contact.placeholders.company': 'Tu Empresa',
    'contact.placeholders.phone': '+54 11 1234-5678',
    'contact.placeholders.message': '¿Qué proceso te gustaría automatizar? (Opcional)',
    'contact.services.automations': 'Automatizaciones',
    'contact.services.consulting': 'Asesorías',
    'contact.submit': 'Enviar Solicitud',
    'contact.submitting': 'Enviando...',
    'contact.success.title': 'Solicitud Enviada',
    'contact.success.message': 'Te responderemos en menos de 24 horas.',
    'contact.errors.name': 'El nombre es requerido',
    'contact.errors.emailRequired': 'El email es requerido',
    'contact.errors.emailInvalid': 'Por favor ingresa un email válido',
    'contact.errors.company': 'La empresa es requerida',
    'contact.errors.service': 'Por favor selecciona un servicio',
    
    // Profile Modal
    'profile.title': 'Completa Tu Perfil',
    'profile.subtitle': 'Por favor proporciona tu nombre y edad para continuar.',
    'profile.fields.name': 'Nombre Completo',
    'profile.fields.age': 'Edad',
    'profile.placeholders.name': 'Juan Pérez',
    'profile.placeholders.age': '25',
    'profile.submit': 'Guardar',
    'profile.errors.nameRequired': 'El nombre es requerido',
    'profile.errors.ageRequired': 'La edad es requerida',
    'profile.errors.ageInvalid': 'Por favor ingresa una edad válida (1-150)',
    
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
    
    // Core Systems
    'core.servicesBadge': 'Nuestros servicios',
    'core.mainTitle': 'Soluciones con IA que llevan\ntu negocio al siguiente nivel',
    'core.mainSubtitle': 'Diseñamos, desarrollamos e implementamos herramientas de automatización que te ayudan a trabajar más inteligentemente, no más duro',
    'core.eyebrow': 'Sistemas Core',
    'core.title': 'Infraestructura IA Empresarial',
    'core.voice.tab': 'Agente Omnicanal',
    'core.voice.title': 'Recepcionista virtual',
    'core.voice.description1': 'Agente telefónico impulsado por IA conversacional, diseñado para atender llamadas en tiempo real, operar 24/7 y ejecutar acciones reales dentro del negocio.',
    'core.voice.description2': 'El sistema entiende intención, gestiona reservas y citas con control de estados, y sincroniza cada interacción con WhatsApp, bases de datos y sistemas internos, eliminando llamadas perdidas y errores operativos.',
    'core.voice.description3': 'Para negocios donde *cada contacto entrante representa una oportunidad directa de ingreso* y la atención humana no escala.',
    'core.voice.useCases': 'Restaurantes, clínicas, hoteles, comercios y empresas de servicios',
    'core.rag.tab': 'Cerebro Corporativo',
    'core.rag.title': 'RAG – Cerebro Inteligente Empresarial',
    'core.rag.description1': 'Un sistema RAG (Retrieval-Augmented Generation) que convierte toda la ',
    'core.rag.description1Bold': 'información interna de la empresa en una memoria inteligente, estructurada y consultable en tiempo real',
    'core.rag.description1End': '.',
    'core.rag.description2': 'Indexa documentos, manuales, procesos y conocimiento operativo para generar respuestas precisas, auditables y sin alucinaciones, siempre basadas en datos propios. Se integra como chat interno, web o WhatsApp, permitiendo escalar soporte, ventas u operaciones sin perder control sobre la información.',
    'core.rag.useCases': 'Alto volumen de documentación, equipos de soporte, operaciones complejas o necesidad de IA confiable a nivel corporativo',
    'core.accounting.tab': 'IA Contable',
    'core.accounting.title': 'Sistema Contable Automatizado',
    'core.accounting.description1': 'Un sistema contable automatizado que procesa información financiera de forma inteligente, reduciendo la carga manual y aumentando la visibilidad en tiempo real.',
    'core.accounting.description2': 'Todo integrado con WhatsApp, web y sistemas empresariales, permitiendo operar la contabilidad de forma remota, ordenada y escalable.',
    'core.accounting.description2Bold': 'Utiliza detección y lectura de documentos (OCR + IA) para interpretar facturas y comprobantes, organiza ingresos y egresos automáticamente y genera reportes financieros accionables.',
    'core.accounting.useCases': 'PYMEs y empresas en crecimiento que necesitan control financiero, eficiencia operativa y menos dependencia de procesos manuales',
    'core.leads.tab': 'Prospección Leads',
    'core.leads.title': 'Prospección de Leads con IA',
    'core.leads.description1': 'Sistema de scraping inteligente que utiliza IA para identificar y calificar posibles clientes, analizando automáticamente perfiles de empresas, indicadores de crecimiento y necesidades de negocio.',
    'core.leads.description2': 'Escanea múltiples fuentes (LinkedIn, sitios web, datos públicos) para encontrar leads de alta calidad, los califica según fit y oportunidad, y entrega prospectos listos para tu equipo de ventas. Aumenta tu pipeline de ventas sin investigación manual.',
    'core.leads.useCases': 'Equipos de ventas, empresas B2B, agencias y negocios que buscan escalar la generación de leads y aumentar tasas de conversión',
    
    // Work / Portfolio
    'work.eyebrow': 'Experience',
    'work.title': 'Casos de Éxito',
    'work.subtitle': 'Sistemas reales de automatización, IA e integraciones.',
    'work.filter.all': 'Todos',
    'work.caseStudy.aiIntegrated': 'IA integrada',
    'work.caseStudy.before': 'Antes: ',
    'work.caseStudy.after': 'Después: ',
    'work.caseStudy.delivered': 'Entregado',
    'work.caseStudy.viewWeb': 'Ver web',
    'work.caseStudy.similar': 'Quiero algo similar',
    'work.caseStudy.testUser': 'Usuario de prueba:',
    'work.caseStudy.email': 'Email:',
    'work.caseStudy.password': 'Password:',
    
    // Integrations
    'integrations.title': 'Trabajamos con tu stack',
    
    // Footer
    'footer.copyright': '© INFLEXO AI',
    
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
  const [language, setLanguage] = useState<Language>('es')

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

