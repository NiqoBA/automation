'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface ResultsSectionProps {
  caseStudy: CaseStudyDetail
}

export default function ResultsSection({ caseStudy }: ResultsSectionProps) {
  return (
    <section className="border-t border-zinc-800 bg-[#0a0a0a] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
            <TrendingUp size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-white">
            El impacto real
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {caseStudy.results.map((r, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
            >
              <p className="text-sm text-gray-500">{r.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{r.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
