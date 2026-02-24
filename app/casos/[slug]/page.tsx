import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingModal from '@/components/BookingModal'
import {
  getCaseBySlug,
  CASE_STUDIES,
} from '@/lib/case-studies/data'
import CaseHero from '@/components/case-studies/detail/CaseHero'
import ChallengeSection from '@/components/case-studies/detail/ChallengeSection'
import SolutionSection from '@/components/case-studies/detail/SolutionSection'
import ResultsSection from '@/components/case-studies/detail/ResultsSection'
import RagSection from '@/components/case-studies/detail/RagSection'
import TestimonialSection from '@/components/case-studies/detail/TestimonialSection'

import CaseCTA from '@/components/case-studies/detail/CaseCTA'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const caseStudy = getCaseBySlug(slug)
  if (!caseStudy) return { title: 'Caso no encontrado | Inflexo AI' }
  return {
    title: `${caseStudy.title} - Caso de Éxito | Inflexo AI`,
    description: caseStudy.description,
    openGraph: {
      title: `${caseStudy.title} - Caso de Éxito | Inflexo AI`,
      description: caseStudy.description,
      images: caseStudy.image ? [{ url: caseStudy.image, alt: caseStudy.title }] : undefined,
    },
  }
}

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }))
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { slug } = await params
  const caseStudy = getCaseBySlug(slug)
  if (!caseStudy) notFound()

  return (
    <main className="min-h-screen bg-[#000000]">
      <Navbar />
      <CaseHero caseStudy={caseStudy} />
      {/* Las métricas de éxito primero */}
      <ResultsSection caseStudy={caseStudy} />

      {/* Luego la explicación textual */}
      <ChallengeSection caseStudy={caseStudy} />
      <SolutionSection caseStudy={caseStudy} />

      {/* Tiempo de desarrollo */}
      <section className="bg-black px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase opacity-80">
            Tiempo de Desarrollo
          </h2>
          <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600/10 border border-purple-500/20 px-6 py-4">
            <span className="text-2xl font-bold text-purple-400">{caseStudy.devTime}</span>
          </div>
        </div>
      </section>

      <RagSection caseStudy={caseStudy} />

      {/* Finalmente el testimonio */}
      <TestimonialSection caseStudy={caseStudy} />

      <CaseCTA />
      <Footer />
      <BookingModal />
    </main>
  )
}
