'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  CASE_FILTERS,
  getCasesForFilter,
  type CaseCategory,
} from '@/lib/case-studies/data'
import CaseStudyCard from './CaseStudyCard'

const INITIAL_VISIBLE = 3

export default function CaseStudiesSection() {
  const [activeFilter, setActiveFilter] = useState<CaseCategory>('Todos')
  const [expanded, setExpanded] = useState(false)
  const cases = getCasesForFilter(activeFilter)
  const visibleCases = expanded ? cases : cases.slice(0, INITIAL_VISIBLE)
  const hasMore = cases.length > INITIAL_VISIBLE

  const handleFilterChange = (cat: CaseCategory) => {
    setActiveFilter(cat)
    setExpanded(false)
  }

  return (
    <section
      id="work"
      className="bg-[#000000] px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="cases-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="inline-block rounded-lg border border-white/20 bg-black px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white">
            Casos de éxito
          </span>
          <h2
            id="cases-heading"
            className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            Sistemas reales que generan
            <br />
            resultados reales
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">
            Automatizaciones de IA que están funcionando en producción para
            empresas de LATAM
          </p>
        </motion.header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {CASE_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'border border-zinc-700 bg-zinc-900/50 text-gray-400 hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCases.map((c, i) => (
            <CaseStudyCard key={c.slug} caseStudy={c} index={i} />
          ))}
        </div>

        {cases.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            No hay casos en esta categoría.
          </p>
        )}

        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={() => setExpanded((e) => !e)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-600/20"
            >
              {expanded ? (
                <>
                  Ver menos
                  <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                </>
              ) : (
                <>
                  Ver más
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
