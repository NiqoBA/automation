import { redirect } from 'next/navigation'
import { getProjectDashboard } from '@/app/actions/project-actions'
import ProjectNavigation from '@/components/projects/ProjectNavigation'

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { projectId: string }
}) {
    const result = await getProjectDashboard(params.projectId)

    if (result.error || !result.data) {
        redirect('/dashboard')
    }

    const { project, userRole } = result.data

    return (
        <div className="min-w-0 max-w-full">
            <ProjectNavigation
                projectId={params.projectId}
                projectName={project?.name || 'Proyecto'}
                userRole={userRole}
            />
            {children}
        </div>
    )
}
