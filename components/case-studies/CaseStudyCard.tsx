'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import type { CaseStudyCard as CaseStudyCardType } from '@/lib/case-studies/data'

interface CaseStudyCardProps {
  caseStudy: CaseStudyCardType
  index: number
}

export default function CaseStudyCard({ caseStudy, index }: CaseStudyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)]"
    >
      {/* Image 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <Image
          src={caseStudy.image}
          alt={caseStudy.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        {/* Tags overlay */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {caseStudy.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-800/90 px-2 py-0.5 text-[10px] font-medium text-gray-300 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Category badge */}
        <div className="absolute right-3 top-3">
          <span className="rounded-lg bg-purple-600/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {caseStudy.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-white">{caseStudy.title}</h3>
        <p className="mt-1 text-xs text-gray-500">{caseStudy.client.name}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-400">
          {caseStudy.description}
        </p>

        {/* Metric highlight */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-2">
          <TrendingUp size={16} className="flex-shrink-0 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">
            {caseStudy.metricHighlight}
          </span>
        </div>

        <Link
          href={`/casos/${caseStudy.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/50 bg-purple-500/10 py-2.5 text-sm font-semibold text-purple-300 transition-all duration-300 hover:border-purple-500 hover:bg-purple-500/20 hover:text-white group/link"
        >
          Conocer más
          <ArrowRight
            size={16}
            className="transition-transform group-hover/link:translate-x-0.5"
          />
        </Link>
      </div>
    </motion.article>
  )
}
