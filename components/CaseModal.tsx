'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CaseModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: {
    id: string
    name: string
    category: string
    duration: string
    problem: string[]
    construction: string[]
    result: string[]
    integrations: string[]
    stack: string[]
    automations: string[]
  } | null
}

export default function CaseModal({ isOpen, onClose, caseData }: CaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleBookSimilar = () => {
    onClose()
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  const handleBookDemo = () => {
    onClose()
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.setAttribute('data-type', 'demo')
      modal.showModal()
    }
  }

  if (!caseData) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {caseData.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {caseData.duration}
                    </span>
                  </div>
                  <h2 id="modal-title" className="text-2xl font-semibold text-black">
                    {caseData.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-6">
                {/* Problema */}
                <div>
                  <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                    Problema
                  </h3>
                  <ul className="space-y-2">
                    {caseData.problem.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Construcción */}
                <div>
                  <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                    Construcción
                  </h3>
                  <ul className="space-y-2">
                    {caseData.construction.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resultado */}
                <div>
                  <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                    Resultado
                  </h3>
                  <ul className="space-y-2">
                    {caseData.result.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Integraciones */}
                {caseData.integrations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Integraciones
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseData.integrations.map((integration, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stack */}
                {caseData.stack.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseData.stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lo que automatiza */}
                {caseData.automations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Lo que automatiza
                    </h3>
                    <ul className="space-y-2">
                      {caseData.automations.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-gray-400 mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBookSimilar}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium text-sm"
                >
                  Quiero algo similar
                </button>
                <button
                  onClick={handleBookDemo}
                  className="px-6 py-3 text-gray-700 hover:text-black transition-colors font-medium text-sm underline"
                >
                  Book a Demo
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}




