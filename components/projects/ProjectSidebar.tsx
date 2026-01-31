'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { Home, FileText, Building2, History, MessageSquare, Bell, Share2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { getProjectDashboard } from '@/app/actions/project-actions'

interface ProjectSidebarProps {
    projectId: string
    userRole: string
    leftOffset: number
    collapsed?: boolean
    onCollapse?: (collapsed: boolean) => void
}

type TabType = 'overview' | 'properties' | 'inmobiliarias' | 'logs' | 'tickets' | 'updates' | 'members'

export default function ProjectSidebar({ projectId, userRole, leftOffset, collapsed = false, onCollapse }: ProjectSidebarProps) {
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
        { id: 'inmobiliarias' as TabType, label: 'Inmobiliarias', icon: Building2 },
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

    const toggleCollapse = () => {
        const newState = !collapsed
        if (typeof window !== 'undefined') {
            localStorage.setItem('projectSidebarCollapsed', String(newState))
        }
        onCollapse?.(newState)
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
            className={`fixed inset-y-0 hidden md:flex flex-col border-r transition-all duration-300 z-20 ${sidebarBg}`}
            style={{
                left: `${leftOffset}px`,
                width: collapsed ? '64px' : '224px'
            }}
        >
            {/* Header with back button */}
            <div className={`flex items-center gap-2 p-4 border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                {!collapsed && (
                    <>
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
                    </>
                )}
                {collapsed && (
                    <div className="w-full flex justify-center">
                        <button
                            onClick={handleClose}
                            className={`p-1.5 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-zinc-800 text-zinc-400'}`}
                            title="Volver a proyectos"
                        >
                            <Home size={18} />
                        </button>
                    </div>
                )}
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
                            title={collapsed ? tab.label : undefined}
                            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2 px-3'} py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? isLight
                                    ? 'bg-violet-50 text-violet-600 border border-violet-200'
                                    : 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-400 border border-violet-500/20'
                                : isLight
                                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                                }`}
                        >
                            <Icon size={16} />
                            {!collapsed && tab.label}
                        </button>
                    )
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className={`px-2 py-2 border-t transition-colors duration-200 ${isLight ? 'border-gray-200' : 'border-zinc-800'}`}>
                <button
                    onClick={toggleCollapse}
                    className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-zinc-800 text-zinc-400'}`}
                    title={collapsed ? 'Expandir' : 'Colapsar'}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>
        </aside>
    )
}
