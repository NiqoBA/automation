'use client'

import { Clock, Users, Calendar, List, Check, X, Loader2, CreditCard, LucideIcon, XCircle, CheckCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Task {
  icon: LucideIcon
  title: string
  subtitle: string
  status: 'pending' | 'completed' | 'cancelled' | 'progress'
  statusIcon: LucideIcon
}

const tasks: Task[] = [
  {
    icon: Clock,
    title: 'Gestión de nómina',
    subtitle: 'Vence el 2 de julio',
    status: 'pending',
    statusIcon: Clock,
  },
  {
    icon: Users,
    title: 'Seguimiento de empleados',
    subtitle: 'Hace 2 días',
    status: 'completed',
    statusIcon: Check,
  },
  {
    icon: Calendar,
    title: 'Publicación en redes sociales',
    subtitle: 'Cancelada por usuario',
    status: 'cancelled',
    statusIcon: X,
  },
  {
    icon: List,
    title: 'Lista de leads',
    subtitle: '70% preparado',
    status: 'progress',
    statusIcon: Loader2,
  },
  {
    icon: CreditCard,
    title: 'Recordatorio de pago',
    subtitle: 'Pendiente',
    status: 'pending',
    statusIcon: Clock,
  },
]

function TaskItem({ icon: Icon, title, subtitle, status, statusIcon: StatusIcon }: Task) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-purple-500'
      case 'completed':
        return 'text-purple-500'
      case 'cancelled':
        return 'text-red-500'
      case 'progress':
        return 'text-purple-500'
      default:
        return 'text-purple-500'
    }
  }

  return (
    <div className="flex items-center justify-between p-2.5 border-b border-white/10 hover:bg-white/5 transition-colors">
      {/* Lado izquierdo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Icon className="text-purple-500" size={16} />
        </div>
        <div>
          <h4 className="text-white font-medium text-[11px]">{title}</h4>
          <p className="text-gray-400 text-[10px]">{subtitle}</p>
        </div>
      </div>
      
      {/* Lado derecho - Status icon */}
      <div className={`${getStatusColor()} ${status === 'progress' ? 'animate-spin' : ''}`}>
        <StatusIcon size={13} />
      </div>
    </div>
  )
}

// Benefits Cards Component
function BenefitsCards() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-32">
      {/* Card 1 - Reducción del Trabajo Manual */}
      <BenefitCard isVisible={isVisible} delay={0}>
        <AreaChartVisualization isVisible={isVisible} />
        <div className="mt-4">
          <h3 className="text-base font-semibold text-white mb-2">
            Reducción del Trabajo Manual
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Automatiza tareas repetitivas y ahorra tiempo. Desde respuestas 
            a clientes hasta documentos: la IA se encarga, tu equipo se 
            enfoca en lo importante.
          </p>
        </div>
      </BenefitCard>

      {/* Card 2 - Mayor Velocidad Operativa */}
      <BenefitCard isVisible={isVisible} delay={0.1}>
        <GaugeVisualization isVisible={isVisible} />
        <div className="mt-4">
          <h3 className="text-base font-semibold text-white mb-2">
            Mayor Velocidad Operativa
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Respuestas en segundos, decisiones en tiempo real. Elimina 
            cuellos de botella con flujos automatizados y agentes que 
            trabajan 24/7.
          </p>
        </div>
      </BenefitCard>

      {/* Card 3 - Menos Errores Humanos */}
      <BenefitCard isVisible={isVisible} delay={0.2}>
        <ErrorReductionVisualization isVisible={isVisible} />
        <div className="mt-4">
          <h3 className="text-base font-semibold text-white mb-2">
            Menos Errores Humanos
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Toma de decisiones más precisa y estandarizada. Automatizar 
            significa menos fallos, menos retrabajos y más calidad en 
            cada proceso.
          </p>
        </div>
      </BenefitCard>
    </div>
  )
}

