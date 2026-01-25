'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import InviteClientModal from './InviteClientModal'
import { useRouter } from 'next/navigation'

export default function InviteClientButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Invitar Cliente
      </button>
      <InviteClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
