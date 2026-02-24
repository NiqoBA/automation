'use client'

import { motion } from 'framer-motion'
import { Check, Lightbulb } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface SolutionSectionProps {
  caseStudy: CaseStudyDetail
}

export default function SolutionSection({ caseStudy }: SolutionSectionProps) {
  return (
    <section className="bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold tracking-tight text-white uppercase opacity-80">
          Nuestra Solución
        </h2>
        <div className="mt-8 space-y-5">
          {caseStudy.solution.map((para, i) => (
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
        {caseStudy.solutionFeatures && caseStudy.solutionFeatures.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 space-y-3"
          >
            {caseStudy.solutionFeatures.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-gray-300"
              >
                <Check
                  size={18}
                  className="mt-0.5 flex-shrink-0 text-purple-400"
                />
                {f}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  )
}