// Reusable Card Container
function BenefitCard({ 
  children, 
  isVisible, 
  delay 
}: { 
  children: React.ReactNode
  isVisible: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a] rounded-lg border border-white/[0.08] p-4 hover:border-purple-500/30 transition-all duration-500"
    >
      {children}
    </motion.div>
  )
}

// Area Chart Visualization
function AreaChartVisualization({ isVisible }: { isVisible: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 100))
      }, 20)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  const points = [
    { x: 0, y: 80 },
    { x: 25, y: 70 },
    { x: 50, y: 50 },
    { x: 75, y: 35 },
    { x: 100, y: 20 }
  ]

  const pathData = points
    .map((p, i) => {
      const x = (p.x / 100) * 200
      const y = 100 - (p.y / 100) * 80
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  const areaPath = `${pathData} L 200 100 L 0 100 Z`

  return (
    <div className="w-full h-24 relative">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <defs>
          <linearGradient id="areaGradientServices" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="lineGradientServices" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => (
          <line
            key={i}
            x1="0"
            y1={i * 33}
            x2="200"
            y2={i * 33}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
          />
        ))}

        {/* Area */}
        <path
          d={areaPath}
          fill="url(#areaGradientServices)"
          style={{
            clipPath: `inset(0 ${100 - progress}% 0 0)`
          }}
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#lineGradientServices)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 300 - (progress / 100) * 300
          }}
        />

        {/* Data points */}
        {points.map((p, i) => {
          const x = (p.x / 100) * 200
          const y = 100 - (p.y / 100) * 80
          const show = (progress / 100) * points.length > i
          
          return show ? (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#10b981"
                className="animate-pulse"
              />
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.3"
              />
            </g>
          ) : null
        })}
      </svg>
    </div>
  )
}

// Gauge Visualization
function GaugeVisualization({ isVisible }: { isVisible: boolean }) {
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setPercentage(prev => Math.min(prev + 1, 75))
      }, 20)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  const segments = 20
  const filledSegments = Math.floor((percentage / 100) * segments)

  return (
    <div className="w-full h-24 flex items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[180px]">
        <defs>
          <linearGradient id="gaugeGradientServices" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Segments */}
        {Array.from({ length: segments }).map((_, i) => {
          const startAngle = 180 + (i * 180 / segments)
          const endAngle = 180 + ((i + 1) * 180 / segments)
          const isFilled = i < filledSegments
          
          const startRad = (startAngle * Math.PI) / 180
          const endRad = (endAngle * Math.PI) / 180
          
          const innerRadius = 40
          const outerRadius = 55
          
          const x1 = 100 + innerRadius * Math.cos(startRad)
          const y1 = 100 + innerRadius * Math.sin(startRad)
          const x2 = 100 + outerRadius * Math.cos(startRad)
          const y2 = 100 + outerRadius * Math.sin(startRad)
          const x3 = 100 + outerRadius * Math.cos(endRad)
          const y3 = 100 + outerRadius * Math.sin(endRad)
          const x4 = 100 + innerRadius * Math.cos(endRad)
          const y4 = 100 + innerRadius * Math.sin(endRad)

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`}
              fill={isFilled ? 'url(#gaugeGradientServices)' : 'rgba(255,255,255,0.05)'}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="0.5"
              style={{
                filter: isFilled ? 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.4))' : 'none'
              }}
            />
          )
        })}

        {/* Center text */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className="text-xl font-semibold fill-white"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  )
}

// Error Reduction Visualization
function ErrorReductionVisualization({ isVisible }: { isVisible: boolean }) {
  const [fadeErrors, setFadeErrors] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setFadeErrors(true), 500)
    }
  }, [isVisible])

  const errorPositions = [
    { x: 15, y: 15 },
    { x: 100, y: 20 },
    { x: 170, y: 18 },
    { x: 140, y: 60 },
    { x: 35, y: 65 },
    { x: 200, y: 70 }
  ]

  return (
    <div className="w-full h-24 relative flex items-center justify-center">
      {/* Error badges */}
      {errorPositions.map((pos, i) => (
        <div
          key={`error-${i}`}
          className={`absolute bg-green-950/40 border border-green-500/30 rounded px-2 py-1 flex items-center gap-1.5 transition-all duration-700 ${
            fadeErrors ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transitionDelay: `${i * 100}ms`
          }}
        >
          <XCircle size={10} className="text-green-400" />
          <span className="text-green-400 text-[10px] font-medium">Error</span>
        </div>
      ))}

      {/* Success badge (center) */}
      <div
        className={`bg-blue-950/40 border-2 border-blue-500/50 rounded px-3 py-1.5 flex items-center gap-1.5 transition-all duration-500 ${
          fadeErrors ? 'opacity-100 scale-110 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'opacity-0 scale-75'
        }`}
        style={{ transitionDelay: '600ms' }}
      >
        <CheckCircle size={14} className="text-blue-400" />
        <span className="text-blue-400 text-xs font-semibold">Resuelto</span>
      </div>
    </div>
  )
}

