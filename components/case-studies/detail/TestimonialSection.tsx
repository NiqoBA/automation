'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface TestimonialSectionProps {
  caseStudy: CaseStudyDetail
}

export default function TestimonialSection({ caseStudy }: TestimonialSectionProps) {
  const t = caseStudy.testimonial
  if (!t) return null

  return (
    <section className="border-t border-zinc-800 bg-[#000000] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 sm:p-10"
        >
          <Quote
            size={32}
            className="absolute left-6 top-6 text-purple-500/30"
            aria-hidden
          />
          <p className="relative text-lg leading-relaxed text-gray-300">
            &ldquo;{t.quote}&rdquo;
          </p>
          {(t.name || t.image) && (
            <footer className="mt-6 flex items-center gap-4">
              {t.image && (
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {t.name && (
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-sm text-gray-500">
                      {[t.role, t.company].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              )}
            </footer>
          )}
        </motion.blockquote>
      </div>
    </section>
  )
}
