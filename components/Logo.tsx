'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: number
  className?: string
  animated?: boolean
  blur?: number
}

export default function Logo({ size = 40, className = '', animated = true, blur = 1 }: LogoProps) {
  const logoStyle = {
    aspectRatio: '1 / 1',
    background: 'linear-gradient(229deg, #df7afe 13%, rgba(201, 110, 240, 0) 35.0235827429153%, rgba(164, 92, 219, 0) 64.17244225559735%, rgb(129, 74, 200) 88%)',
    borderRadius: `${size * 0.894}px`, // 363/406 ratio
    flex: 'none',
    gap: '10px',
    height: `${size}px`,
    overflow: 'hidden',
    position: 'relative',
    width: `${size}px`,
    willChange: 'transform',
    opacity: 1,
    filter: `blur(${blur}px)`,
  }

  if (animated) {
    return (
      <motion.div
        className={className}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={logoStyle}
      />
    )
  }

  return <div className={className} style={logoStyle} />
}

