import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: StatCardProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600/20 to-purple-600/20">
          <Icon className="w-5 h-5 text-violet-400" />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-zinc-400 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-zinc-100">{value}</p>
        {description && (
          <p className="text-xs text-zinc-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  )
}
