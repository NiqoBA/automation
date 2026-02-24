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
    <section className="relative overflow-hidden bg-black px-4 pt-32 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Columna Izquierda: Introducción */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <div className="mb-6">
              <span className="rounded-lg bg-zinc-800/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
                {caseStudy.client.name}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              {caseStudy.title}
            </h1>

            <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-md">
              {caseStudy.description}
            </p>
          </motion.div>

          {/* Columna Derecha: Imagen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative aspect-video overflow-hidden rounded-2xl border border-white/5 shadow-2xl shadow-purple-500/5"
          >
            <Image
              src={caseStudy.image}
              alt={caseStudy.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 600px"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
