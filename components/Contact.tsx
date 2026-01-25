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
    service: 'automations' as 'automations' | '',
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

  const handleServiceSelect = (service: 'automations') => {
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
        service: 'automations',
        message: '',
      })
    }, 3000)
  }

  return (
    <section id="contact" className="py-28 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Badge centered */}
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1.5 bg-black border border-white rounded-lg text-white text-[10px] font-medium uppercase tracking-wide">
            Contacto
          </span>
        </div>
        
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4 tracking-tight">
                {t('contact.title')}
              </h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-6">
              <a
                href="mailto:nicovilaviviano@gmail.com"
                className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors group"
              >
                <div className="p-2 bg-[#0a0a0a] rounded-lg border border-white/10 group-hover:border-purple-500/50 transition-colors">
                  <Mail size={18} className="text-gray-400 group-hover:text-purple-400" />
                </div>
                <span className="text-sm font-medium">nicovilaviviano@gmail.com</span>
              </a>
              <a
                href="https://linkedin.com/company/weautomate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors group"
              >
                <div className="p-2 bg-[#0a0a0a] rounded-lg border border-white/10 group-hover:border-purple-500/50 transition-colors">
                  <Linkedin size={18} className="text-gray-400 group-hover:text-purple-400" />
                </div>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>

            {/* Trust Statement */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 italic leading-relaxed">
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
            <div className="bg-[#0a0a0a] rounded-2xl shadow-xl p-8 sm:p-10 border border-white/10">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4 border border-purple-500/30">
                      <CheckCircle size={32} className="text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {t('contact.success.title')}
                    </h3>
                    <p className="text-gray-400">
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
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('contact.fields.name')} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border bg-[#0d0d0d] text-white placeholder-gray-500 transition-colors ${
                          errors.name
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
                            : 'border-white/10 focus:border-purple-500 focus:ring-purple-500'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                        placeholder={t('contact.placeholders.name')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('contact.fields.email')} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border bg-[#0d0d0d] text-white placeholder-gray-500 transition-colors ${
                          errors.email
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
                            : 'border-white/10 focus:border-purple-500 focus:ring-purple-500'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                        placeholder={t('contact.placeholders.email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('contact.fields.company')} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border bg-[#0d0d0d] text-white placeholder-gray-500 transition-colors ${
                          errors.company
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
                            : 'border-white/10 focus:border-purple-500 focus:ring-purple-500'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                        placeholder={t('contact.placeholders.company')}
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('contact.fields.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
                        placeholder={t('contact.placeholders.phone')}
                      />
                    </div>

                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        {t('contact.fields.service')} <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleServiceSelect('automations')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            formData.service === 'automations'
                              ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                              : 'border-white/10 bg-[#0d0d0d] text-gray-300 hover:border-white/20'
                          }`}
                        >
                          {t('contact.services.automations')}
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
                          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                            {t('contact.fields.message')}
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0d0d0d] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors resize-none"
                            placeholder={t('contact.placeholders.message')}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
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



