'use client'

import Image from 'next/image'

interface MockImageProps {
  type: 'sara' | 'paternidad' | 'profit-loss' | 'bonvoyage' | 'solara'
  imageSrc?: string
}

export default function MockImage({ type, imageSrc }: MockImageProps) {
  if (imageSrc) {
    return (
      <div className="w-full h-full relative rounded-lg overflow-hidden bg-gray-100">
        <img 
          src={imageSrc} 
          alt="" 
          className="w-full h-full object-contain"
        />
      </div>
    )
  }

  switch (type) {
    case 'sara':
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4 border border-gray-200/60">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300/80 rounded w-3/4" />
                <div className="h-4 bg-gray-300/60 rounded w-1/2" />
              </div>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Pipeline: Contacto → Oportunidad → Orden → Factura</span>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="h-8 bg-blue-50 rounded border border-blue-100 flex items-center px-3">
              <div className="h-3 w-20 bg-blue-200 rounded" />
              <span className="ml-3 text-xs text-gray-600">Factura generada</span>
            </div>
          </div>
        </div>
      )
    case 'paternidad':
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4 border border-gray-200/60">
          <div className="space-y-3">
            <div className="h-3 bg-blue-500/80 rounded w-full" />
            <div className="h-3 bg-gray-300/70 rounded w-4/5" />
            <div className="h-3 bg-gray-200/60 rounded w-3/5" />
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="h-6 bg-gray-200/80 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300/70 rounded w-3/4 mb-2" />
            <div className="h-8 bg-blue-500 rounded w-1/3" />
          </div>
          <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
            SERP: Posición 1–3 · Tráfico orgánico
          </div>
        </div>
      )
    case 'profit-loss':
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4 border border-gray-200/60">
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded border border-blue-200/40" />
            <div className="h-16 bg-gradient-to-br from-green-100 to-green-50 rounded border border-green-200/40" />
            <div className="h-16 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded border border-yellow-200/40" />
            <div className="h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded border border-purple-200/40" />
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200/80 rounded w-full" />
              <div className="h-3 bg-gray-200/60 rounded w-5/6" />
              <div className="h-3 bg-gray-200/40 rounded w-4/6" />
            </div>
          </div>
        </div>
      )
    case 'bonvoyage':
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4 border border-gray-200/60">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-300/80 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200/80 rounded w-full" />
              <div className="h-3 bg-gray-200/60 rounded w-2/3" />
              <div className="h-3 bg-gray-200/40 rounded w-1/2" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Monto:</span>
                <span className="text-gray-700 font-medium">$45,000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Fecha:</span>
                <span className="text-gray-700 font-medium">15/12/2024</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Categoría:</span>
                <span className="text-gray-700 font-medium">Transporte</span>
              </div>
            </div>
          </div>
        </div>
      )
    case 'solara':
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4 border border-gray-200/60">
          <div className="h-12 bg-gray-200/80 rounded-lg" />
          <div className="space-y-3">
            <div className="h-6 bg-gray-300/70 rounded w-3/4" />
            <div className="h-4 bg-gray-200/60 rounded w-full" />
            <div className="h-4 bg-gray-200/50 rounded w-5/6" />
          </div>
          <div className="h-10 bg-blue-500 rounded-lg w-2/5" />
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 bg-gray-200/60 rounded" />
              <div className="h-8 bg-gray-200/60 rounded" />
              <div className="h-8 bg-gray-200/60 rounded" />
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}

