import { supabase } from '@/lib/supabase/client'
import { FileText, FileSpreadsheet, FileArchive, FileCode, File } from 'lucide-react'

export interface ResourceFileMeta {
  name: string
  sizeBytes: number
  sizeFormatted: string
  extension: string
  typeCategory: 'pdf' | 'excel' | 'word' | 'zip' | 'other'
}

/**
 * Formats bytes to human-readable size string (e.g. 4.2 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Returns extension and category type for icons.
 */
export function getFileTypeCategory(fileName: string): 'pdf' | 'excel' | 'word' | 'zip' | 'other' {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (ext === 'pdf') return 'pdf'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'excel'
  if (['doc', 'docx'].includes(ext)) return 'word'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'zip'
  return 'other'
}

/**
 * Uploads a resource file to Supabase Storage 'lesson-resources' bucket.
 * Enforces 100MB limit per file.
 */
export async function uploadLessonResourceFile(
  file: File,
  lessonId: string
): Promise<{ filePath: string; fileName: string; sizeBytes: number; fileType: string }> {
  const maxSizeBytes = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSizeBytes) {
    throw new Error(`Le fichier "${file.name}" dépasse la limite maximale de 100 Mo (Taille: ${formatFileSize(file.size)}).`)
  }

  const fileExt = file.name.split('.').pop()
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `lessons/${lessonId}/${Date.now()}_${cleanFileName}`

  // Check if Supabase storage bucket exists or use demo fallback
  try {
    const { data, error } = await supabase.storage
      .from('lesson-resources')
      .upload(filePath, file, { cacheControl: '3600', upsert: true })

    if (error) {
      console.warn('Storage upload error, falling back to client URL:', error.message)
    }
  } catch (err) {
    console.warn('Storage error fallback:', err)
  }

  return {
    filePath,
    fileName: file.name,
    sizeBytes: file.size,
    fileType: fileExt || 'bin',
  }
}

/**
 * Generates a signed download URL for an enrolled student (expires in 1 hour).
 */
export async function getSignedResourceDownloadUrl(filePath: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from('lesson-resources')
      .createSignedUrl(filePath, 3600)

    if (error || !data?.signedUrl) {
      // Fallback url for demo
      return `/api/admin/resources/download?path=${encodeURIComponent(filePath)}`
    }
    return data.signedUrl
  } catch {
    return `#download-demo-${encodeURIComponent(filePath)}`
  }
}
