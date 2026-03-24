'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { getProjectDashboard } from '@/app/actions/project-actions'
import { Loader2 } from 'lucide-react'
import OverviewView from './views/OverviewView'
import PropertiesView from './views/PropertiesView'
import InmobiliariasView from './views/InmobiliariasView'
import LogsView from './views/LogsView'
import TicketsView from './views/TicketsView'
import UpdatesView from './views/UpdatesView'
import MembersView from './views/MembersView'

interface ProjectFocusedViewProps {
    projectId: string
    projectData: any | null
    userRole: string
}

type TabType = 'overview' | 'properties' | 'inmobiliarias' | 'logs' | 'tickets' | 'updates' | 'members'

export default function ProjectFocusedView({ projectId, projectData: serverData, userRole }: ProjectFocusedViewProps) {
    const searchParams = useSearchParams()
    const activeTab = (searchParams.get('tab') as TabType) || 'overview'
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [selectedPlatform, setSelectedPlatform] = useState('')
    const [dashboardData, setDashboardData] = useState<any | null>(serverData)
    const [loadingDashboard, setLoadingDashboard] = useState(false)

    useEffect(() => {
        if (serverData) {
            setDashboardData(serverData)
            return
        }
        if (activeTab !== 'overview') return
        if (dashboardData) return

        setLoadingDashboard(true)
        getProjectDashboard(projectId).then((result) => {
            if (result.data) setDashboardData(result.data)
            setLoadingDashboard(false)
        })
    }, [activeTab, projectId, serverData])

    return (
        <div className="w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'overview' && (
                dashboardData ? (
                    <OverviewView
                        projectId={projectId}
                        stats={dashboardData.stats}
                        topAgencies={dashboardData.topAgencies}
                        platformStats={dashboardData.platformStats ?? []}
                        newAgencies={dashboardData.newAgencies ?? []}
                        monthlyStats={dashboardData.monthlyStats ?? []}
                        project={dashboardData.project}
                        userRole={userRole}
                        selectedPlatform={selectedPlatform}
                        onPlatformChange={setSelectedPlatform}
                    />
                ) : (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                    </div>
                )
            )}
            {activeTab === 'properties' && (
                <PropertiesView
                    projectId={projectId}
                    selectedPlatform={selectedPlatform}
                    onPlatformChange={setSelectedPlatform}
                />
            )}
            {activeTab === 'inmobiliarias' && (
                <InmobiliariasView
                    projectId={projectId}
                    selectedPlatform={selectedPlatform}
                    onPlatformChange={setSelectedPlatform}
                />
            )}
            {activeTab === 'logs' && (
                <LogsView projectId={projectId} />
            )}
            {activeTab === 'tickets' && (
                <TicketsView projectId={projectId} />
            )}
            {activeTab === 'updates' && (
                <UpdatesView projectId={projectId} userRole={userRole} />
            )}
            {activeTab === 'members' && userRole === 'master_admin' && (
                <MembersView projectId={projectId} />
            )}
        </div>
    )
}
