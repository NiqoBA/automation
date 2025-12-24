'use client'

import { motion } from 'framer-motion'
import { Check, Zap, TrendingUp, TrendingDown, MessageCircle, Settings, Shield, Gauge, Inbox, RefreshCw, File, Search, GitBranch, ChevronLeft, ChevronRight, Minimize2, Minus, X, MessageSquare, ArrowUp, Filter } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'

// Seamless Integration Step Component
function SeamlessIntegrationStep() {
  const [particlePositions, setParticlePositions] = useState([0, 0, 0])
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)

  const logos = [
    { name: 'WhatsApp', src: '/imgs/WhatsApp.svg.webp' },
    { name: 'Gmail', src: '/imgs/logo-Gmail-1.png' },
    { name: 'Google Calendar', src: '/imgs/Google-Calendar-Logo.png' },
  ]

  // Animate particles flowing from left to right
  useEffect(() => {
    const intervals = [
      setInterval(() => {
        setParticlePositions(prev => {
          const newPos = [...prev]
          newPos[0] = (newPos[0] + 2) % 100
          return newPos
        })
      }, 30),
      setInterval(() => {
        setParticlePositions(prev => {
          const newPos = [...prev]
          newPos[1] = (newPos[1] + 1.5) % 100
          return newPos
        })
      }, 30),
      setInterval(() => {
        setParticlePositions(prev => {
          const newPos = [...prev]
          newPos[2] = (newPos[2] + 1.8) % 100
          return newPos
        })
      }, 30),
    ]

    return () => intervals.forEach(clearInterval)
  }, [])

  // Animate logo changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % logos.length)
    }, 2000) // Change logo every 2 seconds

    return () => clearInterval(interval)
  }, [logos.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4"
    >
      {/* Header */}
      <div className="mb-3">
        <div className="inline-block bg-white/10 rounded px-2.5 py-1 mb-1.5">
          <span className="text-white text-xs font-medium">Paso 3</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-1.5">Integraciones Completas</h3>
        <p className="text-sm text-gray-400">
          Integramos sin problemas las soluciones de IA en tu infraestructura existente con mínima interrupción.
        </p>
      </div>

      {/* Integration Visualization */}
      <div className="bg-[#0a0a0a] rounded border border-white/10 p-3">
        <div className="flex items-center justify-center gap-3 md:gap-6 flex-nowrap">
          {/* Left: Our Solution - Logo */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded border border-white/10 flex items-center justify-center relative overflow-hidden">
              <Logo size={56} animated={true} blur={1} />
            </div>
            <p className="text-white mt-1.5 text-xs">Nuestra solución</p>
          </div>

          {/* Center: Connection Lines */}
          <div className="relative w-24 h-20 flex flex-col justify-center gap-3">
            {[0, 1, 2].map((lineIndex) => (
              <div key={lineIndex} className="relative">
                {/* Base line */}
                <div className="h-0.5 w-full bg-white/10" />
                
                {/* Animated particle */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                  style={{
                    left: `${particlePositions[lineIndex]}%`,
                    transition: 'left 0.03s linear'
                  }}
                >
                  {/* Trail effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 blur-sm animate-pulse" />
                </div>

                {/* Arrow at the end */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-white/20" />
              </div>
            ))}
          </div>

          {/* Right: Your Stack - Animated Logos */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded border border-white/10 flex items-center justify-center relative overflow-hidden p-2.5">
              {/* Animated Logos */}
              {logos.map((logo, index) => (
                <motion.div
                  key={logo.name}
                  className="absolute inset-0 flex items-center justify-center p-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: currentLogoIndex === index ? 1 : 0,
                    scale: currentLogoIndex === index ? 1 : 0.8,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              ))}
            </div>
            <p className="text-white mt-1.5 text-xs">Tu stack</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Continuous Optimization Step Component
function ContinuousOptimizationStep() {
  const [rotation, setRotation] = useState(0)

  // Animate loading spinner
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 6) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const systems = [
    {
      id: 'chatbot',
      icon: MessageSquare,
      name: 'Sistema de chatbot',
      status: 'La eficiencia aumentará un 20%',
      statusType: 'loading' as const,
    },
    {
      id: 'workflow',
      icon: Settings,
      name: 'Sistema de flujo de trabajo',
      status: 'Actualización disponible...',
      statusType: 'update' as const,
    },
    {
      id: 'sales',
      icon: Filter,
      name: 'Sistema de ventas',
      status: 'Actualizado',
      statusType: 'success' as const,
    },
  ]

  const renderStatusIndicator = (statusType: string) => {
    switch(statusType) {
      case 'loading':
        return (
          <div className="relative w-5 h-5">
            <svg 
              className="w-5 h-5"
              viewBox="0 0 32 32"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke="url(#spinnerGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="60 20"
              />
              <defs>
                <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )
      
      case 'update':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="relative">
              <ArrowUp 
                size={14} 
                className="text-purple-400"
                strokeWidth={2.5}
              />
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowUp 
                  size={14} 
                  className="text-purple-400 blur-sm opacity-50"
                  strokeWidth={2.5}
                />
              </motion.div>
            </div>
          </div>
        )
      
      case 'success':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="relative">
              <Check 
                size={14} 
                className="text-purple-400"
                strokeWidth={3}
              />
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Check 
                  size={14} 
                  className="text-purple-400 blur-md"
                  strokeWidth={3}
                />
              </motion.div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4"
    >
      {/* Header */}
      <div className="mb-3">
        <div className="inline-block bg-white/10 rounded px-2.5 py-1 mb-1.5">
          <span className="text-white text-xs font-medium">Paso 4</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-1.5">Optimización Continua</h3>
        <p className="text-sm text-gray-400">
          Refinamos el rendimiento, analizamos insights y mejoramos la automatización para un crecimiento a largo plazo.
        </p>
      </div>

      {/* System Status Cards */}
      <div className="space-y-1.5">
        {systems.map((system, index) => {
          const Icon = system.icon
          return (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2.5 bg-[#0d0d0d] rounded border border-white/10 p-2 hover:border-purple-500/50 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="flex-shrink-0 text-white group-hover:text-purple-400 transition-colors">
                <Icon size={14} />
              </div>
              
              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-white text-sm font-semibold mb-0.5">
                  {system.name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {system.status}
                </p>
              </div>
              
              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {renderStatusIndicator(system.statusType)}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// AI Development Step Component
function AIDevelopmentStep() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const codeRef = useRef<HTMLDivElement>(null)

  // Sample code lines that will scroll
  const codeLines = [
    { text: 'def get_status(self):', color: 'purple', indent: 0 },
    { text: '    return f"Status: {self.status}"', color: 'white', indent: 1 },
    { text: '', color: 'white', indent: 0 },
    { text: 'class AutomationTrigger:', color: 'purple', indent: 0 },
    { text: '    def __init__(self, threshold):', color: 'purple', indent: 1 },
    { text: '        self.threshold = threshold', color: 'white', indent: 2 },
    { text: '        self.status = "inactive"', color: 'gray', indent: 2 },
    { text: '', color: 'white', indent: 0 },
    { text: '    def activate(self):', color: 'purple', indent: 1 },
    { text: '        """Activar trigger de automatización"""', color: 'green', indent: 2 },
    { text: '        if self.threshold > 0:', color: 'purple', indent: 2 },
    { text: '            self.status = "active"', color: 'white', indent: 3 },
    { text: '            return True', color: 'purple', indent: 3 },
    { text: '        return False', color: 'purple', indent: 2 },
    { text: '', color: 'white', indent: 0 },
    { text: '    async def process_workflow(self, data):', color: 'purple', indent: 1 },
    { text: '        """Procesar flujo de automatización"""', color: 'green', indent: 2 },
    { text: '        results = []', color: 'white', indent: 2 },
    { text: '        for item in data:', color: 'purple', indent: 2 },
    { text: '            processed = await self.analyze(item)', color: 'white', indent: 3 },
    { text: '            results.append(processed)', color: 'white', indent: 3 },
    { text: '        return results', color: 'purple', indent: 2 },
  ]

  // Duplicate code lines for infinite scroll
  const infiniteCodeLines = [...codeLines, ...codeLines, ...codeLines]

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const lineHeight = 24 // height of each line
        const maxScroll = codeLines.length * lineHeight
        const newPosition = prev + 1
        
        // Reset to create seamless loop
        return newPosition >= maxScroll ? 0 : newPosition
      })
    }, 50) // Scroll speed (lower = faster)

    return () => clearInterval(interval)
  }, [codeLines.length])

  const getColorClass = (color: string) => {
    switch(color) {
      case 'purple': return 'text-purple-400'
      case 'green': return 'text-green-400'
      case 'gray': return 'text-gray-500'
      case 'blue': return 'text-blue-400'
      default: return 'text-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4"
    >
      {/* Header */}
      <div className="mb-3">
        <div className="inline-block bg-white/10 rounded px-2.5 py-1 mb-1.5">
          <span className="text-white text-xs font-medium">Paso 2</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-1.5">Desarrollo de IA</h3>
        <p className="text-sm text-gray-400">
          Nuestro equipo construye sistemas de automatización inteligentes adaptados a tus procesos empresariales.
        </p>
      </div>

      {/* Code Editor Mockup */}
      <div className="bg-[#0d0d0d] rounded overflow-hidden border border-white/10">
        {/* Top bar */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-[#0a0a0a] border-b border-white/10">
          <div className="flex items-center gap-2">
            <ChevronLeft size={12} className="text-gray-500" />
            <ChevronRight size={12} className="text-gray-500" />
          </div>
          <div className="flex items-center gap-1.5">
            <Minimize2 size={10} className="text-gray-500" />
            <Minus size={10} className="text-gray-500" />
            <X size={10} className="text-gray-500" />
          </div>
        </div>

        {/* Editor content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-7 bg-[#0a0a0a] border-r border-white/10 py-2 flex flex-col items-center gap-2.5">
            <File size={14} className="text-gray-600 hover:text-white transition-colors cursor-pointer" />
            <Search size={14} className="text-gray-600 hover:text-white transition-colors cursor-pointer" />
            <GitBranch size={14} className="text-gray-600 hover:text-white transition-colors cursor-pointer" />
          </div>

          {/* Code area */}
          <div className="flex-1 overflow-hidden h-32 relative">
            <div 
              ref={codeRef}
              className="absolute top-0 left-0 right-0 py-2 px-2.5 font-mono text-xs"
              style={{ 
                transform: `translateY(-${scrollPosition}px)`,
                transition: 'transform 0.05s linear'
              }}
            >
              {infiniteCodeLines.map((line, index) => (
                <div 
                  key={`line-${index}`}
                  className="flex items-center min-h-[16px] h-[16px]"
                  style={{ 
                    paddingLeft: `${line.indent * 16}px`
                  }}
                >
                  <span className="text-gray-700 w-7 text-right mr-2 select-none flex-shrink-0 text-xs">
                    {(index % codeLines.length) + 1}
                  </span>
                  <span className={`${getColorClass(line.color)} flex-1 whitespace-pre text-xs`}>
                    {line.text || ' '}
                  </span>
                </div>
              ))}
            </div>

            {/* Gradient overlays for fade effect */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#0d0d0d] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="inline-block px-3 py-1.5 bg-black border border-white rounded-lg text-white text-[10px] font-medium uppercase tracking-wide">
            Nuestro Proceso
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
            Nuestro Proceso Simple<br />
            Inteligente y Escalable
          </h2>
          <p className="text-base md:text-lg text-white max-w-3xl mx-auto">
            Diseñamos, desarrollamos e implementamos herramientas de automatización que te ayudan a trabajar más inteligentemente, no más duro
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto mt-10">
          {/* Step 1: Smart Analyzing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4"
          >
            {/* Header */}
            <div className="mb-3">
              <div className="inline-block bg-white/10 rounded px-2.5 py-1 mb-1.5">
                <span className="text-white text-xs font-medium">Paso 1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1.5">Análisis Inteligente</h3>
              <p className="text-sm text-gray-400">
                Evaluamos tus necesidades e identificamos soluciones de IA para optimizar flujos de trabajo y mejorar la eficiencia.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left: Radar Animation */}
              <div className="bg-[#1a1a1a] rounded border border-white/10 p-3 flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-2">
                  {/* Radar container */}
                  <div className="radar-container">
                    {/* Radar background circles */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                      {/* Outer circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      {/* Middle circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="60"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      {/* Inner circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="30"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      {/* Center lines */}
                      <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    </svg>

                    {/* Rotating pointer (semicircle) */}
                    <div className="radar-pointer">
                      <div className="radar-pointer-line"></div>
                    </div>

                    {/* Pulsing shadow */}
                    <div className="radar-shadow"></div>
                  </div>
                </div>
                
                <p className="text-white text-xs flex items-center gap-1">
                  Analizando flujo de trabajo actual
                  <span className="inline-flex ml-1">
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                    >
                      .
                    </motion.span>
                  </span>
                </p>
              </div>

              {/* Right: Checklist */}
              <div className="space-y-1.5">
                {[
                  { icon: Shield, label: 'Verificación de sistema' },
                  { icon: Settings, label: 'Verificación de proceso' },
                  { icon: Gauge, label: 'Verificación de velocidad' },
                  { icon: Inbox, label: 'Trabajo manual' },
                  { icon: RefreshCw, label: 'Tarea repetitiva' },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-2 bg-[#1a1a1a] rounded border border-white/10 p-2 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                    >
                      <Icon size={14} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                      <span className="text-white text-sm">{item.label}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Step 2: AI Development */}
          <AIDevelopmentStep />

          {/* Step 3: Seamless Integration */}
          <SeamlessIntegrationStep />

          {/* Step 4: Continuous Optimization */}
          <ContinuousOptimizationStep />
        </div>
      </div>
    </section>
  )
}
