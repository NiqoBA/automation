'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { Home, FileText, History, MessageSquare, Bell, Share2, ChevronLeft, Loader2 } from 'lucide-react'
import { getProjectDashboard } from '@/app/actions/project-actions'

interface ProjectSidebarProps {
    projectId: string
    userRole: string
    leftOffset: number
}

type TabType = 'overview' | 'properties' | 'logs' | 'tickets' | 'updates' | 'members'

export default function ProjectSidebar({ projectId, userRole, leftOffset }: ProjectSidebarProps) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeTab = (searchParams.get('tab') as TabType) || 'overview'

    const [projectName, setProjectName] = useState('Cargando...')

    useEffect(() => {
        const loadProject = async () => {
            const result = await getProjectDashboard(projectId)
            if (result.data?.project?.name) {
                setProjectName(result.data.project.name)
            }
        }
        loadProject()
    }, [projectId])

    const tabs = [
        { id: 'overview' as TabType, label: 'Resumen', icon: Home },
        { id: 'properties' as TabType, label: 'Propiedades', icon: FileText },
        { id: 'logs' as TabType, label: 'Logs', icon: History },
        { id: 'tickets' as TabType, label: 'Tickets', icon: MessageSquare },
        { id: 'updates' as TabType, label: 'Actualizaciones', icon: Bell },
    ]

    if (userRole === 'master_admin') {
        tabs.push({ id: 'members' as TabType, label: 'Compartir', icon: Share2 })
    }

    const handleTabChange = (tabId: TabType) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tabId)
        router.push(`?${params.toString()}`)
    }

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('focusProject')
        params.delete('tab')
        router.push(`?${params.toString()}`)
    }

    const sidebarBg = isLight ? 'bg-white border-gray-200' : 'bg-zinc-900 border-zinc-800'
    const textPrimary = isLight ? 'text-gray-900' : 'text-zinc-100'
    const textSecondary = isLight ? 'text-gray-500' : 'text-zinc-400'

    return (
        <aside
            className={`fixed inset-y-0 hidden md:flex flex-col w-56 border-r transition-all duration-300 z-20 ${sidebarBg}`}
            style={{ left: `${leftOffset}px` }}
        >
            {/* Header with back button */}
            <div className={`flex items-center gap-2 p-4 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                <button
                    onClick={handleClose}
                    className={`p-1.5 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-zinc-800 text-zinc-400'}`}
                    title="Volver a proyectos"
                >
                    <ChevronLeft size={18} />
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className={`text-xs font-bold truncate uppercase tracking-wider ${textSecondary}`}>
                        {projectName}
                    </h2>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? isLight
                                        ? 'bg-violet-50 text-violet-600 border border-violet-200'
                                        : 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-400 border border-violet-500/20'
                                    : isLight
                                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}
