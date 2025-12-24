'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'
import Logo from './Logo'

export default function Hero() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleBookDemo = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  const handleViewWork = () => {
    const element = document.querySelector('#work')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-20">
      {/* Black Background - Base layer */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: '#000000' }} />
      
      {/* Static Stars scattered across hero (excluding header area) */}
      <div className="absolute inset-0 z-[1]" style={{ top: '15%' }}>
        {mounted && <StaticStars />}
      </div>
      
      {/* Animated Stars and Purple Sphere - Above background, below content (excluding header area) */}
      <div className="absolute inset-0 z-[1]" style={{ top: '15%' }}>
        {mounted && <AnimatedStars />}
        <PurpleSphere />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-120px)] pt-24 pb-20 flex-col items-center justify-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="inline-flex items-center px-3 py-1.5 rounded-full mb-6"
            style={{
              backgroundColor: '#000000',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold mr-2"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                color: '#FFFFFF',
              }}
            >
              New
            </span>
            <span className="text-xs" style={{ color: '#FFFFFF' }}>
              {t('hero.badgeText')}
            </span>
          </motion.div>

          {/* Title - Smaller and more compact */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 max-w-[800px] mx-auto"
            style={{ 
              color: '#FFFFFF',
              fontFamily: 'var(--font-poppins), Poppins, system-ui, sans-serif',
              fontWeight: 700,
              fontFeatureSettings: '"liga" 1, "calt" 1',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            {t('hero.title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg max-w-[550px] mx-auto mt-4 mb-6"
            style={{ 
              color: '#D4D4D8',
              fontFamily: 'var(--font-poppins), Poppins, system-ui, sans-serif',
              fontWeight: 600,
            }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            {/* Primary CTA */}
            <motion.button
              onClick={handleBookDemo}
              className="group px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                color: '#FFFFFF',
              }}
              whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{t('hero.cta.demo')}</span>
              <ArrowRight 
                size={16} 
                className="transition-transform duration-300 group-hover:translate-x-1" 
              />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              onClick={handleViewWork}
              className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
              }}
              whileHover={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {t('hero.cta.work')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Static Stars Component - Stars scattered across the hero background with gentle movement
function StaticStars() {
  // Reduced number of stars - Fixed positions to avoid hydration mismatch - No stars in header area (top < 20%)
  const stars = [
    { id: 0, top: '22%', left: '12%', size: 2, opacity: 0.6, delay: 0 },
    { id: 1, top: '25%', left: '85%', size: 2.5, opacity: 0.4, delay: 0.5 },
    { id: 2, top: '28%', left: '25%', size: 3, opacity: 0.3, delay: 1 },
    { id: 3, top: '35%', left: '70%', size: 2.2, opacity: 0.7, delay: 1.5 },
    { id: 4, top: '42%', left: '10%', size: 1.9, opacity: 0.5, delay: 0.2 },
    { id: 5, top: '48%', left: '55%', size: 2.4, opacity: 0.4, delay: 0.7 },
    { id: 6, top: '55%', left: '35%', size: 2.1, opacity: 0.6, delay: 1.2 },
    { id: 7, top: '62%', left: '80%', size: 1.7, opacity: 0.5, delay: 1.7 },
    { id: 8, top: '68%', left: '20%', size: 2.8, opacity: 0.3, delay: 0.3 },
    { id: 9, top: '75%', left: '65%', size: 2, opacity: 0.6, delay: 0.8 },
    { id: 10, top: '82%', left: '5%', size: 2.3, opacity: 0.4, delay: 1.3 },
    { id: 11, top: '88%', left: '90%', size: 1.9, opacity: 0.5, delay: 1.8 },
    { id: 12, top: '25%', left: '75%', size: 1.8, opacity: 0.6, delay: 0.1 },
    { id: 13, top: '32%', left: '15%', size: 2.4, opacity: 0.4, delay: 0.6 },
    { id: 14, top: '38%', left: '95%', size: 1.6, opacity: 0.7, delay: 1.1 },
    { id: 15, top: '45%', left: '50%', size: 2, opacity: 0.5, delay: 1.6 },
    { id: 16, top: '52%', left: '18%', size: 3.2, opacity: 0.3, delay: 0.4 },
    { id: 17, top: '58%', left: '88%', size: 2.1, opacity: 0.6, delay: 0.9 },
    { id: 18, top: '65%', left: '28%', size: 2.3, opacity: 0.4, delay: 1.4 },
    { id: 19, top: '72%', left: '72%', size: 1.7, opacity: 0.7, delay: 1.9 },
    { id: 20, top: '78%', left: '8%', size: 2.5, opacity: 0.4, delay: 0.25 },
    { id: 21, top: '85%', left: '52%', size: 1.9, opacity: 0.6, delay: 0.75 },
    { id: 22, top: '92%', left: '35%', size: 2, opacity: 0.5, delay: 1.25 },
    { id: 23, top: '30%', left: '8%', size: 2.5, opacity: 0.4, delay: 1.75 },
    { id: 24, top: '50%', left: '3%', size: 1.8, opacity: 0.6, delay: 0.15 },
    { id: 25, top: '70%', left: '45%', size: 3, opacity: 0.3, delay: 0.65 },
    { id: 26, top: '90%', left: '60%', size: 2.1, opacity: 0.6, delay: 1.15 },
    { id: 27, top: '34%', left: '82%', size: 1.9, opacity: 0.5, delay: 1.65 },
    { id: 28, top: '54%', left: '38%', size: 1.7, opacity: 0.7, delay: 0.35 },
    { id: 29, top: '74%', left: '62%', size: 2.6, opacity: 0.4, delay: 0.85 },
    { id: 30, top: '26%', left: '58%', size: 2.4, opacity: 0.4, delay: 1.35 },
    { id: 31, top: '46%', left: '22%', size: 1.8, opacity: 0.6, delay: 1.85 },
    { id: 32, top: '66%', left: '88%', size: 2.7, opacity: 0.3, delay: 0.45 },
    { id: 33, top: '86%', left: '15%', size: 1.9, opacity: 0.5, delay: 0.95 },
    { id: 34, top: '36%', left: '68%', size: 2.5, opacity: 0.4, delay: 1.45 },
    { id: 35, top: '56%', left: '12%', size: 1.6, opacity: 0.7, delay: 1.95 },
    { id: 36, top: '76%', left: '48%', size: 2.3, opacity: 0.4, delay: 0.05 },
    { id: 37, top: '29%', left: '33%', size: 1.9, opacity: 0.6, delay: 0.55 },
    { id: 38, top: '49%', left: '67%', size: 2.2, opacity: 0.4, delay: 1.05 },
    { id: 39, top: '69%', left: '11%', size: 2.6, opacity: 0.3, delay: 1.55 },
    { id: 40, top: '89%', left: '55%', size: 1.8, opacity: 0.6, delay: 2.05 },
    { id: 41, top: '31%', left: '53%', size: 2, opacity: 0.5, delay: 0.12 },
    { id: 42, top: '51%', left: '77%', size: 2.5, opacity: 0.3, delay: 0.62 },
    { id: 43, top: '71%', left: '21%', size: 1.9, opacity: 0.6, delay: 1.12 },
    { id: 44, top: '91%', left: '65%', size: 2.2, opacity: 0.4, delay: 1.62 },
    { id: 45, top: '33%', left: '43%', size: 2.1, opacity: 0.5, delay: 2.12 },
    { id: 46, top: '53%', left: '87%', size: 1.7, opacity: 0.7, delay: 0.22 },
    { id: 47, top: '73%', left: '31%', size: 2.3, opacity: 0.4, delay: 0.72 },
    { id: 48, top: '93%', left: '75%', size: 2, opacity: 0.5, delay: 1.22 },
  ]

  return (
    <>
      {stars.map((star) => {
        // Valores fijos para cada estrella basados en su ID para evitar cambios en cada render
        const moveX1 = (star.id % 7) * 2 - 6;
        const moveX2 = ((star.id * 3) % 7) * 2 - 6;
        const moveY1 = ((star.id * 2) % 7) * 2 - 6;
        const moveY2 = ((star.id * 5) % 7) * 2 - 6;
        const duration = 15 + (star.id % 10);
        
        return (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#FFFFFF',
              opacity: star.opacity,
            }}
            animate={{
              x: [0, moveX1, moveX2, 0],
              y: [0, moveY1, moveY2, 0],
              opacity: [star.opacity, star.opacity * 0.7, star.opacity * 0.9, star.opacity],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
          />
        );
      })}
    </>
  )
}

// Animated Stars Component - Additional stars with gentle movement
function AnimatedStars() {
  // Additional stars with gentle animation
  const stars = [
    { id: 0, top: '20%', left: '15%', size: 3.5, opacity: 0.7, delay: 0 },
    { id: 1, top: '23%', left: '80%', size: 3, opacity: 0.6, delay: 0.5 },
    { id: 2, top: '27%', left: '30%', size: 3.2, opacity: 0.5, delay: 1 },
    { id: 3, top: '30%', left: '65%', size: 4, opacity: 0.4, delay: 1.5 },
    { id: 4, top: '33%', left: '5%', size: 2.5, opacity: 0.8, delay: 0.2 },
    { id: 5, top: '37%', left: '90%', size: 3, opacity: 0.6, delay: 0.7 },
    { id: 6, top: '40%', left: '20%', size: 3.3, opacity: 0.5, delay: 1.2 },
    { id: 7, top: '43%', left: '75%', size: 2.8, opacity: 0.7, delay: 1.7 },
    { id: 8, top: '47%', left: '10%', size: 3.5, opacity: 0.4, delay: 0.3 },
    { id: 9, top: '50%', left: '85%', size: 3, opacity: 0.6, delay: 0.8 },
    { id: 10, top: '53%', left: '25%', size: 3.2, opacity: 0.5, delay: 1.3 },
    { id: 11, top: '57%', left: '70%', size: 2.5, opacity: 0.8, delay: 1.8 },
    { id: 12, top: '60%', left: '15%', size: 3, opacity: 0.6, delay: 0.1 },
    { id: 13, top: '63%', left: '80%', size: 3.3, opacity: 0.5, delay: 0.6 },
    { id: 14, top: '67%', left: '35%', size: 2.8, opacity: 0.7, delay: 1.1 },
    { id: 15, top: '70%', left: '60%', size: 3.5, opacity: 0.4, delay: 1.6 },
    { id: 16, top: '73%', left: '8%', size: 3, opacity: 0.6, delay: 0.4 },
    { id: 17, top: '77%', left: '92%', size: 3.2, opacity: 0.5, delay: 0.9 },
    { id: 18, top: '80%', left: '45%', size: 2.5, opacity: 0.8, delay: 1.4 },
    { id: 19, top: '83%', left: '18%', size: 3, opacity: 0.6, delay: 1.9 },
    { id: 20, top: '87%', left: '88%', size: 3.3, opacity: 0.5, delay: 0.25 },
    { id: 21, top: '90%', left: '55%', size: 2.8, opacity: 0.7, delay: 0.75 },
  ]

  return (
    <>
      {stars.map((star) => {
        // Valores fijos para cada estrella basados en su ID para evitar cambios en cada render
        const moveX1 = (star.id % 5) * 1.5 - 3;
        const moveX2 = ((star.id * 3) % 5) * 1.5 - 3;
        const moveY1 = ((star.id * 2) % 5) * 1.5 - 3;
        const moveY2 = ((star.id * 4) % 5) * 1.5 - 3;
        const duration = 18 + (star.id % 12);
        
        return (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#FFFFFF',
              opacity: star.opacity,
            }}
            animate={{
              x: [0, moveX1, moveX2, 0],
              y: [0, moveY1, moveY2, 0],
              opacity: [star.opacity, star.opacity * 0.6, star.opacity * 0.95, star.opacity],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
          />
        );
      })}
    </>
  )
}

// Purple gradient blob in the center of the hero
function PurpleSphere() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1]">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          aspectRatio: '1 / 1',
          background: 'linear-gradient(229deg, #df7afe 13%, rgba(201, 110, 240, 0) 35.0235827429153%, rgba(164, 92, 219, 0) 64.17244225559735%, rgb(129, 74, 200) 88%)',
          borderRadius: '363px',
          flex: 'none',
          gap: '10px',
          height: '406px',
          overflow: 'hidden',
          position: 'relative',
          width: '406px',
          willChange: 'transform',
          opacity: 1,
          filter: 'blur(1px)',
        }}
      />
    </div>
  )
}
