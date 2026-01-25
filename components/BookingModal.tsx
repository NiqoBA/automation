'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function BookingModal() {
  const [formData, setFormData] = useState({
    type: 'demo',
    name: '',
    email: '',
    company: '',
    automation: '',
    stack: '',
  })

  useEffect(() => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (!modal) return

    const handleShow = () => {
      const type = modal.getAttribute('data-type') || 'demo'
      setFormData((prev) => ({ ...prev, type }))
    }

    modal.addEventListener('show', handleShow)
    return () => modal.removeEventListener('show', handleShow)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.close()
    }
    
    // Reset form
    setFormData({
      type: 'demo',
      name: '',
      email: '',
      company: '',
      automation: '',
      stack: '',
    })
    
    alert('Thank you! We\'ll be in touch soon.')
  }

  const closeModal = () => {
    const modal = document.getElementById('booking-modal') as HTMLDialogElement
    if (modal) {
      modal.close()
    }
  }

  const getTitle = () => 'Book a Demo'

  return (
    <dialog
      id="booking-modal"
      className="rounded-lg p-0 max-w-lg w-full mx-auto border border-gray-200 shadow-xl"
    >
      <div className="p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-black">{getTitle()}</h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
            />
          </div>

          {formData.type === 'demo' && (
            <div>
              <label htmlFor="automation" className="block text-sm font-medium text-gray-700 mb-1">
                What are you trying to automate? *
              </label>
              <textarea
                id="automation"
                name="automation"
                rows={3}
                required
                value={formData.automation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent resize-none"
                placeholder="Describe the workflow or process you want to automate..."
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors font-medium"
          >
            {formData.type === 'demo' ? 'Request Demo' : 'Request Booking'}
          </button>
        </form>
      </div>
    </dialog>
  )
}




