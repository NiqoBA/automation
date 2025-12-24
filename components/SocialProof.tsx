'use client'

export default function SocialProof() {
  const clients = ['ClientOne', 'ClientTwo', 'ClientThree', 'ClientFour', 'ClientFive']
  
  const stats = [
    { label: 'Weeks to ship, not months', value: '2-4' },
    { label: 'Reduced manual admin work', value: '60-80%' },
    { label: 'Fewer errors, better visibility', value: '95%+' },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Client Logos */}
        <div className="mb-12">
          <p className="text-sm text-gray-500 text-center mb-6">Trusted by forward-thinking companies</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale">
            {clients.map((client, index) => (
              <div
                key={index}
                className="text-2xl font-semibold text-gray-400"
              >
                {client}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




