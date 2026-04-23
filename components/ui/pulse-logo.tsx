'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PulseLogoProps {
  className?: string
  size?: number
}

export default function PulseLogo({ className, size = 240 }: PulseLogoProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-[#1D4ED8]/10 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Pulsing Logo */}
        <div className="relative animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110">
          <Image 
            src="/inkata-logo.png" 
            alt="Inkata. Logo" 
            width={size * 3} 
            height={size} 
            className="w-auto object-contain"
            style={{ height: size }}
          />
        </div>
      </div>
      
      {/* Optional: Subtle Progress Indication */}
      <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#1D4ED8]/40 animate-[loading_1.5s_ease-in-out_infinite] origin-left"></div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: scaleX(0); margin-left: 0; }
          50% { transform: scaleX(0.5); margin-left: 25%; }
          100% { transform: scaleX(0); margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
