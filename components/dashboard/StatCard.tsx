import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-violet-600/20 to-purple-600/20">
          <Icon className="w-5 h-5 text-violet-400" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-zinc-100 mb-1">{value}</p>
        <p className="text-sm text-zinc-400 mb-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-zinc-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
