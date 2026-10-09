'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function getLenis() {
  return lenisInstance
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    lenisInstance = lenis

    // Scroll progress bar
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      document.documentElement.style.setProperty('--scroll-progress', String(progress))
    })

    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return <>{children}</>
}
