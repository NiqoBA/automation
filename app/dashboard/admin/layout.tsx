import { requireMasterAdmin } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { getMasterAdminStats, getInvitations } from '@/app/actions/master-admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const result = await requireMasterAdmin()
  
  if (!result || !result.user) {
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
  }
  
  const profile = result.user

  const supabase = createClient()

  // Obtener stats para badges
  const stats = await getMasterAdminStats()
  const invitations = await getInvitations()
  const pendingInvitations = invitations.filter(
    (inv) => inv.status === 'pending' && new Date(inv.expires_at) > new Date()
  ).length

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard/admin',
      icon: 'LayoutDashboard',
    },
    {
      label: 'Clientes',
      href: '/dashboard/admin/clients',
      icon: 'Users',
      badge: stats.totalClients,
    },
    {
      label: 'Invitaciones',
      href: '/dashboard/admin/invitations',
      icon: 'Mail',
      badge: pendingInvitations,
    },
    {
      label: 'Facturación',
      href: '/dashboard/admin/billing',
      icon: 'CreditCard',
    },
  ]

  return (
    <DashboardLayout
      navItems={navItems}
      user={{
        name: profile.full_name,
        email: profile.email,
        role: profile.role,
      }}
    >
      {children}
    </DashboardLayout>
  )
}
