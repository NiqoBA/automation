'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UseCase {
  title: string
  problem: string
  solution: string
  outcome: string
  metrics: string[]
}

const useCases: UseCase[] = [
  {
    title: 'Reception + Scheduling Automation',
    problem: 'Manual scheduling leads to double bookings, missed appointments, and hours of admin work.',
    solution: 'AI-powered reception bot handles inquiries, checks availability, books appointments, and sends confirmations automatically.',
    outcome: 'Streamlined scheduling with zero manual intervention',
    metrics: ['-85% admin time', '+100% booking accuracy', '24/7 availability'],
  },
  {
    title: 'Lead Qualification + Follow-Up',
    problem: 'Sales team wastes time on unqualified leads. Follow-ups get missed, opportunities slip away.',
    solution: 'Automated lead scoring, qualification workflows, and AI-powered follow-up sequences that route hot leads instantly.',
    outcome: 'Sales team focuses on qualified opportunities',
    metrics: ['+22% lead response rate', '-40% time on unqualified leads', '2x conversion rate'],
  },
  {
    title: 'ERP/CRM Integration (Odoo, HubSpot, Salesforce, etc.)',
    problem: 'Data lives in silos. Manual sync between systems causes errors and delays.',
    solution: 'Bidirectional sync, automated data flows, and unified dashboards that connect your entire stack.',
    outcome: 'Single source of truth across all systems',
    metrics: ['-70% data entry errors', 'Real-time sync', '100% data accuracy'],
  },
  {
    title: 'Google Sheets → Database + Admin Interface',
    problem: 'Spreadsheets break at scale. No validation, no permissions, no audit trail.',
    solution: 'Migrate to structured databases with intuitive admin interfaces, role-based access, and automated backups.',
    outcome: 'Production-ready data infrastructure',
    metrics: ['-90% data errors', '10x faster queries', 'Full audit trail'],
  },
  {
    title: 'Customer Support Triage with AI',
    problem: 'Support tickets pile up. Urgent issues get buried. Response times suffer.',
    solution: 'AI classifies and prioritizes tickets, routes to the right team, drafts responses, and escalates critical issues.',
    outcome: 'Faster resolution, happier customers',
    metrics: ['-50% response time', '+35% first-contact resolution', '24/7 triage'],
  },
  {
    title: 'Recruiting / ATS Workflow Automation',
    problem: 'Resume screening is manual. Scheduling interviews is chaotic. Good candidates slip through.',
    solution: 'Automated resume parsing, candidate scoring, interview scheduling, and follow-up workflows.',
    outcome: 'Faster hiring, better candidate experience',
    metrics: ['-60% time to hire', '+45% candidate satisfaction', 'Automated pipeline'],
  },
]

export default function UseCasesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % useCases.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + useCases.length) % useCases.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
  }

  return (
    <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Use Cases</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real workflows we've automated for operations teams
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="overflow-hidden rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 border border-gray-100"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
                      {useCases[currentIndex].title}
                    </h3>
                    
                    {/* Before → After */}
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                      <div className="text-sm font-semibold text-red-700 mb-1">Before</div>
                      <div className="text-sm text-red-600">{useCases[currentIndex].problem}</div>
                    </div>

                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                      <div className="text-sm font-semibold text-green-700 mb-1">After</div>
                      <div className="text-sm text-green-600">{useCases[currentIndex].solution}</div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Outcome</div>
                      <div className="text-gray-800">{useCases[currentIndex].outcome}</div>
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-3">
                      {useCases[currentIndex].metrics.map((metric, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual Placeholder */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-24"></div>
                        </div>
                        <ArrowRight className="text-gray-400 mb-4" size={20} />
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {useCases.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

