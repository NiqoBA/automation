'use client'

import { useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import OverviewView from './views/OverviewView'
import PropertiesView from './views/PropertiesView'
import InmobiliariasView from './views/InmobiliariasView'
import LogsView from './views/LogsView'
import TicketsView from './views/TicketsView'
import UpdatesView from './views/UpdatesView'
import MembersView from './views/MembersView'

interface ProjectFocusedViewProps {
    projectId: string
    projectData: any
    userRole: string
}

type TabType = 'overview' | 'properties' | 'inmobiliarias' | 'logs' | 'tickets' | 'updates' | 'members'

export default function ProjectFocusedView({ projectId, projectData, userRole }: ProjectFocusedViewProps) {
    const searchParams = useSearchParams()
    const activeTab = (searchParams.get('tab') as TabType) || 'overview'
    const { theme } = useTheme()
    const isLight = theme === 'light'

    return (
        <div className="w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'overview' && (
                <OverviewView
                    projectId={projectId}
                    stats={projectData.stats}
                    topAgencies={projectData.topAgencies}
                    project={projectData.project}
                    userRole={userRole}
                />
            )}
            {activeTab === 'properties' && (
                <PropertiesView projectId={projectId} />
            )}
            {activeTab === 'inmobiliarias' && (
                <InmobiliariasView
                    projectId={projectId}
                    allAgencies={projectData.allAgencies ?? []}
                />
            )}
            {activeTab === 'logs' && (
                <LogsView projectId={projectId} />
            )}
            {activeTab === 'tickets' && (
                <TicketsView projectId={projectId} />
            )}
            {activeTab === 'updates' && (
                <UpdatesView projectId={projectId} />
            )}
            {activeTab === 'members' && userRole === 'master_admin' && (
                <MembersView projectId={projectId} />
            )}
        </div>
    )
}
