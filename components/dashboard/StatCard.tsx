'use client'

import { useTheme } from '@/contexts/ThemeContext'
import * as Icons from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: string // Cambiar a string en lugar de LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: iconName,
  trend,
}: StatCardProps) {
  const { theme } = useTheme()
  
  // Obtener el componente del icono dinámicamente
  const IconComponent = (Icons as any)[iconName] as React.ComponentType<{ className?: string }>
  
  return (
    <div className={`rounded-xl p-6 transition-colors ${
      theme === 'light'
        ? 'bg-white border border-gray-200 hover:border-gray-300'
        : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-r from-violet-600/20 to-purple-600/20`}>
          {IconComponent && <IconComponent className="w-5 h-5 text-violet-400" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive 
              ? theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'
              : theme === 'light' ? 'text-red-600' : 'text-red-400'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className={`text-3xl font-bold mb-1 ${
          theme === 'light' ? 'text-gray-900' : 'text-zinc-100'
        }`}>{value}</p>
        <p className={`text-sm mb-1 ${
          theme === 'light' ? 'text-gray-600' : 'text-zinc-400'
        }`}>{title}</p>
        {subtitle && (
          <p className={`text-xs ${
            theme === 'light' ? 'text-gray-500' : 'text-zinc-500'
          }`}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}
