'use client'

import React, { useState } from 'react'
import { FileText, FileSpreadsheet, FileArchive, Download, Lock, CheckCircle2, FileCode } from 'lucide-react'
import { formatFileSize, getSignedResourceDownloadUrl } from '@/lib/storage'
import { toast } from 'sonner'

export interface ResourceItem {
  id: string
  title: string
  fileName: string
  filePath: string
  sizeBytes: number
  fileTypeCategory: 'pdf' | 'excel' | 'word' | 'zip' | 'other'
}

interface Props {
  resources: ResourceItem[]
  isEnrolled?: boolean
  isFreePreview?: boolean
}

export default function LessonResourcesList({ resources, isEnrolled = true, isFreePreview = false }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const canDownload = isEnrolled || isFreePreview

  const handleDownload = async (res: ResourceItem) => {
    if (!canDownload) {
      toast.error('Veuillez vous inscrire à la formation pour télécharger ce document.')
      return
    }

    setDownloadingId(res.id)
    try {
      const signedUrl = await getSignedResourceDownloadUrl(res.filePath)
      toast.success(`Téléchargement de "${res.fileName}" démarré...`)
      
      // Trigger download
      const a = document.createElement('a')
      a.href = signedUrl
      a.download = res.fileName
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      toast.error('Erreur lors du téléchargement du fichier')
    } finally {
      setDownloadingId(null)
    }
  }

  const getIconForCategory = (cat: string) => {
    switch (cat) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />
      case 'excel': return <FileSpreadsheet className="w-5 h-5 text-emerald" />
      case 'word': return <FileText className="w-5 h-5 text-blue-500" />
      case 'zip': return <FileArchive className="w-5 h-5 text-purple-500" />
      default: return <FileCode className="w-5 h-5 text-gold" />
    }
  }

  if (!resources || resources.length === 0) return null

  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <h4 className="font-display font-bold text-navy text-xs uppercase tracking-wider flex items-center gap-2">
        <Download className="w-4 h-4 text-gold" /> Documents &amp; Supports de Cours ({resources.length})
      </h4>

      <div className="grid sm:grid-cols-2 gap-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between gap-3 hover:border-gold/30 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getIconForCategory(res.fileTypeCategory)}
              <div className="min-w-0">
                <div className="font-bold text-navy text-xs truncate group-hover:text-gold transition-colors">
                  {res.title || res.fileName}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {formatFileSize(res.sizeBytes)} • <span className="uppercase font-semibold">{res.fileTypeCategory}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload(res)}
              disabled={downloadingId === res.id}
              className="btn-gold py-1.5 px-3 text-xs font-bold rounded-xl inline-flex items-center gap-1 flex-shrink-0"
            >
              {canDownload ? (
                <>
                  <Download className="w-3.5 h-3.5" /> Télécharger
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-navy/60" /> Réservé
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
