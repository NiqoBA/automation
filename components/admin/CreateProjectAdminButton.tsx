'use client'

import { useState } from 'react'
import { Briefcase } from 'lucide-react'
import CreateProjectAdminModal from './CreateProjectAdminModal'

export default function CreateProjectAdminButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all flex items-center gap-2"
      >
        <Briefcase className="w-4 h-4" />
        Crear Proyecto
      </button>
      <CreateProjectAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
