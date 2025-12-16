'use client'

export default function WaveDivider() {
  return (
    <div className="relative w-full h-32 overflow-hidden -mt-1">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,80 C240,20 480,20 720,60 C960,100 1200,100 1440,60 L1440,120 L0,120 Z"
          fill="#ffffff"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,90 C180,50 360,50 540,70 C720,90 900,90 1080,80 C1260,70 1440,70 1440,70 L1440,120 L0,120 Z"
          fill="#fafafa"
          opacity="0.8"
        />
      </svg>
    </div>
  )
}

