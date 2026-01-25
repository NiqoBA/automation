'use client'

import { motion } from 'framer-motion'
import { Check, Lightbulb } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface SolutionSectionProps {
  caseStudy: CaseStudyDetail
}

export default function SolutionSection({ caseStudy }: SolutionSectionProps) {
  return (
    <section className="border-t border-zinc-800 bg-[#0a0a0a] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
            <Lightbulb size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-white">
            Cómo lo resolvimos
          </h2>
        </motion.div>
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
