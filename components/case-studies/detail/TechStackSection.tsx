'use client'

import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface TechStackSectionProps {
  caseStudy: CaseStudyDetail
}

export default function TechStackSection({ caseStudy }: TechStackSectionProps) {
  return (
    <section className="border-t border-zinc-800 bg-[#000000] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
            <Cpu size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-white">
            Stack técnico
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          {caseStudy.techStack.map((tech, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <p className="font-semibold text-white">{tech.name}</p>
              {tech.description && (
                <p className="mt-1 text-sm text-gray-500">{tech.description}</p>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
