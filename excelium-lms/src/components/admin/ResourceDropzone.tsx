'use client'

import React, { useState } from 'react'
import { FileText, FileSpreadsheet, FileArchive, Upload, Trash2, CheckCircle2, Download, AlertCircle, FileCode } from 'lucide-react'
import { uploadLessonResourceFile, formatFileSize, getFileTypeCategory } from '@/lib/storage'
import { toast } from 'sonner'

export interface AttachedResource {
  id: string
  fileName: string
  filePath: string
  sizeBytes: number
  fileTypeCategory: 'pdf' | 'excel' | 'word' | 'zip' | 'other'
}

interface Props {
  lessonId: string
  initialResources?: AttachedResource[]
  onResourcesChanged?: (resources: AttachedResource[]) => void
}

export default function ResourceDropzone({ lessonId, initialResources = [], onResourcesChanged }: Props) {
  const [resources, setResources] = useState<AttachedResource[]>(initialResources)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    setUploading(true)
    const newResources: AttachedResource[] = []

    for (const f of fileArray) {
      try {
        const uploaded = await uploadLessonResourceFile(f, lessonId)
        const resObj: AttachedResource = {
          id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          fileName: uploaded.fileName,
          filePath: uploaded.filePath,
          sizeBytes: uploaded.sizeBytes,
          fileTypeCategory: getFileTypeCategory(uploaded.fileName),
        }
        newResources.push(resObj)
        toast.success(`Fichier "${f.name}" attaché (${formatFileSize(f.size)})`)
      } catch (err: any) {
        toast.error(err.message || `Erreur d'upload pour ${f.name}`)
      }
    }

    const updated = [...resources, ...newResources]
    setResources(updated)
    if (onResourcesChanged) onResourcesChanged(updated)
    setUploading(false)
  }

  const removeResource = (id: string) => {
    const updated = resources.filter(r => r.id !== id)
    setResources(updated)
    if (onResourcesChanged) onResourcesChanged(updated)
    toast.success('Ressource retirée')
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-navy dark:text-white uppercase tracking-wider">
          Fichiers joints &amp; Documents Téléchargeables ({resources.length})
        </label>
        <span className="text-[11px] text-muted-foreground font-mono">100 Mo max / fichier</span>
      </div>

      {/* Dropzone */}
      <label className="border-2 border-dashed border-border hover:border-gold rounded-2xl p-5 text-center cursor-pointer transition-all block bg-muted/20 hover:bg-muted/40">
        <input
          type="file"
          multiple
          accept=".pdf,.xlsx,.xls,.doc,.docx,.zip,.rar,.csv,.7z"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
        <Upload className="w-6 h-6 text-gold mx-auto mb-1.5" />
        <div className="text-xs font-bold text-navy dark:text-white">
          {uploading ? 'Téléversement des documents en cours...' : 'Glissez-déposez des fichiers (PDF, Excel, Word, ZIP)'}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">
          Sécurité Supabase Storage : Téléchargement réservé uniquement aux étudiants inscrits via liens signés
        </div>
      </label>

      {/* List of Attached Files */}
      {resources.length > 0 && (
        <div className="space-y-2">
          {resources.map((res) => (
            <div
              key={res.id}
              className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getIconForCategory(res.fileTypeCategory)}
                <div className="min-w-0">
                  <div className="font-bold text-navy dark:text-white truncate">{res.fileName}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {formatFileSize(res.sizeBytes)} • <span className="uppercase text-gold font-bold">{res.fileTypeCategory}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeResource(res.id)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
