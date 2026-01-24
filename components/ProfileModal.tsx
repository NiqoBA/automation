'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProfileModal() {
  const { user, updateUser, needsProfileCompletion } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    age: '',
  })

  useEffect(() => {
    if (needsProfileCompletion) {
      setIsOpen(true)
      // Prellenar con datos existentes si los hay
      setFormData({
        name: user?.name || '',
        age: user?.age?.toString() || '',
      })
    }
  }, [needsProfileCompletion, user])

  const validateForm = () => {
    const newErrors = {
      name: '',
      age: '',
    }

    if (!formData.name.trim()) {
      newErrors.name = t('profile.errors.nameRequired')
    }

    if (!formData.age.trim()) {
      newErrors.age = t('profile.errors.ageRequired')
    } else {
      const ageNum = parseInt(formData.age, 10)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
        newErrors.age = t('profile.errors.ageInvalid')
      }
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.age
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    updateUser({
      name: formData.name.trim(),
      age: parseInt(formData.age, 10),
    })

    setIsOpen(false)
    setErrors({ name: '', age: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  if (!isOpen) return null

  // Prevenir cierre del modal hasta que se completen los datos
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && (!formData.name.trim() || !formData.age.trim())) {
      // No permitir cerrar haciendo clic fuera si no hay datos completos
      return
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('profile.title')}
            </h2>
          </div>
          <button
            onClick={() => {
              // No permitir cerrar sin completar
              if (!formData.name.trim() || !formData.age.trim()) {
                return
              }
              setIsOpen(false)
            }}
            className={`p-2 rounded-lg transition-colors ${
              !formData.name.trim() || !formData.age.trim()
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-100'
            }`}
            disabled={!formData.name.trim() || !formData.age.trim()}
            aria-label="Close"
          >
            <X className={`w-5 h-5 ${
              !formData.name.trim() || !formData.age.trim()
                ? 'text-gray-400'
                : 'text-gray-500'
            }`} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            {t('profile.subtitle')}
          </p>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.fields.name')} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('profile.placeholders.name')}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Age Field */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.fields.age')} *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="150"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('profile.placeholders.age')}
              required
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {t('profile.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

