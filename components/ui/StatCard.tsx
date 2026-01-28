'use client'

import * as Icons from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export default function StatCard({
  title,
  value,
  icon: iconName,
  trend,
  description,
}: StatCardProps) {
  const { theme } = useTheme()
  const IconComponent = (Icons as any)[iconName] as React.ComponentType<{ className?: string }>
  
  return (
    <div className={`rounded-xl p-6 transition-colors ${
      theme === 'light'
        ? 'bg-white border border-gray-200 hover:border-gray-300'
        : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600/20 to-purple-600/20">
          {IconComponent && <IconComponent className="w-5 h-5 text-violet-400" />}
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive 
                ? theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'
                : theme === 'light' ? 'text-red-600' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className={`text-sm mb-1 ${
          theme === 'light' ? 'text-gray-600' : 'text-zinc-400'
        }`}>{title}</p>
        <p className={`text-2xl font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-zinc-100'
        }`}>{value}</p>
        {description && (
          <p className={`text-xs mt-2 ${
            theme === 'light' ? 'text-gray-500' : 'text-zinc-500'
          }`}>{description}</p>
        )}
      </div>
    </div>
  )
}
