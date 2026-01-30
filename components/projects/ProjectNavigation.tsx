'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { Home, FileText, History, MessageSquare, Bell, Users, Share2 } from 'lucide-react'

interface ProjectNavigationProps {
    projectId: string
    projectName: string
    userRole: string
}

export default function ProjectNavigation({ projectId, projectName, userRole }: ProjectNavigationProps) {
    const pathname = usePathname()
    const { theme } = useTheme()
    const isLight = theme === 'light'

    const basePath = `/dashboard/projects/${projectId}`

    const navItems = [
        { href: `${basePath}`, label: 'Resumen', icon: Home, exact: true },
        { href: `${basePath}/properties`, label: 'Propiedades', icon: FileText },
        { href: `${basePath}/logs`, label: 'Logs', icon: History },
        { href: `${basePath}/tickets`, label: 'Tickets', icon: MessageSquare },
        { href: `${basePath}/updates`, label: 'Actualizaciones', icon: Bell },
    ]

    // Solo master admin puede ver la sección de miembros
    if (userRole === 'master_admin') {
        navItems.push({ href: `${basePath}/members`, label: 'Compartir', icon: Share2 })
    }

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href
        return pathname.startsWith(href)
    }

    return (
        <div className={`border-b mb-6 ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-zinc-100'}`}>
                        {projectName}
                    </h1>
                </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto pb-px -mb-px">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href, item.exact)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
                ${active
                                    ? isLight
                                        ? 'bg-violet-50 text-violet-700 border-b-2 border-violet-600'
                                        : 'bg-violet-500/10 text-violet-400 border-b-2 border-violet-500'
                                    : isLight
                                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                                }`}
                        >
                            <Icon size={16} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
