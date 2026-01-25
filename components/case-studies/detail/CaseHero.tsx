'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface CaseHeroProps {
  caseStudy: CaseStudyDetail
}

export default function CaseHero({ caseStudy }: CaseHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#000000] px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {caseStudy.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {caseStudy.title}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2">
            {caseStudy.client.logo ? (
              <Image
                src={caseStudy.client.logo}
                alt={caseStudy.client.name}
                width={28}
                height={28}
                className="object-contain"
              />
            ) : null}
            <span className="text-gray-400">{caseStudy.client.name}</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-purple-600/20 px-6 py-3">
              <span className="text-lg font-semibold text-purple-300">
                {caseStudy.metricHighlight}
              </span>
            </div>
            {caseStudy.externalUrl && (
              <a
                href={caseStudy.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-purple-500/50 hover:text-white"
              >
                Visitar sitio
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800"
        >
          <Image
            src={caseStudy.image}
            alt={caseStudy.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </motion.div>
      </div>
    </section>
  )
}
