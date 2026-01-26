import { requireMasterAdmin } from '@/lib/auth/guards'
import { getContactSubmissions } from '@/app/actions/contact'
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable'

export default async function ContactPage() {
  await requireMasterAdmin()

  const submissions = await getContactSubmissions()

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Contacto</h1>
        <p className="text-zinc-400 mt-1">
          Envíos del formulario de contacto de la landing
        </p>
      </div>

      <ContactSubmissionsTable submissions={submissions} />
    </div>
  )
}
