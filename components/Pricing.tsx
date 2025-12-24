'use client'

import { Check } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Build Sprint',
      type: 'one-time',
      startingAt: '$15,000',
      description: 'Perfect for defined automation projects',
      features: [
        'Process audit & blueprint',
        'Custom automation development',
        'ERP/CRM integration',
        'Database + admin interface',
        'Testing & documentation',
        '2 weeks of post-launch support',
      ],
    },
    {
      name: 'Build + Care',
      type: 'monthly',
      startingAt: '$5,000/mo',
      description: 'Ongoing development + maintenance',
      features: [
        'Everything in Build Sprint',
        'Monthly feature development',
        'System monitoring & maintenance',
        'Priority support',
        'Regular optimization',
        'Unlimited iterations',
      ],
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple, transparent engagement models
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 border-2 ${
                index === 1 ? 'border-primary shadow-lg' : 'border-gray-200'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-black mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.type}</p>
                <div className="text-3xl font-bold text-primary mb-2">{plan.startingAt}</div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="text-primary mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  const contact = document.querySelector('#contact')
                  contact?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  index === 1
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-600">
          Performance-based options available for qualified workflows.
        </p>
      </div>
    </section>
  )
}




