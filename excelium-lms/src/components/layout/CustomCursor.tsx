'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only on pointer-fine devices
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.body.classList.add('has-custom-cursor')

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`
        dotRef.current.style.top = `${mouseY}px`
      }
      ringX += (mouseX - ringX) * 0.10
      ringY += (mouseY - ringY) * 0.10
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }
      rafId = requestAnimationFrame(animate)
    }

    // Hover effects on interactive elements
    const interactives = document.querySelectorAll('a, button, [role="button"], label')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dotRef.current?.classList.add('!w-14', '!h-14', '!bg-gold/20')
        ringRef.current?.classList.add('!w-20', '!h-20', '!border-gold')
      })
      el.addEventListener('mouseleave', () => {
        dotRef.current?.classList.remove('!w-14', '!h-14', '!bg-gold/20')
        ringRef.current?.classList.remove('!w-20', '!h-20', '!border-gold')
      })
    })

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <div className="scroll-progress-bar" />
    </>
  )
}
