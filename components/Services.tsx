'use client'

import { Brain, Workflow, Database } from 'lucide-react'

export default function Services() {
  const services = [
    {
      icon: Brain,
      title: 'AI Process Integration',
      description: 'Embed AI into your workflows: triage, classification, drafting, routing, decision support.',
    },
    {
      icon: Workflow,
      title: 'Workflow Automation',
      description: 'n8n / APIs / event-driven automations that eliminate repetitive steps.',
    },
    {
      icon: Database,
      title: 'System Building',
      description: 'Databases + dashboards + internal tools: stable, structured, maintainable.',
    },
  ]

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-off-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">What We Do</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-700 font-medium">
          We don't sell prototypes. We build operational systems.
        </p>
      </div>
    </section>
  )
}


