'use client'

import { useEffect, useRef, useState } from 'react'
import { XCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Benefits() {
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
    <section 
      ref={sectionRef}
      className="bg-[#0a0a0a] py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-semibold text-white mb-6">
            Optimiza, Acelera y Automatiza
          </h2>
          <p className="text-lg text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Reduce los costes operativos y elimina tareas repetitivas con 
            soluciones inteligentes que mejoran la eficiencia y la precisión 
            en cada proceso.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 - Reducción del Trabajo Manual */}
          <BenefitCard
            isVisible={isVisible}
            delay={0}
          >
            <AreaChartVisualization isVisible={isVisible} />
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Reducción del Trabajo Manual
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Automatiza tareas repetitivas y ahorra tiempo. Desde respuestas 
                a clientes hasta documentos: la IA se encarga, tu equipo se 
                enfoca en lo importante.
              </p>
            </div>
          </BenefitCard>

          {/* Card 2 - Mayor Velocidad Operativa */}
          <BenefitCard
            isVisible={isVisible}
            delay={0.1}
          >
            <GaugeVisualization isVisible={isVisible} />
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Mayor Velocidad Operativa
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Respuestas en segundos, decisiones en tiempo real. Elimina 
                cuellos de botella con flujos automatizados y agentes que 
                trabajan 24/7.
              </p>
            </div>
          </BenefitCard>

          {/* Card 3 - Menos Errores Humanos */}
          <BenefitCard
            isVisible={isVisible}
            delay={0.2}
          >
            <ErrorReductionVisualization isVisible={isVisible} />
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Menos Errores Humanos
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Toma de decisiones más precisa y estandarizada. Automatizar 
                significa menos fallos, menos retrabajos y más calidad en 
                cada proceso.
              </p>
            </div>
          </BenefitCard>

        </div>
      </div>
    </section>
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
      className="bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a] rounded-2xl border border-white/[0.08] p-10 hover:border-purple-500/30 transition-all duration-500"
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
      const x = (p.x / 100) * 300
      const y = 180 - (p.y / 100) * 160
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  const areaPath = `${pathData} L 300 180 L 0 180 Z`

  return (
    <div className="w-full h-48 relative">
      <svg viewBox="0 0 300 180" className="w-full h-full">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={i * 45}
            x2="300"
            y2={i * 45}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
          />
        ))}

        {/* Area */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          style={{
            clipPath: `inset(0 ${100 - progress}% 0 0)`
          }}
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: 400 - (progress / 100) * 400
          }}
        />

        {/* Data points */}
        {points.map((p, i) => {
          const x = (p.x / 100) * 300
          const y = 180 - (p.y / 100) * 160
          const show = (progress / 100) * points.length > i
          
          return show ? (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="#ef4444"
                className="animate-pulse"
              />
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
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
    <div className="w-full h-40 flex items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-xs">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Segments */}
        {Array.from({ length: segments }).map((_, i) => {
          const startAngle = 180 + (i * 180 / segments)
          const endAngle = 180 + ((i + 1) * 180 / segments)
          const isFilled = i < filledSegments
          
          const startRad = (startAngle * Math.PI) / 180
          const endRad = (endAngle * Math.PI) / 180
          
          const innerRadius = 60
          const outerRadius = 80
          
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
              fill={isFilled ? 'url(#gaugeGradient)' : 'rgba(255,255,255,0.05)'}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="0.5"
              style={{
                filter: isFilled ? 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))' : 'none'
              }}
            />
          )
        })}

        {/* Center text */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className="text-3xl font-semibold fill-white"
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
    { x: 20, y: 20 },
    { x: 140, y: 30 },
    { x: 250, y: 25 },
    { x: 200, y: 80 },
    { x: 50, y: 90 },
    { x: 280, y: 100 }
  ]

  return (
    <div className="w-full h-40 relative flex items-center justify-center">
      {/* Error badges */}
      {errorPositions.map((pos, i) => (
        <div
          key={`error-${i}`}
          className={`absolute bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all duration-700 ${
            fadeErrors ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transitionDelay: `${i * 100}ms`
          }}
        >
          <XCircle size={14} className="text-red-400" />
          <span className="text-red-400 text-xs font-medium">Error</span>
        </div>
      ))}

      {/* Success badge (center) */}
      <div
        className={`bg-blue-950/40 border-2 border-blue-500/50 rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-500 ${
          fadeErrors ? 'opacity-100 scale-110 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'opacity-0 scale-75'
        }`}
        style={{ transitionDelay: '600ms' }}
      >
        <CheckCircle size={18} className="text-blue-400" />
        <span className="text-blue-400 text-sm font-semibold">Resuelto</span>
      </div>
    </div>
  )
}

