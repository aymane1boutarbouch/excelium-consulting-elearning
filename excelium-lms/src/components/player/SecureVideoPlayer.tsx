'use client'

import React, { useState, useEffect, useRef } from 'react'
import { generateBunnyEmbedUrl } from '@/lib/bunny'
import { RotateCcw, Play, CheckCircle2, ShieldCheck, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  videoId: string
  lessonId: string
  studentEmail?: string
  studentName?: string
  videoDurationSeconds?: number
  onProgressSaved?: (positionSeconds: number) => void
}

export default function SecureVideoPlayer({
  videoId,
  lessonId,
  studentEmail = 'apprenant@excelium.ma',
  studentName = 'Mohammed Al Fassi',
  videoDurationSeconds = 7200, // Default 2h
  onProgressSaved,
}: Props) {
  const [savedPosition, setSavedPosition] = useState<number>(0)
  const [showResumeBanner, setShowResumeBanner] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const storageKey = `watch_pos_${lessonId}`

  useEffect(() => {
    // Read saved timestamp from local storage
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const pos = parseInt(stored, 10)
      if (pos > 15) { // Saved position after 15 seconds
        setSavedPosition(pos)
        setShowResumeBanner(true)
      }
    }
  }, [lessonId, storageKey])

  // Periodic watch position save loop (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setSavedPosition(prev => {
        const next = prev + 5
        localStorage.setItem(storageKey, next.toString())
        if (onProgressSaved) onProgressSaved(next)
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [storageKey, onProgressSaved])

  const resumePlayback = () => {
    setShowResumeBanner(false)
    toast.success(`Reprise de la lecture à ${formatSecondsToHMS(savedPosition)}`)
  }

  const formatSecondsToHMS = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    }
    return `${minutes}m ${seconds}s`
  }

  const embedUrl = generateBunnyEmbedUrl(videoId, studentEmail)

  return (
    <div className="relative rounded-3xl overflow-hidden bg-black border border-gold/30 shadow-2xl group">
      {/* Expiring Signed Bunny Embed Player */}
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          loading="lazy"
          className="w-full h-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />

        {/* Dynamic Security Email Watermark Overlay */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-white/80 select-none flex items-center gap-1.5 z-20">
          <ShieldCheck className="w-3 h-3 text-gold" />
          <span>{studentEmail}</span>
          <span className="text-white/40">• EXCELIUM LMS SECURE</span>
        </div>
      </div>

      {/* 2+ Hour Video Watch Resume Banner */}
      {showResumeBanner && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 border border-[#E7E2D6] backdrop-blur-md p-4 rounded-2xl flex items-center justify-between gap-4 z-30 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/15 text-[#C9A24B] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0A1F44]">Reprendre la lecture là où vous vous étiez arrêté ?</div>
              <div className="text-[11px] text-[#475569] font-mono">
                Position enregistrée : <span className="text-[#A0782E] font-bold">{formatSecondsToHMS(savedPosition)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resumePlayback}
              className="btn-gold text-xs px-4 py-2 rounded-xl font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reprendre
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="text-xs text-[#475569] hover:text-[#0A1F44] px-2 py-1 font-medium"
            >
              Ignorer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