export default function Services() {
  const [activeTab, setActiveTab] = useState<'all' | 'approval'>('all')

  // Duplicar las tareas múltiples veces para el efecto infinito fluido
  const duplicatedTasks = [...tasks, ...tasks, ...tasks]

  return (
    <section id="services" className="py-28 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado superior centrado */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <span className="inline-block px-3.5 py-1.5 bg-black border border-white rounded-lg text-white text-[10px] font-medium uppercase tracking-wide">
              NUESTROS SERVICIOS
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-5"
          >
            Soluciones con IA que llevan<br />
            tu negocio al siguiente nivel
          </motion.h2>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-white leading-relaxed mb-12"
          >
            Diseñamos, desarrollamos e implementamos herramientas de automatización que se convierten en tu punto de inflexión.
          </motion.p>
        </div>

        {/* Benefits Cards */}
        <BenefitsCards />

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto mt-16">
          {/* Columna izquierda - Task Card */}
          <div 
            className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 sm:p-5 max-w-[420px] mx-auto lg:mx-0"
            style={{
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.1)',
            }}
          >
            {/* Tabs */}
            <div className="flex gap-1.5 bg-white/5 rounded-lg p-1 mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-md font-medium text-[10px] transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-black text-white'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                Todas las tareas
              </button>
              <button
                onClick={() => setActiveTab('approval')}
                className={`px-3 py-1.5 rounded-md font-medium text-[10px] transition-all duration-200 ${
                  activeTab === 'approval'
                    ? 'bg-black text-white'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                Esperando aprobación
              </button>
            </div>

            {/* Task List - Carrusel Vertical Continuo */}
            <div className="relative h-[220px] overflow-hidden">
              <motion.div
                className="space-y-0"
                animate={{
                  y: [0, -tasks.length * 55], // Se mueve la altura de todas las tareas (5 tareas * 55px = 275px)
                }}
                transition={{
                  duration: tasks.length * 3, // 3 segundos por tarea = 15 segundos total
                  repeat: Infinity,
                  ease: 'linear', // Movimiento constante sin aceleración
                }}
                style={{
                  willChange: 'transform',
                }}
              >
                {duplicatedTasks.map((task, index) => (
                  <div key={index} className="h-[55px] flex-shrink-0">
                    <TaskItem {...task} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Columna derecha - Contenido */}
          <div className="max-w-md mx-auto lg:mx-0">
            {/* Badge superior */}
            <span className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-medium mb-4">
              Automatización de Flujo de Trabajo
            </span>

            {/* Título principal */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
              Automatiza tareas repetitivas
            </h3>

            {/* Descripción */}
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
              Te ayudamos a optimizar las operaciones internas automatizando flujos de trabajo manuales como la entrada de datos, reportes y cadenas de aprobación, ahorrando tiempo y reduciendo errores.
            </p>

            {/* Badges inferiores */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-medium">
                Bots de Tareas Internas
              </span>
              <span className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-medium">
                100+ Automatizaciones
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
