'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

/* ── Hero 3D Widget (Native Three.js - 100% React 18 & 19 Compatible) ─────── */

export function Hero3DWidget() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const width = container.clientWidth || 450
    const height = container.clientHeight || 450

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xfff8eb, 2.0)
    dirLight.position.set(5, 8, 5)
    dirLight.castShadow = true
    scene.add(dirLight)

    const goldPoint = new THREE.PointLight(0xc9a24b, 1.4, 12)
    goldPoint.position.set(-3, 2, 2.5)
    scene.add(goldPoint)

    const fillPoint = new THREE.PointLight(0x0a1f44, 0.8, 12)
    fillPoint.position.set(3, -2, 3)
    scene.add(fillPoint)

    // 3. Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a24b,
      metalness: 0.90,
      roughness: 0.16,
    })

    const chartMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0782e,
      metalness: 0.65,
      roughness: 0.22,
      transparent: true,
      opacity: 0.92,
    })

    const certPaperMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
    })

    const certSealMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a24b,
      metalness: 0.95,
      roughness: 0.12,
    })

    // 4. World Group for smooth Parallax
    const worldGroup = new THREE.Group()
    scene.add(worldGroup)

    // ── 4A. Gold Coins Stack & Float ──
    const coins: { mesh: THREE.Mesh; basePosY: number; speed: number; rotSpeed: number; offset: number }[] = []
    const coinGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.07, 36)

    const coinConfigs = [
      { x: 1.15, y: -0.35, z: 0.2, speed: 0.9, offset: 0 },
      { x: 1.15, y: -0.20, z: 0.2, speed: 0.8, offset: 0.4 },
      { x: 1.15, y: -0.05, z: 0.2, speed: 1.0, offset: 0.8 },
      { x: 1.15, y: 0.10, z: 0.2, speed: 0.7, offset: 1.2 },
      { x: 1.40, y: -0.15, z: 0.6, speed: 1.1, offset: 1.6 },
    ]

    coinConfigs.forEach((cfg) => {
      const coin = new THREE.Mesh(coinGeom, goldMaterial)
      coin.position.set(cfg.x, cfg.y, cfg.z)
      coin.castShadow = true
      worldGroup.add(coin)
      coins.push({
        mesh: coin,
        basePosY: cfg.y,
        speed: cfg.speed,
        rotSpeed: 0.8 + Math.random() * 0.4,
        offset: cfg.offset,
      })
    })

    // ── 4B. Rising Financial Bar Chart ──
    const barHeights = [0.7, 1.1, 0.6, 1.5, 0.9]
    const barXPositions = [-1.45, -1.15, -0.85, -0.55, -0.25]
    const bars: { mesh: THREE.Mesh; targetScaleY: number }[] = []

    barHeights.forEach((h, idx) => {
      const geom = new THREE.BoxGeometry(0.22, h, 0.22)
      geom.translate(0, h / 2, 0)
      const bar = new THREE.Mesh(geom, chartMaterial)
      bar.position.set(barXPositions[idx], -0.9, 0.1)
      bar.scale.set(1, 0.01, 1)
      bar.castShadow = true
      worldGroup.add(bar)
      bars.push({ mesh: bar, targetScaleY: 1 })
    })

    // ── 4C. Floating Certificate Seal ──
    const certGroup = new THREE.Group()
    certGroup.position.set(-0.25, 0.75, -0.2)

    const paper = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.9, 0.03), certPaperMaterial)
    certGroup.add(paper)

    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.3, 0.9, 0.03))
    const lineMat = new THREE.LineBasicMaterial({ color: 0xc9a24b })
    const line = new THREE.LineSegments(edges, lineMat)
    certGroup.add(line)

    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 32), certSealMaterial)
    seal.rotation.x = Math.PI / 2
    seal.position.set(0.35, -0.2, 0.025)
    certGroup.add(seal)

    worldGroup.add(certGroup)

    // 5. Mouse Parallax logic
    let targetRotX = 0
    let targetRotY = 0
    let currentRotX = 0
    let currentRotY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      targetRotY = x * 0.35
      targetRotX = -y * 0.25
    }

    container.addEventListener('mousemove', handleMouseMove)

    // 6. Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse lerp
      currentRotX += (targetRotX - currentRotX) * 0.05
      currentRotY += (targetRotY - currentRotY) * 0.05
      worldGroup.rotation.x = currentRotX
      worldGroup.rotation.y = currentRotY

      // Coins floating & rotating
      coins.forEach((c) => {
        c.mesh.rotation.y += c.rotSpeed * 0.015
        c.mesh.position.y = c.basePosY + Math.sin(elapsedTime * c.speed + c.offset) * 0.08
      })

      // Rising bars growth animation
      bars.forEach((b) => {
        if (b.mesh.scale.y < b.targetScaleY) {
          b.mesh.scale.y += (b.targetScaleY - b.mesh.scale.y) * 0.04
        }
      })

      // Certificate floating tilt
      certGroup.rotation.z = Math.sin(elapsedTime * 0.7) * 0.04
      certGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.08
      certGroup.position.y = 0.75 + Math.sin(elapsedTime * 0.8) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    // 7. Resize handling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || 450
        const h = entry.contentRect.height || 450
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    })
    resizeObserver.observe(container)

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[380px] relative cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
      style={{ touchAction: 'none' }}
    />
  )
}

