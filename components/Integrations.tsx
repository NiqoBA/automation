'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Settings, Plus } from 'lucide-react'
import Image from 'next/image'

interface Integration {
  name: string
  logo: string
  status: 'active' | 'configure'
  color: string
}

const integrations: Integration[] = [
  { name: 'Gmail', logo: '/imgs/logo-Gmail-1.png', status: 'active', color: '#EA4335' },
  { name: 'Google Drive', logo: '/imgs/Google_Drive_icon_(2020).svg.png', status: 'active', color: '#4285F4' },
  { name: 'Google Calendar', logo: '/imgs/Google-Calendar-Logo.png', status: 'active', color: '#34A853' },
  { name: 'Google Sheets', logo: '/imgs/Google_Sheets_logo_(2014-2020).svg.png', status: 'active', color: '#0F9D58' },
  { name: 'Slack', logo: '/imgs/Slack-logo.png', status: 'active', color: '#4A154B' },
  { name: 'WhatsApp', logo: '/imgs/WhatsApp.svg.webp', status: 'active', color: '#25D366' },
  { name: 'Salesforce', logo: '/imgs/Salesforce.com_logo.svg.png', status: 'configure', color: '#00A1E0' },
  { name: 'Notion', logo: '/imgs/notion_logo_icon_145025.png', status: 'active', color: '#000000' },
  { name: 'Stripe', logo: '/imgs/stripe.png', status: 'active', color: '#635BFF' },
  { name: 'Zoom', logo: '/imgs/logo-Zoom-2.png', status: 'active', color: '#2D8CFF' },
  { name: 'Microsoft Teams', logo: '/imgs/Microsoft_Office_Teams_(2025–present).svg.png', status: 'active', color: '#6264A7' },
  { name: 'Supabase', logo: '/imgs/supabase.webp', status: 'active', color: '#3ECF8E' },
]

export default function Integrations() {
  return (
    <section id="integrations" className="py-28 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title at the top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="mb-5">
            <span className="inline-block px-3.5 py-1.5 bg-black border border-white rounded-lg text-white text-[10px] font-medium uppercase tracking-wide">
              Integraciones
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
            Nos Integramos a tu Stack
          </h3>
        </motion.div>

        {/* Floating Integrations */}
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[280px] sm:h-[320px]"
          >
            {/* Integration Floating Layout */}
            <div className="relative w-full h-full">
                {integrations.map((integration, index) => {
                  // Nueva distribución más equilibrada y orgánica
                  const positions = [
                    { top: '5%', left: '10%' },
                    { top: '12%', left: '35%' },
                    { top: '8%', left: '60%' },
                    { top: '6%', left: '85%' },
                    { top: '28%', left: '5%' },
                    { top: '32%', left: '42%' },
                    { top: '30%', left: '75%' },
                    { top: '52%', left: '18%' },
                    { top: '55%', left: '58%' },
                    { top: '50%', left: '88%' },
                    { top: '75%', left: '12%' },
                    { top: '78%', left: '65%' },
                  ]
                  
                  const position = positions[index % positions.length]
                  const rotation = (index % 9 - 4) * 1.5 // Rotación más variada: -6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6 grados
                  
                  return (
                    <motion.div
                      key={integration.name}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      animate={{
                        y: [0, -10, 0],
                        rotate: [rotation - 2, rotation + 2, rotation - 2],
                      }}
                      transition={{
                        opacity: {
                          duration: 0.5,
                          delay: index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                          damping: 20
                        },
                        scale: {
                          duration: 0.5,
                          delay: index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                          damping: 20
                        },
                        y: {
                          duration: 3 + (index % 3),
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                        rotate: {
                          duration: 4 + (index % 2),
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }}
                      whileHover={{ scale: 1.15, zIndex: 20 }}
                      className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                      style={{
                        top: position.top,
                        left: position.left,
                        transform: `rotate(${rotation}deg)`,
                      }}
                    >
                      {/* Logo */}
                      <div 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden transition-all group-hover:shadow-lg ${
                          integration.name === 'Notion' || integration.name === 'Slack' 
                            ? 'bg-white' 
                            : ''
                        }`}
                        style={{ 
                          backgroundColor: integration.name === 'Notion' || integration.name === 'Slack' 
                            ? '#FFFFFF' 
                            : `${integration.color}15`,
                          boxShadow: integration.status === 'active' 
                            ? `0 0 12px ${integration.color}40` 
                            : '0 0 4px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <Image
                          src={integration.logo}
                          alt={integration.name}
                          width={40}
                          height={40}
                          className="object-contain w-full h-full p-1"
                          unoptimized
                        />
                      </div>

                      {/* App Name */}
                      <p className="text-white text-[9px] sm:text-[10px] font-medium whitespace-nowrap group-hover:text-purple-400 transition-colors">
                        {integration.name}
                      </p>

                      {/* Status Indicator */}
                      {integration.status === 'active' && (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-green-500"
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>

            {/* Badge showing "Y más" */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pt-4">
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-[10px] font-medium">
                Y más
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
