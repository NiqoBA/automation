'use client'

import { useTheme } from '@/contexts/ThemeContext'

const PLATFORMS = [
    { id: '', label: 'Todos los portales', color: 'violet' },
    { id: 'CasasYMas', label: 'CasasYMas', color: 'blue' },
    { id: 'InfoCasas', label: 'InfoCasas', color: 'orange' },
    { id: 'Mercado Libre', label: 'Mercado Libre', color: 'yellow' },
    { id: 'Gallito', label: 'Gallito', color: 'cyan' },
]

interface PlatformSelectorProps {
    selected: string
    onChange: (platform: string) => void
    counts?: Record<string, number>
}

export default function PlatformSelector({ selected, onChange, counts }: PlatformSelectorProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'

    const totalCount = counts
        ? Object.values(counts).reduce((a, b) => a + b, 0)
        : undefined

    const activeColors: Record<string, string> = {
        violet: 'bg-violet-600 text-white shadow-lg shadow-violet-500/25',
        blue: 'bg-blue-600 text-white shadow-lg shadow-blue-500/25',
        orange: 'bg-orange-600 text-white shadow-lg shadow-orange-500/25',
        yellow: 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25',
        cyan: 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25',
    }

    const inactiveStyle = isLight
        ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'

    return (
        <div className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-zinc-900/50 border-zinc-800'
        }`}>
            {PLATFORMS.map(p => {
                const isActive = selected === p.id
                const count = p.id ? counts?.[p.id] : totalCount

                return (
                    <button
                        key={p.id}
                        onClick={() => onChange(p.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive ? activeColors[p.color] : inactiveStyle
                        }`}
                    >
                        <span>{p.label}</span>
                        {count !== undefined && count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                isActive
                                    ? 'bg-white/20'
                                    : isLight ? 'bg-gray-200 text-gray-600' : 'bg-zinc-700 text-zinc-300'
                            }`}>
                                {count}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
