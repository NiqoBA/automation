'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface ResultsSectionProps {
  caseStudy: CaseStudyDetail
}

export default function ResultsSection({ caseStudy }: ResultsSectionProps) {
  return (
    <section className="bg-black px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
        >
          {caseStudy.results.map((r, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/5 bg-zinc-900/30 p-6 transition-all hover:bg-zinc-900/50 hover:border-purple-500/30"
            >
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="relative text-xs font-medium uppercase tracking-wider text-gray-500">{r.label}</p>
              <p className="relative mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{r.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
