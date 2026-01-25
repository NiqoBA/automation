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
import TechStackSection from '@/components/case-studies/detail/TechStackSection'
import ResultsSection from '@/components/case-studies/detail/ResultsSection'
import RagSection from '@/components/case-studies/detail/RagSection'
import TestimonialSection from '@/components/case-studies/detail/TestimonialSection'
import GallerySection from '@/components/case-studies/detail/GallerySection'
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
      <ChallengeSection caseStudy={caseStudy} />
      <SolutionSection caseStudy={caseStudy} />
      <TechStackSection caseStudy={caseStudy} />
      <ResultsSection caseStudy={caseStudy} />
      <RagSection caseStudy={caseStudy} />
      <TestimonialSection caseStudy={caseStudy} />
      <GallerySection caseStudy={caseStudy} />
      <CaseCTA />
      <Footer />
      <BookingModal />
    </main>
  )
}
