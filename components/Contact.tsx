'use client'

import { Mail, Linkedin, ArrowRight, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '' as 'automations' | 'consulting' | '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleServiceSelect = (service: 'automations' | 'consulting') => {
    setFormData(prev => ({ ...prev, service, message: '' }))
    if (errors.service) {
      setErrors(prev => ({ ...prev, service: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t('contact.errors.name')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.errors.emailRequired')
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('contact.errors.emailInvalid')
    }

    if (!formData.company.trim()) {
      newErrors.company = t('contact.errors.company')
    }

    if (!formData.service) {
      newErrors.service = t('contact.errors.service')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: '',
      })
    }, 3000)
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FBFBFB' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Invitational Text & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 tracking-tight">
                {t('contact.title')}
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-6">
              <a
                href="mailto:contacto@weautomate.com"
                className="flex items-center gap-3 text-gray-700 hover:text-teal-700 transition-colors group"
              >
                <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-teal-300 transition-colors">
                  <Mail size={18} className="text-gray-600 group-hover:text-teal-700" />
                </div>
                <span className="text-sm font-medium">contacto@weautomate.com</span>
              </a>
              <a
                href="https://linkedin.com/company/weautomate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-teal-700 transition-colors group"
              >
                <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-teal-300 transition-colors">
                  <Linkedin size={18} className="text-gray-600 group-hover:text-teal-700" />
                </div>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>

            {/* Trust Statement */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 italic leading-relaxed">
                {t('contact.trustStatement')}
              </p>
            </div>
          </motion.div>

          {/* Right: Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                      <CheckCircle size={32} className="text-teal-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-2">
                      {t('contact.success.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('contact.success.message')}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.fields.name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          errors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                        placeholder={t('contact.placeholders.name')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.fields.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          errors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                        placeholder={t('contact.placeholders.email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.fields.company')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          errors.company
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                        placeholder={t('contact.placeholders.company')}
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.fields.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
                        placeholder={t('contact.placeholders.phone')}
                      />
                    </div>

                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t('contact.fields.service')} <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleServiceSelect('automations')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            formData.service === 'automations'
                              ? 'border-teal-600 bg-teal-50 text-teal-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {t('contact.services.automations')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleServiceSelect('consulting')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            formData.service === 'consulting'
                              ? 'border-teal-600 bg-teal-50 text-teal-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {t('contact.services.consulting')}
                        </button>
                      </div>
                      {errors.service && (
                        <p className="mt-1 text-sm text-red-600">{errors.service}</p>
                      )}
                    </div>

                    {/* Conditional Message Field */}
                    <AnimatePresence>
                      {formData.service === 'automations' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('contact.fields.message')}
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors resize-none"
                            placeholder={t('contact.placeholders.message')}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(to right, #0f766e, #0c4a6e)',
                      }}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{t('contact.submitting')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('contact.submit')}</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

