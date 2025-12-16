'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Do you replace our team?',
    answer: 'No. We augment your team by automating repetitive work so they can focus on high-value tasks. We build systems that make your team more effective, not replace them.',
  },
  {
    question: 'How do you handle security & data?',
    answer: 'We follow industry best practices: encrypted connections, role-based access control, audit logs, and compliance with data protection regulations. Your data stays in your systems—we only access what\'s necessary for integration.',
  },
  {
    question: 'Can you work with our ERP/CRM?',
    answer: 'Yes. We specialize in integrating with existing systems like Odoo, HubSpot, Salesforce, Zoho, and others. We connect to your current stack instead of forcing a rebuild.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Most automation projects ship in 2-4 weeks. Complex integrations or system builds may take 4-8 weeks. We start with a 1-3 day audit to give you a precise timeline.',
  },
  {
    question: 'Do you build dashboards and internal tools?',
    answer: 'Yes. We build structured databases with intuitive admin interfaces, dashboards, and internal tools that your team actually uses. We migrate from spreadsheets to production-ready systems.',
  },
  {
    question: 'What if we already have automations?',
    answer: 'We can audit your existing automations, identify gaps, improve reliability, and integrate new workflows. We also help migrate from fragile setups to stable, maintainable systems.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-off-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">FAQ</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                <ChevronDown
                  className={`text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  size={20}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


