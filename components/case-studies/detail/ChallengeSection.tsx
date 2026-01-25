'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface ChallengeSectionProps {
  caseStudy: CaseStudyDetail
}

export default function ChallengeSection({ caseStudy }: ChallengeSectionProps) {
  return (
    <section className="border-t border-zinc-800 bg-[#000000] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <AlertCircle size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-white">
            El problema que resolvimos
          </h2>
        </motion.div>
        <div className="mt-8 space-y-5">
          {caseStudy.challenge.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="text-base leading-relaxed text-gray-400"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}
