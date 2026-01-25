import { requireProfile } from '@/lib/auth/guards'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { profile } = await requireProfile()

  // Redirect según rol
  if (profile.role === 'master_admin') {
    redirect('/dashboard/admin')
  } else {
    redirect('/dashboard/org')
  }
}
