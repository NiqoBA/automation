'use client'

import { Search, FileText, Wrench, Rocket } from 'lucide-react'

export default function Process() {
  const steps = [
    {
      icon: Search,
      title: 'Audit',
      duration: '1–3 days',
      description: 'Map processes, identify bottlenecks, and document current workflows.',
    },
    {
      icon: FileText,
      title: 'Blueprint',
      duration: '1 week',
      description: 'Define workflows, data model, interfaces, and integration points.',
    },
    {
      icon: Wrench,
      title: 'Build & Integrate',
      duration: '2–4 weeks',
      description: 'Automations + AI + ERP/CRM + database. Everything connected and tested.',
    },
    {
      icon: Rocket,
      title: 'Launch & Iterate',
      duration: 'Ongoing',
      description: 'Monitoring, improvements, documentation, and support.',
    },
  ]

  return (
    <section id="process" className="py-24 px-4 sm:px-6 lg:px-8 bg-off-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-2">
            Clear scope. Fast delivery. Measurable impact.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 w-full md:w-auto ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="inline-block w-full md:w-auto">
                    <div className="flex items-center gap-3 mb-2 md:justify-start">
                      {index % 2 === 0 && <div className="hidden md:block flex-1"></div>}
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <step.icon className="text-primary" size={24} />
                      </div>
                      {index % 2 !== 0 && <div className="hidden md:block flex-1"></div>}
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{step.duration}</p>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

