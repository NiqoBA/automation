'use client'

import Image from 'next/image'

export default function Clients() {
  return (
    <section className="bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h3 className="text-base text-white mb-6 tracking-wider">
            Empresas que confían en nosotros
          </h3>
          <div className="flex items-center justify-center gap-16">
            <div className="relative h-14 w-40 flex items-center justify-center">
              <Image
                src="/imgs/logo-web-southgenetics.svg"
                alt="SouthGenetics"
                width={160}
                height={56}
                className="h-14 w-auto max-w-[160px] object-contain filter brightness-0 invert"
              />
            </div>
            <div className="relative h-14 w-40 flex items-center justify-center">
              <Image
                src="/imgs/alternativas-sustentables-logo.svg"
                alt="Alternativas Sustentables"
                width={160}
                height={56}
                className="h-14 w-auto max-w-[160px] object-contain filter brightness-0 invert"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