export const Hero3DWidgetDynamic = dynamic(
  () => Promise.resolve(Hero3DWidget),
  { ssr: false }
)

/* ── Cinematic Intro ────────────────────────────────────────────────────── */

interface CinematicIntroProps {
  onSkip: () => void
  onComplete: () => void
}

function CinematicIntroInner({ onSkip, onComplete }: CinematicIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xfff8eb, 2.0)
    dirLight.position.set(5, 8, 5)
    scene.add(dirLight)

    const goldPoint = new THREE.PointLight(0xc9a24b, 1.8, 15)
    goldPoint.position.set(0, 0, 3)
    scene.add(goldPoint)

    // Floating particles & gold coins
    const particlesGroup = new THREE.Group()
    scene.add(particlesGroup)

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a24b,
      metalness: 0.9,
      roughness: 0.15,
    })

    const coinGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 32)
    const floaters: { mesh: THREE.Mesh; rotX: number; rotY: number; speedZ: number }[] = []

    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(coinGeom, goldMaterial)
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 6 - 1
      )
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      particlesGroup.add(mesh)
      floaters.push({
        mesh,
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        speedZ: 0.01 + Math.random() * 0.02,
      })
    }

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      floaters.forEach((f) => {
        f.mesh.rotation.x += f.rotX
        f.mesh.rotation.y += f.rotY
        f.mesh.position.z += f.speedZ
        if (f.mesh.position.z > 5) f.mesh.position.z = -5
      })
      renderer.render(scene, camera)
    }

    animate()

    const timer = setTimeout(() => {
      setDone(true)
      onComplete()
    }, 3800)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [onComplete])

  if (done) return null

  return (
    <div className="fixed inset-0 z-[9990] bg-[#FAF8F3] flex items-center justify-center">
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

      {/* Overlay text */}
      <div className="relative z-10 text-center pointer-events-none select-none">
        <div
          className="font-serif font-bold text-6xl md:text-8xl text-[#0A1F44] opacity-0 animate-fade-in animation-delay-500"
          style={{ animationFillMode: 'forwards' }}
        >
          EXCELIUM
        </div>
        <div
          className="font-mono text-sm tracking-[0.3em] text-[#C9A24B] mt-2 opacity-0 animate-fade-in animation-delay-600"
          style={{ animationFillMode: 'forwards' }}
        >
          CONSULTING COMPTA
        </div>
      </div>

      {/* Gold line decorations */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="#C9A24B"
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="0"
          style={{ animation: 'drawLine 1s ease-out 0.3s both' }}
        />
      </svg>

      <button
        onClick={onSkip}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest uppercase text-[#A0782E] hover:text-[#0A1F44] border border-[#C9A24B]/30 hover:border-[#C9A24B] bg-white/80 px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm"
        aria-label="Passer l'intro"
      >
        Passer l&apos;intro
      </button>
    </div>
  )
}

export const CinematicIntro = dynamic(
  () => Promise.resolve(CinematicIntroInner),
  { ssr: false }
)
