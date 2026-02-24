'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface ChallengeSectionProps {
  caseStudy: CaseStudyDetail
}

export default function ChallengeSection({ caseStudy }: ChallengeSectionProps) {
  return (
    <section className="bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold tracking-tight text-white uppercase opacity-80">
          El Desafío
        </h2>
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
