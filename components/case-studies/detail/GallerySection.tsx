'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { CaseStudyDetail } from '@/lib/case-studies/data'

interface GallerySectionProps {
  caseStudy: CaseStudyDetail
}

export default function GallerySection({ caseStudy }: GallerySectionProps) {
  const gallery = caseStudy.gallery ?? []
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (gallery.length === 0) return null

  return (
    <section className="border-t border-zinc-800 bg-[#000000] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold text-white"
        >
          Galería
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 transition hover:border-purple-500/50"
            >
              <Image
                src={src}
                alt={`${caseStudy.title} - ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 rounded-full bg-zinc-800 p-2 text-white hover:bg-zinc-700"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={24} />
            </button>
            <div
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[lightboxIndex]}
                alt={`${caseStudy.title} - ${lightboxIndex + 1}`}
                width={1200}
                height={675}
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
