import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'We Automate | AI Automation & Digital Transformation Studio',
  description: 'We build automation systems that run your operations. We integrate AI into business processes, automate repetitive workflows, and build functional systems.',
  keywords: ['AI automation', 'digital transformation', 'workflow automation', 'ERP integration', 'CRM integration', 'business automation', 'automation consulting'],
  authors: [{ name: 'We Automate' }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'We Automate | AI Automation & Digital Transformation',
    description: 'We build automation systems that run your operations.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'We Automate | AI Automation & Digital Transformation',
    description: 'We build automation systems that run your operations.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

