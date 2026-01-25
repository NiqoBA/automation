import DashboardLayoutClient from './DashboardLayoutClient'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
  user: {
    name: string
    email: string
    role: string
  }
}

// Server Component wrapper que pasa props al Client Component
export default function DashboardLayout({
  children,
  navItems,
  user,
}: DashboardLayoutProps) {
  return (
    <DashboardLayoutClient navItems={navItems} user={user}>
      {children}
    </DashboardLayoutClient>
  )
}
